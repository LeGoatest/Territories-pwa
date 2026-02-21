/**
 * Territories Game Engine - Spec v1.1
 * Architectural Stabilization Transition
 */

const PLAYER_1 = 'P1';
const PLAYER_2 = 'P2';
const EMPTY = null;

class Engine {
    constructor(width = 40, height = 15, seed = null) {
        this.width = width;
        this.height = height;
        this.seed = seed || Math.floor(Math.random() * 1000000);
        this.rng = this.mulberry32(this.seed);
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

    clone() {
        const c = new Engine(this.width, this.height, this.seed);
        c.board = this.board.map(row => [...row]);
        c.currentPlayer = this.currentPlayer;
        c.dice = this.dice ? {...this.dice} : null;
        c.passStreak = this.passStreak;
        c.gameOver = this.gameOver;
        c.winner = this.winner;
        c.moveNumber = this.moveNumber;
        c.vsAI = this.vsAI;
        c.aiLevel = this.aiLevel;
        c.lastAction = this.lastAction;
        // Note: RNG state isn't perfectly cloned but for heuristic estimation it's fine
        return c;
    }
}

class AI {
    constructor(engine, level = 1) {
        this.engine = engine;
        this.level = level;
        this.weights = {
            A: 1.0, // Area
            B: 1.6, // Capture Potential
            C: 0.7, // Frontier Expansion
            D: 1.2, // Opponent Mobility
            E: 0.2  // Edge Contact
        };
    }

    getMove() {
        if (this.engine.gameOver) return null;
        const player = this.engine.currentPlayer;
        if (!this.engine.dice) this.engine.rollDice();

        const d1 = this.engine.dice.d1;
        const d2 = this.engine.dice.d2;
        const p1 = this.engine.getValidPlacements(player, d1, d2);
        const p2 = d1 !== d2 ? this.engine.getValidPlacements(player, d2, d1) : [];
        const all = [...p1, ...p2];

        if (all.length === 0) return { type: 'pass' };

        if (this.level === 1) {
            return this.getGreedyMove(all);
        } else if (this.level >= 2) {
            return this.getHeuristicMove(player, all);
        }

        // Level 0 or fallback: first valid
        return { type: 'place', rect: all[0] };
    }

    getGreedyMove(placements) {
        let bestScore = -1, bestMove = placements[0];
        for (const rect of placements) {
            let score = rect.w * rect.h;
            if (score > bestScore) {
                bestScore = score;
                bestMove = rect;
            }
        }
        return { type: 'place', rect: bestMove };
    }

    getHeuristicMove(player, placements) {
        let bestScore = -Infinity;
        let bestMove = placements[0];
        let bestCapture = -1;
        let bestArea = -1;

        for (const rect of placements) {
            const evaluation = this.evaluateMove(player, rect);

            // Tie-breaker logic:
            // 1. Higher total score
            // 2. Higher capture potential
            // 3. Higher area
            // 4. Lowest X coordinate
            // 5. Lowest Y coordinate

            let isBetter = evaluation.total > bestScore;
            if (evaluation.total === bestScore) {
                if (evaluation.capture > bestCapture) isBetter = true;
                else if (evaluation.capture === bestCapture) {
                    if (evaluation.area > bestArea) isBetter = true;
                    else if (evaluation.area === bestArea) {
                        if (rect.x < bestMove.x) isBetter = true;
                        else if (rect.x === bestMove.x && rect.y < bestMove.y) isBetter = true;
                    }
                }
            }

            if (isBetter) {
                bestScore = evaluation.total;
                bestMove = rect;
                bestCapture = evaluation.capture;
                bestArea = evaluation.area;
            }
        }

        return { type: 'place', rect: bestMove };
    }

    evaluateMove(player, rect) {
        const areaScore = rect.w * rect.h;

        // Clone engine to simulate move
        const simulation = this.engine.clone();

        // 1. Capture Potential
        const beforeScore = simulation.getScore();
        simulation.applyPlacement(player, rect);
        const afterScore = simulation.getScore();
        const playerKey = player === PLAYER_1 ? 'p1' : 'p2';
        const capturePotential = (afterScore[playerKey] - beforeScore[playerKey]) - areaScore;

        // 2. Frontier Expansion
        let frontierExpansion = 0;
        for (let i = 0; i < rect.h; i++) {
            for (let j = 0; j < rect.w; j++) {
                const cx = rect.x + j;
                const cy = rect.y + i;
                const neighbors = [[cx-1, cy], [cx+1, cy], [cx, cy-1], [cx, cy+1]];
                for (const [nx, ny] of neighbors) {
                    if (nx >= 0 && nx < simulation.width && ny >= 0 && ny < simulation.height) {
                        if (simulation.board[ny][nx] === EMPTY) {
                            frontierExpansion++;
                        }
                    }
                }
            }
        }

        // 3. Opponent Mobility (Simulate one roll for opponent)
        // Since we don't know the roll, we use a middle-ground 3x3 as a proxy or
        // better: sum of valid placements for all possible dice rolls (too slow?)
        // Let's proxy with a 3x3 check.
        const opponent = player === PLAYER_1 ? PLAYER_2 : PLAYER_1;
        const opponentMobility = simulation.getValidPlacements(opponent, 3, 3).length;

        // 4. Edge Contact
        let edgeContact = 0;
        if (rect.x === 0 || rect.x + rect.w === simulation.width) edgeContact += rect.h;
        if (rect.y === 0 || rect.y + rect.h === simulation.height) edgeContact += rect.w;

        const total = (areaScore * this.weights.A) +
                      (capturePotential * this.weights.B) +
                      (frontierExpansion * this.weights.C) -
                      (opponentMobility * this.weights.D) +
                      (edgeContact * this.weights.E);

        return { total, capture: capturePotential, area: areaScore };
    }
}

// Export for Node.js tests if applicable
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PLAYER_1, PLAYER_2, EMPTY, Engine, AI };
}
