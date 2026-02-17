
import * as engine from './engine.js';

export function init() {
    const ROWS = 15;
    const COLS = 40;

    let state = {
        rows: ROWS,
        cols: COLS,
        board: Array(ROWS).fill().map(() => Array(COLS).fill(engine.CELL_TYPE.EMPTY)),
        currentPlayer: 1,
        dice: [0, 0],
        diceRolled: false,
        gameOver: false,
        p2AI: true,
        hoverRow: -1,
        hoverCol: -1
    };

    const boardEl = document.getElementById('board');
    const coordDisplay = document.getElementById('coord-display');
    const p1ScoreEl = document.getElementById('p1-score');
    const p2ScoreEl = document.getElementById('p2-score');
    const statusMsgEl = document.getElementById('status-msg');
    const diceValEl = document.getElementById('dice-val');
    const rollBtn = document.getElementById('roll-btn');
    const resetBtn = document.getElementById('reset-btn');
    const aiToggle = document.getElementById('ai-toggle');

    // Optimization: Store cell elements
    let cellElements = [];

    function createBoard() {
        boardEl.innerHTML = '';
        const table = document.createElement('div');
        table.className = 'territories-table mx-auto shadow-lg';

        cellElements = [];
        for (let r = 0; r < ROWS; r++) {
            const row = document.createElement('div');
            row.className = 'territories-row';
            cellElements[r] = [];
            for (let c = 0; c < COLS; c++) {
                const cell = document.createElement('div');
                cell.className = 'territories-cell cursor-pointer';

                const inner = document.createElement('div');
                inner.className = 'cell-inner';
                cell.appendChild(inner);

                cell.addEventListener('mouseenter', () => handleCellEnter(r, c));
                cell.addEventListener('click', () => handleCellClick(r, c));

                row.appendChild(cell);
                cellElements[r][c] = cell;
            }
            table.appendChild(row);
        }
        boardEl.appendChild(table);
        boardEl.addEventListener('mouseleave', handleBoardLeave);
    }

    function updateUI() {
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const val = state.board[r][c];
                const cell = cellElements[r][c];
                const inner = cell.querySelector('.cell-inner');

                // Reset classes
                inner.className = 'cell-inner';
                cell.innerHTML = '';
                cell.appendChild(inner);

                if (val === engine.CELL_TYPE.PLAYER_1) {
                    inner.classList.add('occupied-p1');
                } else if (val === engine.CELL_TYPE.PLAYER_2) {
                    inner.classList.add('occupied-p2');
                }

                // Overlays for hover
                if (!state.gameOver && state.diceRolled && val === engine.CELL_TYPE.EMPTY && state.hoverRow !== -1) {
                    const dr = state.dice[0];
                    const dc = state.dice[1];
                    const canDrop = engine.isValidMove(state, state.hoverRow, state.hoverCol, dr, dc, state.currentPlayer) ||
                                   engine.isValidMove(state, state.hoverRow, state.hoverCol, dc, dr, state.currentPlayer);

                    if (r >= state.hoverRow && r < state.hoverRow + dr && c >= state.hoverCol && c < state.hoverCol + dc) {
                        const overlay = document.createElement('div');
                        overlay.className = `overlay ${canDrop ? 'overlay-green' : 'overlay-red'}`;
                        cell.appendChild(overlay);
                    }
                }
            }
        }

        const s1 = engine.calculateScore(state.board, 1);
        const s2 = engine.calculateScore(state.board, 2);
        p1ScoreEl.textContent = s1;
        p2ScoreEl.textContent = s2;
        diceValEl.textContent = state.diceRolled ? `${state.dice[0]}x${state.dice[1]}` : '--';
        rollBtn.disabled = state.diceRolled || state.gameOver || (state.currentPlayer === 2 && state.p2AI);

        if (state.gameOver) {
            statusMsgEl.textContent = s1 > s2 ? "PLAYER 1 WINS!" : (s2 > s1 ? "PLAYER 2 WINS!" : "DRAW!");
        } else {
            statusMsgEl.textContent = `PLAYER ${state.currentPlayer} TURN`;
            statusMsgEl.style.color = state.currentPlayer === 1 ? '#375E97' : '#FB6542';
        }
    }

    function handleCellEnter(r, c) {
        state.hoverRow = r;
        state.hoverCol = c;
        coordDisplay.textContent = `${r},${c}`;
        if (state.diceRolled) updateUI();
    }

    function handleBoardLeave() {
        state.hoverRow = -1;
        state.hoverCol = -1;
        updateUI();
    }

    function handleCellClick(r, c) {
        if (state.gameOver || !state.diceRolled) return;
        if (state.currentPlayer === 2 && state.p2AI) return;

        let dr = state.dice[0];
        let dc = state.dice[1];
        let moved = false;

        if (engine.isValidMove(state, r, c, dr, dc, state.currentPlayer)) {
            state.board = engine.applyMove(state.board, r, c, dr, dc, state.currentPlayer);
            moved = true;
        } else if (engine.isValidMove(state, r, c, dc, dr, state.currentPlayer)) {
            state.board = engine.applyMove(state.board, r, c, dc, dr, state.currentPlayer);
            moved = true;
        }

        if (moved) {
            state.board = engine.checkClosedLoops(state.board);
            nextTurn();
        }
    }

    function nextTurn() {
        state.diceRolled = false;
        state.dice = [0, 0];

        const s1 = engine.calculateScore(state.board, 1);
        const s2 = engine.calculateScore(state.board, 2);
        const total = ROWS * COLS;

        if (s1 + s2 >= total || s1 > total/2 || s2 > total/2) {
            state.gameOver = true;
        } else {
            state.currentPlayer = state.currentPlayer === 1 ? 2 : 1;
        }

        updateUI();

        if (!state.gameOver && state.currentPlayer === 2 && state.p2AI) {
            handleAIMove();
        }
    }

    function handleAIMove() {
        setTimeout(() => {
            state.dice = [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1];
            state.diceRolled = true;
            updateUI();

            setTimeout(() => {
                const move = engine.getBestMove(state, 2);
                if (move) {
                    state.board = engine.applyMove(state.board, move.r, move.c, move.dr, move.dc, 2);
                    state.board = engine.checkClosedLoops(state.board);
                    nextTurn();
                } else {
                    nextTurn();
                }
            }, 1000);
        }, 800);
    }

    rollBtn.addEventListener('click', () => {
        if (state.gameOver || state.diceRolled) return;
        state.dice = [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1];
        state.diceRolled = true;
        updateUI();
    });

    resetBtn.addEventListener('click', () => {
        state.board = Array(ROWS).fill().map(() => Array(COLS).fill(engine.CELL_TYPE.EMPTY));
        state.currentPlayer = 1;
        state.dice = [0, 0];
        state.diceRolled = false;
        state.gameOver = false;
        updateUI();
    });

    aiToggle.addEventListener('change', (e) => {
        state.p2AI = e.target.checked;
        if (state.p2AI && state.currentPlayer === 2 && !state.diceRolled && !state.gameOver) {
            handleAIMove();
        }
    });

    createBoard();
    updateUI();
}
