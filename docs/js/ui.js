
import * as engine from './engine.js';

export function init() {
    console.log("Initializing Territories UI (15x40)...");

    let state = {
        rows: 15,
        cols: 40,
        board: [],
        currentPlayer: 1,
        dice: [0, 0],
        diceRolled: false,
        gameOver: false,
        p2AI: true,
        hoverRow: -1,
        hoverCol: -1
    };

    function resetGame() {
        state.board = Array(state.rows).fill().map(() => Array(state.cols).fill(0));
        state.currentPlayer = 1;
        state.dice = [0, 0];
        state.diceRolled = false;
        state.gameOver = false;
        render();
    }

    function render() {
        const boardEl = document.getElementById('board');
        boardEl.innerHTML = '';
        boardEl.className = 'grid grid-cols-40 gap-0 border-2 border-slate-800 bg-slate-900 shadow-2xl overflow-hidden';

        for (let r = 0; r < state.rows; r++) {
            for (let c = 0; c < state.cols; c++) {
                const cell = document.createElement('div');
                cell.className = 'aspect-square border border-slate-700/30 flex items-center justify-center transition-all duration-100';

                const val = state.board[r][c];
                if (val === 1) cell.classList.add('bg-blue-600', 'shadow-[inset_0_0_8px_rgba(0,0,0,0.4)]');
                if (val === 2) cell.classList.add('bg-red-600', 'shadow-[inset_0_0_8px_rgba(0,0,0,0.4)]');

                // Preview logic
                if (!state.gameOver && state.diceRolled && val === 0 && state.hoverRow !== -1) {
                    const dr = state.dice[0];
                    const dc = state.dice[1];

                    // Check Orientation 1
                    if (r >= state.hoverRow && r < state.hoverRow + dr && c >= state.hoverCol && c < state.hoverCol + dc) {
                         if (engine.isValidMove(state, state.hoverRow, state.hoverCol, dr, dc, state.currentPlayer)) {
                             cell.classList.add(state.currentPlayer === 1 ? 'bg-blue-400/40' : 'bg-red-400/40');
                         }
                    }
                }

                cell.addEventListener('mouseenter', () => {
                    state.hoverRow = r;
                    state.hoverCol = c;
                    document.getElementById('coord-display').textContent = `${r},${c}`;
                    render(); // Re-render for preview. Inefficient but reliable for now.
                });

                cell.addEventListener('click', () => {
                    if (state.gameOver || !state.diceRolled) return;
                    if (state.currentPlayer === 2 && state.p2AI) return;

                    if (engine.isValidMove(state, r, c, state.dice[0], state.dice[1], state.currentPlayer)) {
                        state.board = engine.applyMove(state.board, r, c, state.dice[0], state.dice[1], state.currentPlayer);
                        state.board = engine.checkClosedLoops(state.board, state.currentPlayer);
                        nextTurn();
                    } else if (engine.isValidMove(state, r, c, state.dice[1], state.dice[0], state.currentPlayer)) {
                        state.board = engine.applyMove(state.board, r, c, state.dice[1], state.dice[0], state.currentPlayer);
                        state.board = engine.checkClosedLoops(state.board, state.currentPlayer);
                        nextTurn();
                    }
                });

                boardEl.appendChild(cell);
            }
        }

        document.getElementById('p1-score').textContent = engine.calculateScore(state.board, 1);
        document.getElementById('p2-score').textContent = engine.calculateScore(state.board, 2);
        document.getElementById('current-player').textContent = state.currentPlayer;
        document.getElementById('dice-val').textContent = state.diceRolled ? `${state.dice[0]}x${state.dice[1]}` : '--';
        document.getElementById('roll-btn').disabled = state.diceRolled || state.gameOver || (state.currentPlayer === 2 && state.p2AI);
        document.getElementById('status-msg').textContent = state.gameOver ? "MISSION COMPLETE" : `PLAYER ${state.currentPlayer} ACTIVE`;
    }

    function nextTurn() {
        state.diceRolled = false;
        state.dice = [0, 0];
        state.currentPlayer = state.currentPlayer === 1 ? 2 : 1;

        const scores = [engine.calculateScore(state.board, 1), engine.calculateScore(state.board, 2)];
        if (scores[0] + scores[1] >= state.rows * state.cols) {
            state.gameOver = true;
        }

        render();

        if (!state.gameOver && state.currentPlayer === 2 && state.p2AI) {
            handleAIMove();
        }
    }

    function handleAIMove() {
        setTimeout(() => {
            state.dice = [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1];
            state.diceRolled = true;
            render();

            setTimeout(() => {
                const move = engine.getBestMove(state, 2);
                if (move) {
                    state.board = engine.applyMove(state.board, move.r, move.c, move.dr, move.dc, 2);
                    state.board = engine.checkClosedLoops(state.board, 2);
                    nextTurn();
                } else {
                    nextTurn();
                }
            }, 800);
        }, 800);
    }

    document.getElementById('roll-btn').addEventListener('click', () => {
        if (state.gameOver || state.diceRolled) return;
        state.dice = [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1];
        state.diceRolled = true;
        render();
    });

    document.getElementById('reset-btn').addEventListener('click', resetGame);

    document.getElementById('ai-toggle').addEventListener('change', (e) => {
        state.p2AI = e.target.checked;
        if (state.p2AI && state.currentPlayer === 2 && !state.diceRolled && !state.gameOver) {
            handleAIMove();
        }
    });

    resetGame();
}
