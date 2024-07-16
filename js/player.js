// player.js
import { PLAYER_START_POSITION, TOTAL_GRID_SIZE } from './utils.js';

export default class Player {
    constructor() {
        this.x = PLAYER_START_POSITION.x;
        this.y = PLAYER_START_POSITION.y;
    }

    move(dx, dy) {
        const newX = this.x + dx;
        const newY = this.y + dy;
        if (newX >= 0 && newX < TOTAL_GRID_SIZE && newY >= 0 && newY < TOTAL_GRID_SIZE) {
            this.x = newX;
            this.y = newY;
        }
    }

    reset() {
        this.x = PLAYER_START_POSITION.x;
        this.y = PLAYER_START_POSITION.y;
    }
}
