// player.js
import { PLAYER_START_POSITION, TOTAL_GRID_SIZE } from './utils.js';

export default class Player {
    constructor() {
        this.x = PLAYER_START_POSITION.x;
        this.y = PLAYER_START_POSITION.y;
    }

    move(dx, dy, trees) {
        const newX = this.x + dx;
        const newY = this.y + dy;
        if (this.isValidMove(newX, newY, trees)) {
            this.x = newX;
            this.y = newY;
        }
    }

    isValidMove(x, y, trees) {
        return x >= 0 && x < TOTAL_GRID_SIZE && 
               y >= 0 && y < TOTAL_GRID_SIZE && 
               !trees[y][x];
    }

    reset() {
        this.x = PLAYER_START_POSITION.x;
        this.y = PLAYER_START_POSITION.y;
    }
}
