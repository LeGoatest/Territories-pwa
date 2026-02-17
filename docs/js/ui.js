/**
 * Territories Game UI Logic
 * Full Parity with lehaSVV2009/territories
 */
import { reducer, canDropRectangle, CELL_TYPE, ROWS, COLS } from './engine.js';

let state = JSON.parse(localStorage.getItem('territories_state')) || reducer(null, { type: 'INIT' });
let hoverRow = -1;
let hoverCol = -1;

function saveState() {
  localStorage.setItem('territories_state', JSON.stringify(state));
}

function dispatch(action) {
  state = reducer(state, action);
  saveState();
  render();
}

export function render() {
  renderHeader();
  renderScore();
  renderBoard();
  renderControls();
  renderLog();
}

function renderHeader() {
  const turnEl = document.getElementById('current-turn');
  if (turnEl) {
    const p = state.players[state.currentPlayerIndex];
    turnEl.textContent = p.name;
    turnEl.style.color = p.color;
    document.getElementById('turn-dot').style.backgroundColor = p.color;
  }
}

function renderScore() {
  const container = document.getElementById('player-list');
  if (!container) return;

  container.innerHTML = state.players.map((p, idx) => {
    const count = state.board.flat().filter(cell => cell === (idx === 0 ? CELL_TYPE.PLAYER_0 : CELL_TYPE.PLAYER_1)).length;
    const isCurrent = state.currentPlayerIndex === idx;
    return `
      <div class="px-4 py-3 border-b border-gray-100 flex justify-between items-center ${isCurrent ? 'bg-gray-50' : ''}">
        <span class="font-bold" style="color: ${p.color}">${p.name}</span>
        <span class="text-xs font-mono bg-gray-200 px-2 py-1 rounded-md text-gray-600">${count} pts</span>
      </div>
    `;
  }).join('');
}

function renderBoard() {
  const container = document.getElementById('board');
  if (!container) return;

  const [h, w] = state.dices;
  const isPossible = hoverRow !== -1 && h > 0 && w > 0 && canDropRectangle(state, hoverRow, hoverCol, h, w);

  // Use a fragment or string join for performance with 600 cells
  const cells = [];
  for (let rIdx = 0; rIdx < ROWS; rIdx++) {
    for (let cIdx = 0; cIdx < COLS; cIdx++) {
      const cell = state.board[rIdx][cIdx];
      let style = '';

      if (cell === CELL_TYPE.PLAYER_0) style = `background-color: ${state.players[0].color}`;
      else if (cell === CELL_TYPE.PLAYER_1) style = `background-color: ${state.players[1].color}`;

      // Hover preview
      if (hoverRow !== -1 && h > 0 && w > 0 && rIdx >= hoverRow && rIdx < hoverRow + h && cIdx >= hoverCol && cIdx < hoverCol + w) {
        if (isPossible) {
          style = `background-color: ${state.players[state.currentPlayerIndex].color}88`;
        } else {
          style = `background-color: rgba(239, 68, 68, 0.4)`;
        }
      }

      cells.push(`
        <div
          onmouseenter="handleCellHover(${rIdx}, ${cIdx})"
          onclick="handleBoardClick(${rIdx}, ${cIdx})"
          class="w-full h-full cursor-crosshair transition-colors"
          style="${style}"
        ></div>
      `);
    }
  }
  container.innerHTML = cells.join('');
}

function renderControls() {
  const container = document.getElementById('controls');
  if (!container) return;

  const [d1, d2] = state.dices;
  const hasDice = d1 > 0;

  container.innerHTML = `
    <div class="flex flex-col gap-4">
      <div class="flex items-center justify-between px-1">
        <div class="text-[10px] font-black uppercase tracking-widest text-gray-400">Roll Dimensions</div>
        ${hasDice ? `<div class="text-2xl font-black italic tracking-tighter text-black">${d1} <span class="text-gray-300">×</span> ${d2}</div>` : ''}
      </div>

      <button
        onclick="dispatchAction({type: 'ROLL_DICES'})"
        class="w-full py-5 rounded-2xl font-black uppercase tracking-widest transition-all ${!hasDice ? 'bg-black text-white shadow-xl shadow-black/20 hover:scale-[1.02]' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}"
        ${hasDice ? 'disabled' : ''}
      >
        <div class="flex items-center justify-center gap-3">
            <span class="iconify" data-icon="mdi:dice-multiple" data-width="24"></span>
            Roll Action
        </div>
      </button>

      <div class="grid grid-cols-2 gap-3">
        <button
            onclick="dispatchAction({type: 'SWITCH_DICES'})"
            class="py-3 bg-white border-2 border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-black transition-all ${!hasDice ? 'opacity-20' : ''}"
            ${!hasDice ? 'disabled' : ''}
        >Flip Axis</button>
        <button
            onclick="dispatchAction({type: 'SKIP_TURN'})"
            class="py-3 bg-white border-2 border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-red-500 hover:text-red-500 transition-all ${!hasDice ? 'opacity-20' : ''}"
            ${!hasDice ? 'disabled' : ''}
        >Pass</button>
      </div>

      <button
        onclick="dispatchAction({type: 'RESET'})"
        class="mt-6 text-[9px] font-bold uppercase tracking-[0.2em] text-gray-300 hover:text-black transition-colors text-center"
      >Reset Game Session</button>
    </div>
  `;
}

function renderLog() {
  const container = document.getElementById('event-log');
  if (!container) return;
  container.innerHTML = state.log.reverse().map(l => `
    <div class="text-[10px] font-bold text-gray-400 mb-2.5 flex gap-2">
        <span class="text-gray-200">/</span>
        ${l}
    </div>
  `).join('');
}

window.handleCellHover = (r, c) => {
  hoverRow = r;
  hoverCol = c;
  renderBoard();
};

window.handleBoardClick = (r, c) => {
  dispatch({ type: 'PLACE_RECTANGLE', row: r, col: c });
};

window.dispatchAction = (action) => {
  dispatch(action);
};

// Initial render
document.addEventListener('DOMContentLoaded', () => {
    render();
    const board = document.getElementById('board');
    if (board) {
        board.onmouseleave = () => {
            hoverRow = -1;
            hoverCol = -1;
            renderBoard();
        };
    }
});
