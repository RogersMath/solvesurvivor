// Game constants
const GRID_SIZE = 9;
const TOTAL_GRID_SIZE = 15;
const PLAYER_START_POSITION = { x: 7, y: 7 };
const INITIAL_HEALTH = 3;
const ATTACK_RANGE = 4;

// Game variables
let player = { ...PLAYER_START_POSITION };
let health = INITIAL_HEALTH;
let score = 0;
let enemies = [];
let equations = {};

// DOM elements
const gameBoard = document.getElementById('game-board');
const scoreElement = document.getElementById('score-value');
const healthElement = document.getElementById('health-value');

function generateEquation(targetResult) {
    const operators = ['+', '-', '*'];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    let a, b;

    do {
        switch (operator) {
            case '+':
                a = Math.floor(Math.random() * targetResult);
                b = targetResult - a;
                break;
            case '-':
                a = Math.floor(Math.random() * 10) + targetResult;
                b = a - targetResult;
                break;
            case '*':
                a = Math.floor(Math.random() * 3) + 1;
                b = targetResult / a;
                break;
        }
    } while (!Number.isInteger(b) || b < 0 || b > 9);

    return `${a} ${operator} ${b}`;
}

function solveEquation(equation) {
    const [a, operator, b] = equation.split(' ');
    switch (operator) {
        case '+': return parseInt(a) + parseInt(b);
        case '-': return parseInt(a) - parseInt(b);
        case '*': return parseInt(a) * parseInt(b);
    }
}

function createEnemy(gridSize, player) {
    let x, y;
    do {
        x = Math.floor(Math.random() * gridSize);
        y = Math.floor(Math.random() * gridSize);
    } while (Math.abs(x - player.x) < 3 && Math.abs(y - player.y) < 3);

    return { x, y };
}

function moveEnemies(enemies, player, gridSize) {
    enemies.forEach(enemy => {
        const dx = Math.sign(player.x - enemy.x);
        const dy = Math.sign(player.y - enemy.y);

        if (Math.random() < 0.5) {
            if (dx !== 0 && isValidMove(enemy.x + dx, enemy.y, gridSize)) {
                enemy.x += dx;
            } else if (dy !== 0 && isValidMove(enemy.x, enemy.y + dy, gridSize)) {
                enemy.y += dy;
            }
        } else {
            if (dy !== 0 && isValidMove(enemy.x, enemy.y + dy, gridSize)) {
                enemy.y += dy;
            } else if (dx !== 0 && isValidMove(enemy.x + dx, enemy.y, gridSize)) {
                enemy.x += dx;
            }
        }
    });
}

function isValidMove(x, y, gridSize) {
    return x >= 0 && x < gridSize && y >= 0 && y < gridSize;
}

function initializeGame() {
    createGameBoard();
    spawnEnemies(5);
    generateNewEquations();
    updateGameBoard();
    addKeypadListeners();
}

function createGameBoard() {
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell', 'floor');
            cell.id = `cell-${x}-${y}`;
            gameBoard.appendChild(cell);
        }
    }
}

function spawnEnemies(count) {
    for (let i = 0; i < count; i++) {
        enemies.push(createEnemy(TOTAL_GRID_SIZE, player));
    }
}

function generateNewEquations() {
    const actions = ['up', 'down', 'left', 'right', 'shootUp', 'shootDown', 'shootLeft', 'shootRight', 'item1', 'item2'];
    const shuffled = actions.sort(() => 0.5 - Math.random());
    for (let i = 0; i < 10; i++) {
        equations[shuffled[i]] = generateEquation(i);
    }
}

function updateGameBoard() {
    // Clear previous state
    document.querySelectorAll('.cell').forEach(cell => {
        cell.className = 'cell floor';
        cell.textContent = '';
    });

    // Place player
    const playerCell = document.getElementById(`cell-${4}-${4}`);
    if (playerCell) {
        playerCell.classList.add('player');
    }

    // Place enemies
    enemies.forEach(enemy => {
        const enemyCell = document.getElementById(`cell-${enemy.x - (player.x - 4)}-${enemy.y - (player.y - 4)}`);
        if (enemyCell) {
            enemyCell.classList.add('enemy');
        }
    });

    // Update equations on cells
    updateEquationCell('up', 3, 4);
    updateEquationCell('down', 5, 4);
    updateEquationCell('left', 4, 3);
    updateEquationCell('right', 4, 5);

    // Update action buttons
    updateActionButton('shootUp', '.shoot-up');
    updateActionButton('shootDown', '.shoot-down');
    updateActionButton('shootLeft', '.shoot-left');
    updateActionButton('shootRight', '.shoot-right');
    updateActionButton('item1', '.item1');
    updateActionButton('item2', '.item2');

    // Update score and health
    scoreElement.textContent = score;
    healthElement.textContent = health;
}

function updateEquationCell(action, x, y) {
    const cell = document.getElementById(`cell-${x}-${y}`);
    if (cell) {
        cell.textContent = equations[action];
        cell.classList.add(action);
    }
}

function updateActionButton(action, selector) {
    const button = document.querySelector(selector);
    if (button) {
        button.textContent = `${action}: ${equations[action]}`;
    }
}


function addKeypadListeners() {
    document.querySelectorAll('.key').forEach(key => {
        key.addEventListener('click', () => handleInput(parseInt(key.dataset.key)));
    });
}

function handleInput(input) {
    const action = getActionFromInput(input);
    if (action) {
        performAction(action);
        moveEnemies(enemies, player, TOTAL_GRID_SIZE);
        checkCollisions();
        generateNewEquations();
        updateGameBoard();
    }
}

function getActionFromInput(input) {
    for (const [action, equation] of Object.entries(equations)) {
        if (solveEquation(equation) === input) {
            return action;
        }
    }
    return null;
}

function performAction(action) {
    switch (action) {
        case 'up': movePlayer(0, -1); break;
        case 'down': movePlayer(0, 1); break;
        case 'left': movePlayer(-1, 0); break;
        case 'right': movePlayer(1, 0); break;
        case 'shootUp': shoot(0, -1); break;
        case 'shootDown': shoot(0, 1); break;
        case 'shootLeft': shoot(-1, 0); break;
        case 'shootRight': shoot(1, 0); break;
        case 'item1': case 'item2': /* Implement item usage */ break;
    }
}

function movePlayer(dx, dy) {
    const newX = player.x + dx;
    const newY = player.y + dy;
    if (newX >= 0 && newX < TOTAL_GRID_SIZE && newY >= 0 && newY < TOTAL_GRID_SIZE) {
        player.x = newX;
        player.y = newY;
    }
}

function shoot(dx, dy) {
    for (let i = 1; i <= ATTACK_RANGE; i++) {
        const targetX = player.x + dx * i;
        const targetY = player.y + dy * i;
        const hitEnemy = enemies.findIndex(enemy => enemy.x === targetX && enemy.y === targetY);
        if (hitEnemy !== -1) {
            enemies.splice(hitEnemy, 1);
            score++;
            break;
        }
    }
}

function checkCollisions() {
    enemies = enemies.filter(enemy => {
        if (enemy.x === player.x && enemy.y === player.y) {
            health--;
            return false;
        }
        return true;
    });

    if (health <= 0) {
        alert('Game Over! Your score: ' + score);
        resetGame();
    }
}

function resetGame() {
    player = { ...PLAYER_START_POSITION };
    health = INITIAL_HEALTH;
    score = 0;
    enemies = [];
    spawnEnemies(5);
    generateNewEquations();
    updateGameBoard();
}

// Initialize the game when the window loads
window.onload = initializeGame;
