/**
 * PROSIX SPORTS - UNIFORM CUSTOMIZER ENGINE (Vanilla JS + SVG Render)
 */

document.addEventListener('DOMContentLoaded', () => {
  const jerseySvg = document.getElementById('jerseyPreviewSvg');
  const baseFill = document.getElementById('jerseyBase');
  const sleeveFill = document.getElementById('jerseySleeves');
  const collarFill = document.getElementById('jerseyCollar');
  const chestText = document.getElementById('jerseyChestText');
  const numberText = document.getElementById('jerseyNumberText');
  const backNameText = document.getElementById('jerseyBackNameText');

  const primaryColorPicker = document.getElementById('customPrimaryColor');
  const secondaryColorPicker = document.getElementById('customSecondaryColor');
  const textColorPicker = document.getElementById('customTextColor');

  const teamNameInput = document.getElementById('customTeamName');
  const playerNumberInput = document.getElementById('customPlayerNumber');
  const playerNameInput = document.getElementById('customPlayerName');

  const viewFrontBtn = document.getElementById('viewFrontBtn');
  const viewBackBtn = document.getElementById('viewBackBtn');
  let currentView = 'front';

  function updateUniform() {
    if (baseFill) baseFill.setAttribute('fill', primaryColorPicker?.value || '#000000');
    if (sleeveFill) sleeveFill.setAttribute('fill', secondaryColorPicker?.value || '#ff0000');
    if (collarFill) collarFill.setAttribute('fill', secondaryColorPicker?.value || '#ff0000');

    const textColor = textColorPicker?.value || '#ffffff';
    if (chestText) {
      chestText.setAttribute('fill', textColor);
      chestText.textContent = teamNameInput?.value.toUpperCase() || 'PROSIX';
    }
    if (numberText) {
      numberText.setAttribute('fill', textColor);
      numberText.textContent = playerNumberInput?.value || '07';
    }
    if (backNameText) {
      backNameText.setAttribute('fill', textColor);
      backNameText.textContent = playerNameInput?.value.toUpperCase() || 'CHAMPION';
    }
  }

  function setView(view) {
    currentView = view;
    viewFrontBtn?.classList.toggle('active', view === 'front');
    viewBackBtn?.classList.toggle('active', view === 'back');

    if (view === 'front') {
      if (chestText) chestText.style.display = 'block';
      if (backNameText) backNameText.style.display = 'none';
      if (numberText) {
        numberText.setAttribute('y', '320');
        numberText.setAttribute('font-size', '68');
      }
    } else {
      if (chestText) chestText.style.display = 'none';
      if (backNameText) backNameText.style.display = 'block';
      if (numberText) {
        numberText.setAttribute('y', '310');
        numberText.setAttribute('font-size', '95');
      }
    }
  }

  viewFrontBtn?.addEventListener('click', () => setView('front'));
  viewBackBtn?.addEventListener('click', () => setView('back'));

  primaryColorPicker?.addEventListener('input', updateUniform);
  secondaryColorPicker?.addEventListener('input', updateUniform);
  textColorPicker?.addEventListener('input', updateUniform);

  teamNameInput?.addEventListener('input', updateUniform);
  playerNumberInput?.addEventListener('input', updateUniform);
  playerNameInput?.addEventListener('input', updateUniform);

  // Initial render
  setView('front');
  updateUniform();

  // ==========================================
  // Team Roster Management
  // ==========================================
  const rosterTableBody = document.getElementById('rosterTableBody');
  const addPlayerBtn = document.getElementById('addPlayerRowBtn');
  const totalCountEl = document.getElementById('rosterTotalCount');
  const totalPriceEl = document.getElementById('rosterTotalPrice');
  const UNIT_PRICE = 65.00;

  function updateRosterSummary() {
    const rows = rosterTableBody?.querySelectorAll('tr') || [];
    const count = rows.length;
    if (totalCountEl) totalCountEl.textContent = count;
    if (totalPriceEl) totalPriceEl.textContent = `$${(count * UNIT_PRICE).toFixed(2)}`;
  }

  function addRosterRow(name = '', number = '', size = 'L') {
    if (!rosterTableBody) return;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input type="text" class="form-control form-control-sm player-name-val" value="${name}" placeholder="Player Name"></td>
      <td><input type="text" class="form-control form-control-sm player-num-val" value="${number}" placeholder="##" style="max-width: 80px;"></td>
      <td>
        <select class="form-select form-select-sm player-size-val">
          <option ${size === 'S' ? 'selected' : ''}>S</option>
          <option ${size === 'M' ? 'selected' : ''}>M</option>
          <option ${size === 'L' ? 'selected' : ''}>L</option>
          <option ${size === 'XL' ? 'selected' : ''}>XL</option>
          <option ${size === '2XL' ? 'selected' : ''}>2XL</option>
        </select>
      </td>
      <td class="text-center">
        <button class="btn btn-outline-danger btn-sm p-1 delete-row-btn" type="button">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    `;
    tr.querySelector('.delete-row-btn')?.addEventListener('click', () => {
      tr.remove();
      updateRosterSummary();
    });
    rosterTableBody.appendChild(tr);
    updateRosterSummary();
  }

  addPlayerBtn?.addEventListener('click', () => {
    addRosterRow();
  });

  // Default initial rows
  if (rosterTableBody && rosterTableBody.children.length === 0) {
    addRosterRow('Captain', '01', 'L');
    addRosterRow('Striker', '07', 'M');
    addRosterRow('Defender', '10', 'XL');
  }

  // ==========================================
  // Proceed to Place Order
  // ==========================================
  const addCustomToCartBtn = document.getElementById('addCustomOrderToCartBtn');
  addCustomToCartBtn?.addEventListener('click', () => {
    const rows = rosterTableBody?.querySelectorAll('tr') || [];
    const count = Math.max(1, rows.length);
    const teamName = teamNameInput?.value || 'Custom Team';

    sessionStorage.setItem('customOrderTeam', teamName);
    sessionStorage.setItem('customOrderCount', count);
    if (typeof CartStore !== 'undefined' && CartStore.showToast) {
      CartStore.showToast(`Design saved for ${teamName}! Redirecting to team order form...`);
    }
    setTimeout(() => {
      window.location.href = 'placeorder.html';
    }, 700);
  });
});
