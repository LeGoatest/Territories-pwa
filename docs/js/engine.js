
/**
 * Territories Game Engine - Core Logic
 */

export function isValidMove(state, r, c, dr, dc, player) {
    if (r < 0 || c < 0 || r + dr > state.rows || c + dc > state.cols) return false;

    // Must be empty
    for (let i = r; i < r + dr; i++) {
        for (let j = c; j < c + dc; j++) {
            if (state.board[i][j] !== 0) return false;
        }
    }

    // Must be adjacent to existing territory (except first move)
    const isFirstMove = !state.board.some(row => row.some(cell => cell === player));
    if (isFirstMove) {
        // First move must be near player starting corner
        // Player 1: top-left (0,0), Player 2: bottom-right (rows-1, cols-1)
        if (player === 1) {
            return r === 0 && c === 0;
        } else {
            return r + dr === state.rows && c + dc === state.cols;
        }
    }

    // Check adjacency
    for (let i = r; i < r + dr; i++) {
        for (let j = c; j < c + dc; j++) {
            const neighbors = [
                [i - 1, j], [i + 1, j], [i, j - 1], [i, j + 1]
            ];
            for (const [ni, nj] of neighbors) {
                if (ni >= 0 && ni < state.rows && nj >= 0 && nj < state.cols) {
                    if (state.board[ni][nj] === player) return true;
                }
            }
        }
    }

    return false;
}

export function applyMove(board, r, c, dr, dc, player) {
    const newBoard = board.map(row => [...row]);
    for (let i = r; i < r + dr; i++) {
        for (let j = c; j < c + dc; j++) {
            newBoard[i][j] = player;
        }
    }
    return newBoard;
}

export function calculateScore(board, player) {
    return board.flat().filter(cell => cell === player).length;
}

export function checkClosedLoops(board, player) {
    const rows = board.length;
    const cols = board[0].length;
    const newBoard = board.map(row => [...row]);
    const visited = new Set();

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (newBoard[r][c] === 0 && !visited.has(`${r},${c}`)) {
                const region = [];
                const q = [[r, c]];
                visited.add(`${r},${c}`);
                let touchesEdge = false;
                let touchesOther = false;

                let head = 0;
                while(head < q.length){
                    const [currR, currC] = q[head++];
                    region.push([currR, currC]);

                    const neighbors = [[currR-1, currC], [currR+1, currC], [currR, currC-1], [currR, currC+1]];
                    for(const [nr, nc] of neighbors){
                        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) {
                            touchesEdge = true;
                        } else if (board[nr][nc] === 0) {
                            if (!visited.has(`${nr},${nc}`)) {
                                visited.add(`${nr},${nc}`);
                                q.push([nr, nc]);
                            }
                        } else if (board[nr][nc] !== player && board[nr][nc] !== 0) {
                            touchesOther = true;
                        }
                    }
                }

                // If the region of empty cells is NOT touching the edge AND NOT touching another player
                // Then it MUST be entirely surrounded by 'player' cells.
                if (!touchesOther && !touchesEdge) {
                    for (const [rr, cc] of region) {
                        newBoard[rr][cc] = player;
                    }
                }
            }
        }
    }
    return newBoard;
}

export function getBestMove(state, player) {
    let bestMove = null;
    let maxScore = -1;

    for (let r = 0; r < state.rows; r++) {
        for (let c = 0; c < state.cols; c++) {
            // Try both orientations
            const orientations = [
                [state.dice[0], state.dice[1]],
                [state.dice[1], state.dice[0]]
            ];

            for (const [dr, dc] of orientations) {
                if (isValidMove(state, r, c, dr, dc, player)) {
                    // Greedy: just take it.
                    // Future: check how many cells it helps surround.
                    const score = dr * dc;
                    if (score > maxScore) {
                        maxScore = score;
                        bestMove = { r, c, dr, dc };
                    }
                }
            }
        }
    }
    return bestMove;
}
