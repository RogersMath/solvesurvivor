// game.js
import Player from './player.js';
import Enemy from './enemy.js';
import Equation from './equation.js';
import UI from './ui.js';
import { GRID_SIZE, TOTAL_GRID_SIZE, INITIAL_HEALTH, ATTACK_RANGE, generateTrees } from './utils.js';

export default class Game {
    constructor() {
        this.player = new Player();
        this.enemies = [];
        this.equations = {};
        this.score = 0;
        this.health = INITIAL_HEALTH;
        this.ui = new UI(this);
        this.trees = generateTrees(TOTAL_GRID_SIZE);
    }
    init() {
        this.ui.createGameBoard();
        this.spawnInitialEnemies(5);
        this.generateNewEquations();
        this.ui.updateGameBoard();
        this.ui.addKeypadListeners();
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
        const shuffled = actions.sort(() => 0.5 - Math.random());
        for (let i = 0; i < 10; i++) {
            this.equations[shuffled[i]] = new Equation(i);
        }
    }

    handleInput(input) {
        const action = this.getActionFromInput(input);
        if (action) {
            this.performAction(action);
            this.moveEnemies();
            this.checkCollisions();
            this.trySpawnEnemy();
            this.generateNewEquations();
            this.ui.updateGameBoard();
        }
    }

    getActionFromInput(input) {
        for (const [action, equation] of Object.entries(this.equations)) {
            if (equation.solve() === input) {
                return action;
            }
        }
        return null;
    }

    performAction(action) {
        switch (action) {
            case 'up': this.player.move(0, -1, this.trees); break;
            case 'down': this.player.move(0, 1, this.trees); break;
            case 'left': this.player.move(-1, 0, this.trees); break;
            case 'right': this.player.move(1, 0, this.trees); break;
            case 'shootUp': this.shoot(0, -1); break;
            case 'shootDown': this.shoot(0, 1); break;
            case 'shootLeft': this.shoot(-1, 0); break;
            case 'shootRight': this.shoot(1, 0); break;
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
        for (let i = 1; i <= ATTACK_RANGE; i++) {
            const targetX = this.player.x + dx * i;
            const targetY = this.player.y + dy * i;
            
            if (targetX < 0 || targetX >= TOTAL_GRID_SIZE || targetY < 0 || targetY >= TOTAL_GRID_SIZE) {
                break;
            }

            if (this.trees[targetY][targetX]) {
                break;
            }

            const hitEnemy = this.enemies.findIndex(enemy => enemy.x === targetX && enemy.y === targetY);
            if (hitEnemy !== -1) {
                this.enemies.splice(hitEnemy, 1);
                this.score++;
                break;
            }
        }
    }

    reset() {
        this.player.reset();
        this.health = INITIAL_HEALTH;
        this.score = 0;
        this.enemies = [];
        this.trees = generateTrees(TOTAL_GRID_SIZE);
        this.spawnInitialEnemies(5);
        this.generateNewEquations();
        this.ui.updateGameBoard();
    }
}
