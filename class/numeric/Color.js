export default class Color {
    static getHexTable() {
        return '0123456789ABCDEF'.split('');
    }

    static getDigit(limit) {
        return Color.getHexTable()[Math.round(Math.random() * limit)];
    }

    static generateRandomDark() {
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += Color.getDigit(10);
        }

        return color;
    }
}