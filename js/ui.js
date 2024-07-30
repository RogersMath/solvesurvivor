// ui.js
import { GRID_SIZE, ATTACK_RANGE } from './utils.js';

export default class UI {
    constructor(game) {
        this.game = game;
        this.gameBoard = document.getElementById('game-board');
        this.scoreElement = document.getElementById('score-value');
        this.healthElement = document.getElementById('health-value');
        this.timerElement = document.getElementById('timer-value');
    }

    createGameBoard() {
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                const cell = document.createElement('div');
                cell.classList.add('cell', 'floor');
                cell.id = `cell-${x}-${y}`;
                this.gameBoard.appendChild(cell);
            }
        }
    }

    updateTimer(time) {
        this.timerElement.textContent = time;
    }

    updateGameBoard() {
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
        this.game.enemies.forEach(enemy => {
            const enemyCell = document.getElementById(`cell-${enemy.x - (this.game.player.x - 4)}-${enemy.y - (this.game.player.y - 4)}`);
            if (enemyCell) {
                enemyCell.classList.add('enemy');
            }
        });

        // Place shots
        this.game.shots.forEach(shot => {
            const shotCell = document.getElementById(`cell-${shot.x - (this.game.player.x - 4)}-${shot.y - (this.game.player.y - 4)}`);
            if (shotCell) {
                shotCell.classList.add('shot');
            }
        });

        // Place trees
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                const worldX = this.game.player.x - 4 + x;
                const worldY = this.game.player.y - 4 + y;
                if (worldX >= 0 && worldX < this.game.trees.length && worldY >= 0 && worldY < this.game.trees.length) {
                    if (this.game.trees[worldY][worldX]) {
                        const cell = document.getElementById(`cell-${x}-${y}`);
                        if (cell) {
                            cell.classList.add('tree');
                        }
                    }
                }
            }
        }

        // Update equations on cells
        this.updateEquationCell('up', 3, 4);
        this.updateEquationCell('down', 5, 4);
        this.updateEquationCell('left', 4, 3);
        this.updateEquationCell('right', 4, 5);

        // Update action buttons
        this.updateActionButton('shootUp', '.shoot-up');
        this.updateActionButton('shootDown', '.shoot-down');
        this.updateActionButton('shootLeft', '.shoot-left');
        this.updateActionButton('shootRight', '.shoot-right');
        this.updateActionButton('item1', '.item1');
        this.updateActionButton('item2', '.item2');

        // Update score and health
        this.scoreElement.textContent = this.game.score;
        this.healthElement.textContent = this.game.health;
        this.updateTimer(this.game.timer);
    }

    updateEquationCell(action, x, y) {
        const cell = document.getElementById(`cell-${x}-${y}`);
        if (cell) {
            cell.textContent = this.game.equations[action].equation;
            cell.classList.add(action);
        }
    }

    updateActionButton(action, selector) {
        const button = document.querySelector(selector);
        if (button) {
            button.textContent = `${action}: ${this.game.equations[action].equation}`;
        }
    }

    addKeypadListeners() {
        document.querySelectorAll('.key').forEach(key => {
            key.addEventListener('click', () => this.handleInput(parseInt(key.dataset.key)));
        });

        // Add keyboard listener
        document.addEventListener('keydown', (event) => {
            const key = event.key;
            if (key >= '0' && key <= '9') {
                this.handleInput(parseInt(key));
            }
        });
    }

    handleInput(input) {
        const action = this.game.getActionFromInput(input);
        if (action) {
            this.game.performAction(action);
            // Note: updateGameState and updateGameBoard are now called in performAction
            this.game.startTimer();
        }
    }

    animateAttack(dx, dy) {
        const projectile = document.createElement('div');
        projectile.className = 'projectile';
        this.gameBoard.appendChild(projectile);

        const cellSize = document.querySelector('.cell').offsetWidth;
        const startX = 4 * cellSize + cellSize / 2;
        const startY = 4 * cellSize + cellSize / 2;
        const endX = startX + dx * cellSize * ATTACK_RANGE;
        const endY = startY + dy * cellSize * ATTACK_RANGE;

        gsap.fromTo(projectile, 
            { x: startX, y: startY, scale: 0 },
            { x: endX, y: endY, scale: 1, duration: 0.5, ease: "power1.out",
              onComplete: () => {
                  projectile.remove();
              }
            }
        );
    }
}
