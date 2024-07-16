// enemy.js
export default class Enemy {
    constructor(gridSize, player) {
        do {
            this.x = Math.floor(Math.random() * gridSize);
            this.y = Math.floor(Math.random() * gridSize);
        } while (Math.abs(this.x - player.x) < 3 && Math.abs(this.y - player.y) < 3);
    }

    move(player, gridSize) {
        const dx = Math.sign(player.x - this.x);
        const dy = Math.sign(player.y - this.y);

        if (Math.random() < 0.5) {
            if (dx !== 0 && this.isValidMove(this.x + dx, this.y, gridSize)) {
                this.x += dx;
            } else if (dy !== 0 && this.isValidMove(this.x, this.y + dy, gridSize)) {
                this.y += dy;
            }
        } else {
            if (dy !== 0 && this.isValidMove(this.x, this.y + dy, gridSize)) {
                this.y += dy;
            } else if (dx !== 0 && this.isValidMove(this.x + dx, this.y, gridSize)) {
                this.x += dx;
            }
        }
    }

    isValidMove(x, y, gridSize) {
        return x >= 0 && x < gridSize && y >= 0 && y < gridSize;
    }
}
