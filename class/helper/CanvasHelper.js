export class CanvasHelper {
    constructor(ctx) {
        this.ctx = ctx;
    }

    fillRect(x, y, width, height) {
        this.ctx.fillRect(x, y, width, height);
        return this;
    }

    strokeRect(x, y, width, height) {
        this.ctx.strokeRect(x, y, width, height);
        return this;
    }

    arc(x, y, radius, startAngle, endAngle, anticlockwise) {
        this.ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);
        return this;
    }

    beginPath() {
        this.ctx.beginPath();
        return this;
    }

    stroke(path) {
        this.ctx.stroke(path);
        return this;
    }

    fill(path, fillRule) {
        this.ctx.fill(path, fillRule);
        return this;
    }

    moveTo(x, y) {
        this.ctx.moveTo(x, y);
        return this;
    }

    lineTo(x, y) {
        this.ctx.lineTo(x, y);
        return this;
    }

    fillStyle(fill) {
        this.ctx.fillStyle = fill;
        return this;
    }

    fillText(text, x, y, maxWidth) {
        this.ctx.fillText(text, x, y, maxWidth);
        return this;
    }
}