// enemy.js
export default class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    move(player, gridSize) {
        // 50% chance to move, 50% chance to stay still
        if (Math.random() < 0.5) {
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
    }

    isValidMove(x, y, gridSize) {
        return x >= 0 && x < gridSize && y >= 0 && y < gridSize;
    }
}
