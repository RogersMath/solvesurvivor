// utils.js
export const GRID_SIZE = 9;
export const TOTAL_GRID_SIZE = 15;
export const PLAYER_START_POSITION = { x: 7, y: 7 };
export const INITIAL_HEALTH = 3;
export const ATTACK_RANGE = 4;
export const TREE_PROBABILITY = 0.05;

export function generateTrees(gridSize) {
    const trees = Array(gridSize).fill().map(() => Array(gridSize).fill(false));
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            if (Math.random() < TREE_PROBABILITY && !hasAdjacentTree(trees, x, y, gridSize)) {
                trees[y][x] = true;
            }
        }
    }
    return trees;
}

function hasAdjacentTree(trees, x, y, gridSize) {
    for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            const newX = x + dx;
            const newY = y + dy;
            if (newX >= 0 && newX < gridSize && newY >= 0 && newY < gridSize && trees[newY][newX]) {
                return true;
            }
        }
    }
    return false;
}
