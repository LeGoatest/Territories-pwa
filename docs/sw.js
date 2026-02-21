// Territories v1.1 - Service Worker "Server"
const CACHE_NAME = 'territories-v1.1.10';
const ASSETS = [
  './',
  './index.html',
  './assets/css/output.css',
  './manifest.webmanifest',
  './assets/images/icon.svg',
  './assets/images/icon-512.svg',
  './assets/images/icon-192.png',
  './assets/images/icon-512.png',
  './assets/js/htmx.min.js',
  './assets/js/sse.js',
  './assets/js/iconify.min.js'
];

// --- ENGINE LOGIC ---
const PLAYER_1 = 'P1';
const PLAYER_2 = 'P2';
const EMPTY = null;

class Engine {
    constructor(width = 40, height = 15, seed = Date.now()) {
        this.width = width;
        this.height = height;
        this.seed = seed;
        this.rng = this.mulberry32(seed);
        this.board = Array(height).fill(null).map(() => Array(width).fill(EMPTY));
        this.board[0][0] = PLAYER_1;
        this.board[height - 1][width - 1] = PLAYER_2;
        this.currentPlayer = PLAYER_1;
        this.dice = null;
        this.passStreak = 0;
        this.gameOver = false;
        this.winner = null;
        this.moveNumber = 1;
        this.vsAI = true;
        this.aiLevel = 1;
        this.lastAction = 'Game Started';
    }

    mulberry32(a) {
        return function() {
          let t = a += 0x6D2B79F5;
          t = Math.imul(t ^ t >>> 15, t | 1);
          t ^= t + Math.imul(t ^ t >>> 7, t | 61);
          return ((t ^ t >>> 14) >>> 0) / 4294967296;
        }
    }

    rollDice() {
        const d1 = Math.floor(this.rng() * 6) + 1;
        const d2 = Math.floor(this.rng() * 6) + 1;
        this.dice = { d1, d2, rotated: false };
        this.lastAction = `Rolled ${d1}×${d2}`;
        return this.dice;
    }

    rotateDice() {
        if (this.dice) {
            this.dice.rotated = !this.dice.rotated;
            this.lastAction = 'Rotated Rectangle';
        }
    }

    get activeDice() {
        if (!this.dice) return null;
        return this.dice.rotated ? { w: this.dice.d2, h: this.dice.d1 } : { w: this.dice.d1, h: this.dice.d2 };
    }

    getValidPlacements(player, w, h) {
        const placements = [];
        for (let y = 0; y <= this.height - h; y++) {
            for (let x = 0; x <= this.width - w; x++) {
                if (this.isValidPlacement(player, x, y, w, h)) {
                    placements.push({ x, y, w, h });
                }
            }
        }
        return placements;
    }

    isValidPlacement(player, x, y, w, h) {
        let hasAdjacency = false;
        for (let i = 0; i < h; i++) {
            for (let j = 0; j < w; j++) {
                const cy = y + i;
                const cx = x + j;
                if (cy < 0 || cy >= this.height || cx < 0 || cx >= this.width) return false;
                if (this.board[cy][cx] !== EMPTY) return false;
                if (!hasAdjacency) {
                    if (this._isPlayerCell(player, cx - 1, cy) ||
                        this._isPlayerCell(player, cx + 1, cy) ||
                        this._isPlayerCell(player, cx, cy - 1) ||
                        this._isPlayerCell(player, cx, cy + 1)) {
                        hasAdjacency = true;
                    }
                }
            }
        }
        return hasAdjacency;
    }

    _isPlayerCell(player, x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) return false;
        return this.board[y][x] === player;
    }

    applyPlacement(player, rect) {
        if (!this.isValidPlacement(player, rect.x, rect.y, rect.w, rect.h)) return false;
        for (let i = 0; i < rect.h; i++) {
            for (let j = 0; j < rect.w; j++) {
                this.board[rect.y + i][rect.x + j] = player;
            }
        }

        this.applyAreaCapture(player);

        this.passStreak = 0;
        this.lastAction = `Placed ${rect.w}×${rect.h} at ${rect.x},${rect.y}`;
        this.nextTurn();
        return true;
    }

    applyAreaCapture(player) {
        const opponent = player === PLAYER_1 ? PLAYER_2 : PLAYER_1;
        const visited = new Set();
        const height = this.height;
        const width = this.width;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if (this.board[y][x] === EMPTY && !visited.has(`${x},${y}`)) {
                    const region = [];
                    const queue = [[x, y]];
                    visited.add(`${x},${y}`);
                    let touchesOpponent = false;
                    let touchesCurrentPlayer = false;

                    let head = 0;
                    while(head < queue.length){
                        const [cx, cy] = queue[head++];
                        region.push([cx, cy]);

                        const neighbors = [[cx-1, cy], [cx+1, cy], [cx, cy-1], [cx, cy+1]];
                        for(const [nx, ny] of neighbors){
                            if(nx >= 0 && nx < width && ny >= 0 && ny < height){
                                const cell = this.board[ny][nx];
                                if(cell === opponent){
                                    touchesOpponent = true;
                                } else if(cell === player){
                                    touchesCurrentPlayer = true;
                                } else if(cell === EMPTY && !visited.has(`${nx},${ny}`)){
                                    visited.add(`${nx},${ny}`);
                                    queue.push([nx, ny]);
                                }
                            }
                        }
                    }

                    if (touchesCurrentPlayer && !touchesOpponent) {
                        for (const [rx, ry] of region) {
                            this.board[ry][rx] = player;
                        }
                    }
                }
            }
        }
    }

    applyPass() {
        this.passStreak++;
        this.lastAction = `Passed turn`;
        this.nextTurn();
    }

    nextTurn() {
        this.dice = null;
        this.moveNumber++;
        this.currentPlayer = this.currentPlayer === PLAYER_1 ? PLAYER_2 : PLAYER_1;
        this.checkGameEnd();
    }

    checkGameEnd() {
        const hasEmpty = this.board.some(row => row.includes(EMPTY));
        if (!hasEmpty || this.passStreak >= 2) {
            this.gameOver = true;
            this.calculateWinner();
        }
    }

    calculateWinner() {
        const s = this.getScore();
        if (s.p1 > s.p2) this.winner = PLAYER_1;
        else if (s.p2 > s.p1) this.winner = PLAYER_2;
        else this.winner = 'DRAW';
    }

    getScore() {
        let p1 = 0, p2 = 0;
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.board[y][x] === PLAYER_1) p1++;
                else if (this.board[y][x] === PLAYER_2) p2++;
            }
        }
        return { p1, p2, total: this.width * this.height };
    }
}

class AI {
    constructor(engine, level = 1) {
        this.engine = engine;
        this.level = level;
    }
    getMove() {
        if (this.engine.gameOver) return null;
        const player = this.engine.currentPlayer;
        if (!this.engine.dice) this.engine.rollDice();
        const d1 = this.engine.dice.d1, d2 = this.engine.dice.d2;
        const p1 = this.engine.getValidPlacements(player, d1, d2);
        const p2 = d1 !== d2 ? this.engine.getValidPlacements(player, d2, d1) : [];
        const all = [...p1, ...p2];
        if (all.length === 0) return { type: 'pass' };
        let bestScore = -1, bestMove = all[0];
        for (const rect of all) {
            let score = rect.w * rect.h;
            if (score > bestScore) { bestScore = score; bestMove = rect; }
        }
        return { type: 'place', rect: bestMove };
    }
}

// --- SERVER STATE ---
let game = new Engine();
let sseControllers = new Set();

// --- RENDERERS ---
function renderBoard(game) {
    const active = game.activeDice;
    let html = `<table class="board-table mx-auto relative" data-dice-w="${active ? active.w : 0}" data-dice-h="${active ? active.h : 0}">`;
    for (let y = 0; y < game.height; y++) {
        html += '<tr>';
        for (let x = 0; x < game.width; x++) {
            const owner = game.board[y][x];
            let cellClass = 'cell';
            let cellStyle = '';
            if (owner === PLAYER_1) cellStyle = 'background-color: #375E97;';
            else if (owner === PLAYER_2) cellStyle = 'background-color: #FB6542;';
            let hxAttr = '';
            if (!game.gameOver && game.currentPlayer === PLAYER_1 && active) {
                if (game.isValidPlacement(PLAYER_1, x, y, active.w, active.h)) {
                    cellClass += ' cell-valid';
                    hxAttr = ` hx-post="/api/game/action/place?x=${x}&y=${y}&w=${active.w}&h=${active.h}" hx-trigger="click" hx-swap="none"`;
                }
            }
            html += `<td id="cell-${x}-${y}" class="${cellClass}" style="${cellStyle}"${hxAttr}></td>`;
        }
        html += '</tr>';
    }
    html += '</table>';
    return html;
}

function renderHUD(game) {
    const score = game.getScore();
    const p1Percent = ((score.p1 / score.total) * 100).toFixed(1);
    const p2Percent = ((score.p2 / score.total) * 100).toFixed(1);
    const active = game.activeDice;
    return `
        <div class="bg-white border-b border-gray-200 shadow-sm px-8 py-4 grid grid-cols-3 items-center shrink-0">
            <div class="flex flex-col items-start gap-1">
                <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-full bg-[#375E97] flex items-center justify-center text-white font-bold">A</div>
                    <span class="font-bold text-[#375E97]">ALICE ${game.currentPlayer === PLAYER_1 ? '◀' : ''}</span>
                </div>
                <div class="w-full max-w-[120px] bg-gray-100 h-2 rounded-full overflow-hidden mt-1">
                    <div class="bg-[#375E97] h-full transition-all duration-500" style="width: ${p1Percent}%"></div>
                </div>
                <span class="text-[10px] font-bold text-gray-500">${p1Percent}% OCCUPIED</span>
            </div>
            <div class="flex flex-col items-center justify-center min-h-[140px]">
                <div class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">${game.gameOver ? 'GAME OVER' : (game.currentPlayer === PLAYER_1 ? 'YOUR TURN' : 'BOB IS THINKING...')}</div>
                <div class="text-[10px] text-gray-300 font-mono mb-3 uppercase tracking-tighter">${game.lastAction}</div>
                ${active && !game.gameOver ? `
                <div class="flex flex-col items-center gap-3">
                    <div class="flex items-center gap-4">
                        <button hx-post="/api/game/action/rotate" hx-swap="none" class="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition-colors flex items-center gap-2 text-[10px] font-bold text-gray-600">
                             <span class="icon-[mdi--rotate-right] text-lg"></span> ROTATE
                        </button>
                        <div class="bg-gray-50 border border-gray-200 p-2 px-4 rounded shadow-inner font-black text-2xl text-gray-700 tracking-tight">
                            ${active.w} × ${active.h}
                        </div>
                        <button hx-post="/api/game/action/pass" hx-swap="none" class="bg-gray-100 hover:bg-red-50 text-gray-400 hover:text-red-600 p-2 rounded-lg transition-colors text-[10px] font-bold uppercase">
                            PASS
                        </button>
                    </div>
                    <div class="text-[9px] font-bold text-[#375E97] animate-pulse uppercase">Click on board to place</div>
                </div>
                ` : `
                ${!game.gameOver && game.currentPlayer === PLAYER_1 ? `
                <button hx-post="/api/game/action/roll" hx-swap="none" class="btn-primary px-10 py-3 rounded-lg shadow-md hover:opacity-90 active:scale-95 transition-all font-bold text-sm uppercase">
                    ROLL ACTION
                </button>
                ` : ''}
                `}
                ${game.gameOver ? `
                    <div class="text-xl font-black text-[#375E97] mt-2 uppercase tracking-tight">
                        ${game.winner === 'DRAW' ? 'DRAW!' : (game.winner === PLAYER_1 ? 'ALICE WINS!' : 'BOB WINS!')}
                    </div>
                    <button hx-post="/api/game/action/new" hx-swap="none" class="mt-2 text-xs font-bold text-gray-500 underline uppercase hover:text-[#375E97] transition-colors">New Game</button>
                ` : ''}
                <div id="offline-indicator" class="hidden mt-2 text-[8px] font-black text-red-500 uppercase tracking-widest animate-bounce">Offline Mode</div>
            </div>
            <div class="flex flex-col items-end gap-1">
                <div class="flex items-center gap-2">
                    <span class="font-bold text-[#FB6542]">${game.vsAI ? 'BOB (BOT)' : 'PLAYER 2'} ${game.currentPlayer === PLAYER_2 ? '▶' : ''}</span>
                    <div class="w-8 h-8 rounded-full bg-[#FB6542] flex items-center justify-center text-white font-bold">B</div>
                </div>
                <div class="w-full max-w-[120px] bg-gray-100 h-2 rounded-full overflow-hidden mt-1">
                    <div class="bg-[#FB6542] h-full transition-all duration-500" style="width: ${p2Percent}%"></div>
                </div>
                <span class="text-[10px] font-bold text-gray-500">${p2Percent}% OCCUPIED</span>
            </div>
        </div>
    `;
}

function renderFull(game) {
    return `
    <div id="game-state-container" class="flex-1 flex flex-col">
        ${renderHUD(game)}
        <div class="p-8 flex flex-col items-center gap-6 overflow-auto">
            <div class="paper inline-block">
                ${renderBoard(game)}
            </div>
        </div>
    </div>
    `;
}

function pushUpdate() {
    const html = renderFull(game).replace(/\n/g, ' ');
    const message = `event: game:update\ndata: ${html}\n\n`;
    const encoder = new TextEncoder();
    const encoded = encoder.encode(message);
    for (const controller of sseControllers) {
        try { controller.enqueue(encoded); } catch (e) { sseControllers.delete(controller); }
    }
}

self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('activate', event => {
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    if (url.pathname === '/api/game/stream') {
        event.respondWith(new Response(new ReadableStream({
            start(controller) { sseControllers.add(controller); pushUpdate(); },
            cancel() { sseControllers.delete(this.controller); }
        }), {
            headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' }
        }));
        return;
    }

    if (url.pathname.startsWith('/api/game/action/')) {
        const p = (async () => {
            const action = url.pathname.split('/').pop();
            const params = url.searchParams;
            if (action === 'new') game = new Engine();
            else if (action === 'roll' && game.currentPlayer === PLAYER_1) game.rollDice();
            else if (action === 'rotate' && game.currentPlayer === PLAYER_1) game.rotateDice();
            else if (action === 'pass' && game.currentPlayer === PLAYER_1) game.applyPass();
            else if (action === 'place' && game.currentPlayer === PLAYER_1) {
                const x = parseInt(params.get('x')), y = parseInt(params.get('y')), w = parseInt(params.get('w')), h = parseInt(params.get('h'));
                game.applyPlacement(PLAYER_1, { x, y, w, h });
            }
            pushUpdate();
            while (!game.gameOver && game.currentPlayer === PLAYER_2 && game.vsAI) {
                const ai = new AI(game, game.aiLevel);
                const move = ai.getMove();
                if (move.type === 'pass') game.applyPass();
                else game.applyPlacement(PLAYER_2, move.rect);
                pushUpdate();
            }
            return new Response('', { status: 204 });
        })();
        event.respondWith(p);
        return;
    }
    event.respondWith(caches.match(event.request).then(r => r || fetch(event.request)));
});
