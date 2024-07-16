// equation.js
export default class Equation {
    constructor(targetResult) {
        this.equation = this.generate(targetResult);
    }

    generate(targetResult) {
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

    solve() {
        const [a, operator, b] = this.equation.split(' ');
        switch (operator) {
            case '+': return parseInt(a) + parseInt(b);
            case '-': return parseInt(a) - parseInt(b);
            case '*': return parseInt(a) * parseInt(b);
        }
    }
}
