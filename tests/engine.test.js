// Mocking mulberry32 for test
function mulberry32(a) {
    return function() {
      let t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

// Minimal Engine for testing
class Engine {
    constructor(width = 40, height = 15, seed = 12345) {
        this.width = width;
        this.height = height;
        this.board = Array(height).fill(null).map(() => Array(width).fill(null));
        this.board[0][0] = 'P1';
        this.board[height - 1][width - 1] = 'P2';
        this.currentPlayer = 'P1';
    }

    isValidPlacement(player, x, y, w, h) {
        let hasAdjacency = false;
        for (let i = 0; i < h; i++) {
            for (let j = 0; j < w; j++) {
                const cy = y + i;
                const cx = x + j;
                if (cy < 0 || cy >= this.height || cx < 0 || cx >= this.width) return false;
                if (this.board[cy][cx] !== null) return false;
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
}

// Tests
const e = new Engine();

// Test 1: Valid placement at start (P1 at 0,0)
console.log('Test 1: Valid placement at start (P1 at 0,0)');
const v1 = e.isValidPlacement('P1', 1, 0, 2, 2); // (1,0) is adjacent to (0,0)
console.log('Valid P1 at (1,0) 2x2:', v1);
if (v1 !== true) throw new Error('Test 1 Failed');

// Test 2: Invalid placement (no adjacency)
console.log('Test 2: Invalid placement (no adjacency)');
const v2 = e.isValidPlacement('P1', 10, 10, 2, 2);
console.log('Valid P1 at (10,10) 2x2:', v2);
if (v2 !== false) throw new Error('Test 2 Failed');

// Test 3: Overlap check
console.log('Test 3: Overlap check');
const v3 = e.isValidPlacement('P1', 0, 0, 2, 2); // Overlaps (0,0)
console.log('Valid P1 at (0,0) 2x2 (overlaps):', v3);
if (v3 !== false) throw new Error('Test 3 Failed');

// Test 4: Boundary check
console.log('Test 4: Boundary check');
const v4 = e.isValidPlacement('P1', -1, 0, 2, 2);
console.log('Valid P1 at (-1,0) 2x2:', v4);
if (v4 !== false) throw new Error('Test 4 Failed');

console.log('All Engine Unit Tests Passed!');
