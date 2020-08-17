export class CanvasHelper {

    constructor(ctx) {
        this.ctx = ctx;
        CanvasHelper.instance = this;
    }

    static getInstance() {
        return CanvasHelper.instance;
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

    stroke() {
        this.ctx.stroke();
        return this;
    }

    fill() {
        this.ctx.fill();
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

    strokeText(text, x, y, maxWidth) {
        this.ctx.strokeText(text, x, y, maxWidth);
        return this;
    }

    fillText(text, x, y, maxWidth) {
        this.ctx.fillText(text, x, y, maxWidth);
        return this;
    }

    clearRect(x, y, width, height) {
        this.ctx.clearRect(x, y, width, height);
        return this;
    }

    drawImage(image, sx, sy) {
        this.ctx.drawImage(image, sx, sy);
        return this;
    }

    setProperty(prop, value) {
        this.ctx[prop] = value;
        return this;
    }

    translate(x, y) {
        this.ctx.translate(x, y);
        return this;
    }

    rotate(angle) {
        this.ctx.rotate(angle);
        return this;
    }

    save() {
        this.ctx.save();
        return this;
    }

    restore() {
        this.ctx.restore();
        return this;
    }
}