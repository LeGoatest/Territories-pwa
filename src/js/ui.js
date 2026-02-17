/**
 * Territories Game UI Logic
 */
import { reducer } from './engine.js';

let state = JSON.parse(localStorage.getItem('territories_state')) || reducer(null, { type: 'INIT' });

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
  renderPlayers();
  renderBoard();
  renderControls();
  renderLog();
}

function renderHeader() {
  document.getElementById('round-num').textContent = state.round;
  const currentPlayer = state.players[state.currentPlayerIndex];
  const turnEl = document.getElementById('current-turn');
  turnEl.textContent = currentPlayer.name;
  turnEl.style.color = currentPlayer.color;
}

function renderPlayers() {
  const container = document.getElementById('player-list');
  container.innerHTML = state.players.map(p => `
    <div class="p-2 border-b border-gray-100 flex justify-between items-center ${state.players[state.currentPlayerIndex].id === p.id ? 'bg-gray-50 font-bold' : ''}">
      <span style="color: ${p.color}">${p.name}</span>
      <span class="text-xs text-gray-400">T: ${state.board.filter(t => t.owner === p.id).length}</span>
    </div>
  `).join('');
}

function renderBoard() {
  const container = document.getElementById('board');
  container.innerHTML = state.board.map(t => `
    <div
      onclick="handleTerritoryClick(${t.id})"
      class="aspect-square border border-gray-200 flex items-center justify-center cursor-pointer transition-colors hover:opacity-80"
      style="background-color: ${state.players.find(p => p.id === t.owner).color}22; border-color: ${state.players.find(p => p.id === t.owner).color}"
    >
      <span class="text-xs font-bold">${t.troops}</span>
    </div>
  `).join('');
}

function renderControls() {
  const container = document.getElementById('controls');
  container.innerHTML = `
    <div class="flex flex-col gap-2">
      <div class="text-xs uppercase font-bold text-gray-400 mb-2">Phase: ${state.phase}</div>
      <button
        onclick="dispatchAction({type: 'ATTACK'})"
        class="bg-black text-white px-4 py-2 rounded ${state.phase !== 'attack' ? 'opacity-50 cursor-not-allowed' : ''}"
        ${state.phase !== 'attack' ? 'disabled' : ''}
      >Skip Attack</button>
      <button
        onclick="dispatchAction({type: 'FORTIFY'})"
        class="bg-black text-white px-4 py-2 rounded ${state.phase !== 'fortify' ? 'opacity-50 cursor-not-allowed' : ''}"
        ${state.phase !== 'fortify' ? 'disabled' : ''}
      >End Turn</button>
      <button
        onclick="dispatchAction({type: 'RESET'})"
        class="mt-8 text-xs text-red-500 hover:underline"
      >Reset Game</button>
    </div>
  `;
}

function renderLog() {
  const container = document.getElementById('event-log');
  container.innerHTML = state.log.slice(-5).reverse().map(l => `
    <div class="text-xs text-gray-500 mb-1 border-b border-gray-50 pb-1">${l}</div>
  `).join('');
}

// Global exposure for event handlers
window.handleTerritoryClick = (id) => {
  if (state.phase === 'reinforce') {
    dispatch({ type: 'REINFORCE', territoryId: id });
  }
};

window.dispatchAction = (action) => {
  dispatch(action);
};

// Initial render
document.addEventListener('DOMContentLoaded', render);
