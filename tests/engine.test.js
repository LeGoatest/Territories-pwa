const { PLAYER_1, PLAYER_2, EMPTY, Engine, AI } = require('../docs/assets/js/engine.js');

// Tests
console.log('--- STARTING ENGINE UNIT TESTS ---');
const e = new Engine(40, 15, 12345);

// Test 1: Valid placement at start (P1 at 0,0)
console.log('Test 1: Valid placement at start (P1 at 0,0)');
const v1 = e.isValidPlacement(PLAYER_1, 1, 0, 2, 2); // (1,0) is adjacent to (0,0)
console.log('Valid P1 at (1,0) 2x2:', v1);
if (v1 !== true) throw new Error('Test 1 Failed');

// Test 2: Invalid placement (no adjacency)
console.log('Test 2: Invalid placement (no adjacency)');
const v2 = e.isValidPlacement(PLAYER_1, 10, 10, 2, 2);
console.log('Valid P1 at (10,10) 2x2:', v2);
if (v2 !== false) throw new Error('Test 2 Failed');

// Test 3: Overlap check
console.log('Test 3: Overlap check');
const v3 = e.isValidPlacement(PLAYER_1, 0, 0, 2, 2); // Overlaps (0,0)
console.log('Valid P1 at (0,0) 2x2 (overlaps):', v3);
if (v3 !== false) throw new Error('Test 3 Failed');

// Test 4: Boundary check
console.log('Test 4: Boundary check');
const v4 = e.isValidPlacement(PLAYER_1, -1, 0, 2, 2);
console.log('Valid P1 at (-1,0) 2x2:', v4);
if (v4 !== false) throw new Error('Test 4 Failed');

// Test 5: Area Capture
console.log('Test 5: Area Capture');
const e2 = new Engine(10, 10, 123);
e2.board[0][1] = PLAYER_1;
e2.board[0][2] = PLAYER_1;
e2.board[1][2] = PLAYER_1;
e2.board[2][2] = PLAYER_1;
e2.board[2][1] = PLAYER_1;
e2.board[2][0] = PLAYER_1;
e2.applyAreaCapture(PLAYER_1);
if (e2.board[1][1] !== PLAYER_1) throw new Error('Test 5 Failed: (1,1) not captured');
if (e2.board[1][0] !== PLAYER_1) throw new Error('Test 5 Failed: (1,0) not captured');
console.log('Area Capture Passed');

// Test 6: AI Level 2 Determinism
console.log('Test 6: AI Level 2 Determinism');
const e3 = new Engine(40, 15, 999);
e3.rollDice();
const ai1 = new AI(e3, 2);
const move1 = ai1.getMove();
const ai2 = new AI(e3, 2);
const move2 = ai2.getMove();
console.log('AI Move 1:', JSON.stringify(move1));
console.log('AI Move 2:', JSON.stringify(move2));
if (JSON.stringify(move1) !== JSON.stringify(move2)) throw new Error('Test 6 Failed: AI not deterministic');
console.log('AI Level 2 Determinism Passed');

console.log('All Engine Unit Tests Passed!');
