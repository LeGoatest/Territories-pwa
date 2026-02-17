
/**
 * Territories Game Engine - High Fidelity Port
 */

export const CELL_TYPE = {
    EMPTY: "EMPTY",
    PLAYER_1: "OCCUPIED_BY_PLAYER_1",
    PLAYER_2: "OCCUPIED_BY_PLAYER_2"
};

export function isValidMove(state, r, c, dr, dc, player) {
    const rows = state.board;
    if (r < 0 || c < 0 || r + dr > state.rows || c + dc > state.cols) return false;

    // Check if any cell is occupied
    for (let i = 0; i < dr; i++) {
        for (let j = 0; j < dc; j++) {
            if (rows[r + i][c + j] !== CELL_TYPE.EMPTY) return false;
        }
    }

    // First turn logic
    const player1 = player === 1;
    const player2 = player === 2;

    const hasAnyCell = rows.some(row => row.some(cell =>
        cell === (player1 ? CELL_TYPE.PLAYER_1 : CELL_TYPE.PLAYER_2)
    ));

    if (!hasAnyCell) {
        if (player1) return r === 0 && c === 0;
        if (player2) return r === state.rows - dr && c === state.cols - dc;
    }

    // Adjacency logic
    for (let i = 0; i < dr; i++) {
        for (let j = 0; j < dc; j++) {
            const currR = r + i;
            const currC = c + j;
            const neighbors = [
                [currR - 1, currC], [currR + 1, currC], [currR, currC - 1], [currR, currC + 1]
            ];
            for (const [ni, nj] of neighbors) {
                if (ni >= 0 && ni < state.rows && nj >= 0 && nj < state.cols) {
                    const neighborVal = rows[ni][nj];
                    if (player1 && neighborVal === CELL_TYPE.PLAYER_1) return true;
                    if (player2 && neighborVal === CELL_TYPE.PLAYER_2) return true;
                }
            }
        }
    }

    return false;
}

export function applyMove(board, r, c, dr, dc, player) {
    const newBoard = board.map(row => [...row]);
    const val = player === 1 ? CELL_TYPE.PLAYER_1 : CELL_TYPE.PLAYER_2;
    for (let i = 0; i < dr; i++) {
        for (let j = 0; j < dc; j++) {
            newBoard[r + i][c + j] = val;
        }
    }
    return newBoard;
}

/**
 * Ported from findClosedLoops.js and Game.js
 */
export function checkClosedLoops(board) {
    const rows = board.length;
    const cols = board[0].length;
    const newBoard = board.map(row => [...row]);
    const checked = Array(rows).fill().map(() => Array(cols).fill(false));

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (newBoard[r][c] === CELL_TYPE.EMPTY && !checked[r][c]) {
                // Find region
                const region = [];
                const neighborsValues = new Set();
                const queue = [[r, c]];
                checked[r][c] = true;

                let touchesBorder = false;
                let head = 0;
                while (head < queue.length) {
                    const [currR, currC] = queue[head++];
                    region.push([currR, currC]);

                    const adjacent = [[currR-1, currC], [currR+1, currC], [currR, currC-1], [currR, currC+1]];
                    for (const [nr, nc] of adjacent) {
                        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) {
                            touchesBorder = true;
                        } else {
                            const val = board[nr][nc];
                            if (val === CELL_TYPE.EMPTY) {
                                if (!checked[nr][nc]) {
                                    checked[nr][nc] = true;
                                    queue.push([nr, nc]);
                                }
                            } else {
                                neighborsValues.add(val);
                            }
                        }
                    }
                }

                // If the loop has EXACTLY one unique neighbor value, it is auto-occupied.
                // Note: the original Game.js logic only auto-occupies if both players have cells on board.
                // And it checks neigboursValues.length === 1.
                if (!touchesBorder && neighborsValues.size === 1) {
                    const owner = Array.from(neighborsValues)[0];
                    for (const [rr, cc] of region) {
                        newBoard[rr][cc] = owner;
                    }
                }
            }
        }
    }
    return newBoard;
}

export function calculateScore(board, player) {
    const target = player === 1 ? CELL_TYPE.PLAYER_1 : CELL_TYPE.PLAYER_2;
    return board.flat().filter(cell => cell === target).length;
}

export function getBestMove(state, player) {
    let bestMoves = [];
    const dice = state.dice;
    const orientations = [[dice[0], dice[1]]];
    if (dice[0] !== dice[1]) orientations.push([dice[1], dice[0]]);

    for (let r = 0; r < state.rows; r++) {
        for (let c = 0; c < state.cols; c++) {
            for (const [dr, dc] of orientations) {
                if (isValidMove(state, r, c, dr, dc, player)) {
                    bestMoves.push({ r, c, dr, dc, score: dr * dc });
                }
            }
        }
    }

    if (bestMoves.length === 0) return null;
    bestMoves.sort((a, b) => b.score - a.score);
    const topScore = bestMoves[0].score;
    const candidates = bestMoves.filter(m => m.score === topScore);
    return candidates[Math.floor(Math.random() * candidates.length)];
}
