// game.js
import Player from './player.js';
import Enemy from './enemy.js';
import Equation from './equation.js';
import UI from './ui.js';
import { GRID_SIZE, TOTAL_GRID_SIZE, INITIAL_HEALTH, ATTACK_RANGE } from './utils.js';

export default class Game {
    constructor() {
        this.player = new Player();
        this.enemies = [];
        this.equations = {};
        this.score = 0;
        this.health = INITIAL_HEALTH;
        this.ui = new UI(this);
    }

    init() {
        this.ui.createGameBoard();
        this.spawnEnemies(5);
        this.generateNewEquations();
        this.ui.updateGameBoard();
        this.ui.addKeypadListeners();
    }

    spawnEnemies(count) {
        for (let i = 0; i < count; i++) {
            this.enemies.push(new Enemy(TOTAL_GRID_SIZE, this.player));
        }
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
            case 'up': this.player.move(0, -1); break;
            case 'down': this.player.move(0, 1); break;
            case 'left': this.player.move(-1, 0); break;
            case 'right': this.player.move(1, 0); break;
            case 'shootUp': this.shoot(0, -1); break;
            case 'shootDown': this.shoot(0, 1); break;
            case 'shootLeft': this.shoot(-1, 0); break;
            case 'shootRight': this.shoot(1, 0); break;
            case 'item1': case 'item2': /* Implement item usage */ break;
        }
    }

    moveEnemies() {
        this.enemies.forEach(enemy => enemy.move(this.player, TOTAL_GRID_SIZE));
    }

    shoot(dx, dy) {
        for (let i = 1; i <= ATTACK_RANGE; i++) {
            const targetX = this.player.x + dx * i;
            const targetY = this.player.y + dy * i;
            const hitEnemy = this.enemies.findIndex(enemy => enemy.x === targetX && enemy.y === targetY);
            if (hitEnemy !== -1) {
                this.enemies.splice(hitEnemy, 1);
                this.score++;
                break;
            }
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

    reset() {
        this.player.reset();
        this.health = INITIAL_HEALTH;
        this.score = 0;
        this.enemies = [];
        this.spawnEnemies(5);
        this.generateNewEquations();
        this.ui.updateGameBoard();
    }
}
