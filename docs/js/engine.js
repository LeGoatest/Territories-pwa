/**
 * Territories Game Engine - Deterministic Reducer
 * Full Parity with lehaSVV2009/territories
 */

export const CELL_TYPE = {
  EMPTY: "EMPTY",
  PLAYER_0: "PLAYER_0",
  PLAYER_1: "PLAYER_1"
};

export const ROWS = 15;
export const COLS = 40;

export const INITIAL_STATE = {
  board: Array(ROWS).fill(null).map(() => Array(COLS).fill(CELL_TYPE.EMPTY)),
  players: [
    { id: "0", name: "Player 1", color: "#375E97" },
    { id: "1", name: "Player 2", color: "#FB6542" }
  ],
  currentPlayerIndex: 0,
  dices: [0, 0],
  status: 'active',
  log: ["Roll the dices to start!"]
};

export function reducer(state, action) {
  if (!state) return INITIAL_STATE;

  switch (action.type) {
    case 'INIT':
      return { ...INITIAL_STATE, board: Array(ROWS).fill(null).map(() => Array(COLS).fill(CELL_TYPE.EMPTY)) };

    case 'ROLL_DICES':
      if (state.dices[0] !== 0) return state;
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      return { ...state, dices: [d1, d2], log: [...state.log.slice(-10), `Rolled ${d1}x${d2}`] };

    case 'SWITCH_DICES':
      return { ...state, dices: [state.dices[1], state.dices[0]] };

    case 'PLACE_RECTANGLE':
      const [h, w] = state.dices;
      if (h === 0 || w === 0) return state;

      if (canDropRectangle(state, action.row, action.col, h, w)) {
        const newBoard = state.board.map((row, rIdx) =>
          row.map((cell, cIdx) => {
            if (rIdx >= action.row && rIdx < action.row + h && cIdx >= action.col && cIdx < action.col + w) {
              return state.currentPlayerIndex === 0 ? CELL_TYPE.PLAYER_0 : CELL_TYPE.PLAYER_1;
            }
            return cell;
          })
        );

        return {
          ...state,
          board: newBoard,
          dices: [0, 0],
          currentPlayerIndex: (state.currentPlayerIndex + 1) % state.players.length,
          log: [...state.log.slice(-10), `${state.players[state.currentPlayerIndex].name} placed ${h}x${w}`]
        };
      }
      return state;

    case 'SKIP_TURN':
      return {
        ...state,
        dices: [0, 0],
        currentPlayerIndex: (state.currentPlayerIndex + 1) % state.players.length,
        log: [...state.log.slice(-10), `${state.players[state.currentPlayerIndex].name} skipped.`]
      };

    case 'RESET':
      return reducer(null, { type: 'INIT' });

    default:
      return state;
  }
}

export function canDropRectangle(state, row, col, h, w) {
  // 1. Bounds check
  if (row < 0 || row + h > ROWS || col < 0 || col + w > COLS) return false;

  // 2. Overlap check
  for (let r = row; r < row + h; r++) {
    for (let c = col; c < col + w; c++) {
      if (state.board[r][c] !== CELL_TYPE.EMPTY) return false;
    }
  }

  const isPlayer0 = state.currentPlayerIndex === 0;

  // 3. Starting position check
  if (isPlayer0) {
    if (row === 0 && col === 0) return true;
  } else {
    if (row + h === ROWS && col + w === COLS) return true;
  }

  // 4. Adjacency check
  const targetCell = isPlayer0 ? CELL_TYPE.PLAYER_0 : CELL_TYPE.PLAYER_1;

  // Check neighbors of the entire rectangle
  // Top neighbor
  if (row > 0) {
    for (let c = col; c < col + w; c++) {
      if (state.board[row - 1][c] === targetCell) return true;
    }
  }
  // Bottom neighbor
  if (row + h < ROWS) {
    for (let c = col; c < col + w; c++) {
      if (state.board[row + h][c] === targetCell) return true;
    }
  }
  // Left neighbor
  if (col > 0) {
    for (let r = row; r < row + h; r++) {
      if (state.board[r][col - 1] === targetCell) return true;
    }
  }
  // Right neighbor
  if (col + w < COLS) {
    for (let r = row; r < row + h; r++) {
      if (state.board[r][col + w] === targetCell) return true;
    }
  }

  return false;
}
