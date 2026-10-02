const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Ensure upload directory exists (safely wrapped for serverless environments)
const uploadDir = path.join(__dirname, '../../../frontend/assets/images/uploads');
try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (e) {
  // Ignored in read-only serverless environments
}

/**
 * POST /api/upload
 * Expects JSON: { data: "data:image/png;base64,...", filename: "my-photo.png" }
 * Saves to /assets/images/uploads/<unique-name> on local, or returns base64 data URI on serverless
 */
router.post('/', (req, res) => {
  try {
    const { data, filename } = req.body;
    if (!data) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    // Parse base64 header (e.g. "data:image/png;base64,iVBORw...")
    const matches = data.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    let base64Data = data;
    let extension = 'png';

    if (matches && matches.length === 3) {
      const mime = matches[1];
      base64Data = matches[2];
      if (mime.includes('jpeg') || mime.includes('jpg')) extension = 'jpg';
      else if (mime.includes('png')) extension = 'png';
      else if (mime.includes('webp')) extension = 'webp';
      else if (mime.includes('svg')) extension = 'svg';
    } else if (filename) {
      const ext = path.extname(filename).toLowerCase().replace('.', '');
      if (ext) extension = ext;
    }

    // Clean original filename
    const rawName = filename 
      ? path.basename(filename, path.extname(filename)).replace(/[^a-zA-Z0-9-_]/g, '_')
      : 'product';

    const safeFilename = `${rawName}-${Date.now()}.${extension}`;
    const destinationPath = path.join(uploadDir, safeFilename);

    // Write binary buffer if filesystem is writable
    const buffer = Buffer.from(base64Data, 'base64');
    try {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      fs.writeFileSync(destinationPath, buffer);
      const publicUrl = `/assets/images/uploads/${safeFilename}`;
      console.log(`📸 Image successfully stored: ${publicUrl}`);

      return res.status(201).json({
        success: true,
        url: publicUrl,
        filename: safeFilename,
        size: buffer.length
      });
    } catch (writeErr) {
      console.warn('ℹ️ Serverless read-only mode active: returning data URI directly.');
      return res.status(201).json({
        success: true,
        url: data,
        filename: safeFilename,
        size: buffer.length
      });
    }
  } catch (err) {
    console.error('Error handling image upload:', err);
    return res.status(500).json({ error: 'File upload failed: ' + err.message });
  }
});

module.exports = router;
