// game.js
import Player from './player.js';
import Enemy from './enemy.js';
import Equation from './equation.js';
import UI from './ui.js';
import { GRID_SIZE, TOTAL_GRID_SIZE, INITIAL_HEALTH, ATTACK_RANGE, generateTrees } from './utils.js';

const TURN_TIME = 10; // seconds

export default class Game {
    constructor() {
        this.player = new Player();
        this.enemies = [];
        this.equations = {};
        this.score = 0;
        this.health = INITIAL_HEALTH;
        this.trees = generateTrees(TOTAL_GRID_SIZE);
        this.timer = TURN_TIME;
        this.timerInterval = null;
        this.shots = [];
        this.ui = new UI(this);
    }

    init() {
        this.ui.createGameBoard();
        this.spawnInitialEnemies(5);
        this.generateNewEquations();
        this.ui.updateGameBoard();
        this.ui.addKeypadListeners();
        this.startTimer();
    }

    startTimer() {
        this.timer = TURN_TIME;
        this.ui.updateTimer(this.timer);
        clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            this.timer--;
            this.ui.updateTimer(this.timer);
            if (this.timer <= 0) {
                this.handleTimeOut();
            }
        }, 1000);
    }

    handleTimeOut() {
        clearInterval(this.timerInterval);
        this.updateGameState();
        this.ui.updateGameBoard();
        this.startTimer();
    }

    updateGameState() {
        this.moveEnemies();
        this.updateShots();
        this.checkCollisions();
        this.trySpawnEnemy();
        this.generateNewEquations();
    }

    spawnInitialEnemies(count) {
        for (let i = 0; i < count; i++) {
            this.spawnEnemy();
        }
    }

    spawnEnemy() {
        const angle = Math.random() * 2 * Math.PI;
        const distance = 4; // Spawn 4 units away from the player
        const x = Math.round(this.player.x + Math.cos(angle) * distance);
        const y = Math.round(this.player.y + Math.sin(angle) * distance);

        // Ensure the enemy is within the game bounds
        const boundedX = Math.max(0, Math.min(x, TOTAL_GRID_SIZE - 1));
        const boundedY = Math.max(0, Math.min(y, TOTAL_GRID_SIZE - 1));

        this.enemies.push(new Enemy(boundedX, boundedY));
    }

    generateNewEquations() {
        const actions = ['up', 'down', 'left', 'right', 'shootUp', 'shootDown', 'shootLeft', 'shootRight', 'item1', 'item2'];
        for (let action of actions) {
            this.equations[action] = new Equation();
        }
    }

    getActionFromInput(input) {
        const actions = ['up', 'down', 'left', 'right', 'shootUp', 'shootDown', 'shootLeft', 'shootRight', 'item1', 'item2'];
        for (let action of actions) {
            if (this.equations[action].solve() === input) {
                return action;
            }
        }
        return null;
    }

    performAction(action) {
        switch (action) {
            case 'up': 
                this.player.move(0, -1, this.trees);
                break;
            case 'down': 
                this.player.move(0, 1, this.trees);
                break;
            case 'left': 
                this.player.move(-1, 0, this.trees);
                break;
            case 'right': 
                this.player.move(1, 0, this.trees);
                break;
            case 'shootUp': 
                this.shoot(0, -1);
                this.ui.animateAttack(0, -1);
                break;
            case 'shootDown': 
                this.shoot(0, 1);
                this.ui.animateAttack(0, 1);
                break;
            case 'shootLeft': 
                this.shoot(-1, 0);
                this.ui.animateAttack(-1, 0);
                break;
            case 'shootRight': 
                this.shoot(1, 0);
                this.ui.animateAttack(1, 0);
                break;
            case 'item1': case 'item2': /* Implement item usage */ break;
        }
    }

    moveEnemies() {
        this.enemies.forEach(enemy => enemy.move(this.player, TOTAL_GRID_SIZE, this.trees));
    }

    trySpawnEnemy() {
        // 50% chance to spawn a new enemy each turn
        if (Math.random() < 0.5) {
            this.spawnEnemy();
        }
    }

    checkCollisions() {
        this.enemies = this.enemies.filter(enemy => {
            if (enemy.x === this.player.x && enemy.y === this.player.y) {
                this.health--;
                return false;
            }
            return true;
        });

        if (this.health <= 0) {
            alert('Game Over! Your score: ' + this.score);
            this.reset();
        }
    }

    shoot(dx, dy) {
        this.shots.push({
            x: this.player.x,
            y: this.player.y,
            dx: dx,
            dy: dy,
            range: ATTACK_RANGE
        });
    }

    updateShots() {
        this.shots = this.shots.filter(shot => {
            shot.x += shot.dx;
            shot.y += shot.dy;
            shot.range--;

            // Check if the shot is out of bounds
            if (shot.x < 0 || shot.x >= TOTAL_GRID_SIZE || shot.y < 0 || shot.y >= TOTAL_GRID_SIZE) {
                return false;
            }

            // Check if the shot hit a tree
            if (this.trees[shot.y][shot.x]) {
                return false;
            }

            // Check if the shot hit an enemy
            const hitEnemyIndex = this.enemies.findIndex(enemy => enemy.x === shot.x && enemy.y === shot.y);
            if (hitEnemyIndex !== -1) {
                this.enemies.splice(hitEnemyIndex, 1);
                this.score++;
                return false;
            }

            return shot.range > 0;
        });
    }

    reset() {
        this.player.reset();
        this.health = INITIAL_HEALTH;
        this.score = 0;
        this.enemies = [];
        this.shots = [];
        this.trees = generateTrees(TOTAL_GRID_SIZE);
        this.spawnInitialEnemies(5);
        this.generateNewEquations();
        this.ui.updateGameBoard();
    }
}
