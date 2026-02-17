/**
 * Territories Game Engine - Deterministic Reducer
 */

export const INITIAL_STATE = {
  board: [], // { id, owner, troops }
  players: [
    { id: 1, name: "Player 1", color: "red", territories: 0, troops: 0 },
    { id: 2, name: "Player 2", color: "blue", territories: 0, troops: 0 }
  ],
  currentPlayerIndex: 0,
  phase: 'reinforce', // reinforce, attack, fortify
  round: 1,
  status: 'active',
  log: ["Game started."]
};

export function createBoard(size = 10) {
  const board = [];
  for (let i = 0; i < size * size; i++) {
    board.push({
      id: i,
      owner: (i < size * size / 2) ? 1 : 2,
      troops: 2
    });
  }
  return board;
}

export function reducer(state, action) {
  switch (action.type) {
    case 'INIT':
      const board = createBoard();
      return { ...INITIAL_STATE, board, log: ["New game initialized."] };

    case 'REINFORCE':
      if (state.phase !== 'reinforce') return state;
      // Simple reinforcement: add 1 troop to selected territory
      const newBoard = state.board.map(t => {
        if (t.id === action.territoryId && t.owner === state.players[state.currentPlayerIndex].id) {
          return { ...t, troops: t.troops + 1 };
        }
        return t;
      });
      return { ...state, board: newBoard, phase: 'attack', log: [`Player ${state.currentPlayerIndex + 1} reinforced territory ${action.territoryId}.`] };

    case 'ATTACK':
      if (state.phase !== 'attack') return state;
      // Placeholder for attack logic
      return { ...state, phase: 'fortify', log: [`Player ${state.currentPlayerIndex + 1} skipped attack.`] };

    case 'FORTIFY':
      if (state.phase !== 'fortify') return state;
      // Placeholder for fortify logic
      return nextTurn(state);

    case 'RESET':
      return reducer(INITIAL_STATE, { type: 'INIT' });

    default:
      return state;
  }
}

function nextTurn(state) {
  let nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
  let nextRound = state.round;
  if (nextPlayerIndex === 0) nextRound++;

  return {
    ...state,
    currentPlayerIndex: nextPlayerIndex,
    round: nextRound,
    phase: 'reinforce',
    log: [...state.log, `Turn ${nextRound}: Player ${nextPlayerIndex + 1}'s turn.`]
  };
}
