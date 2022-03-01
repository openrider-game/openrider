import UIElement from "./base/UIElement.js";

export default class UIButton extends UIElement {
    constructor(uiManager, track, x, y, width, height, label, callback, align) {
        super(uiManager, track, x, y, width, height, align);
        this.label = label;
        this.onClick = callback;
        this.color = '#fff';
        this.hoveredColor = '#ddd';
        this.focusedColor = '#ccc';
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
        super.render(ctx);
        ctx.save();
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        let labelMetrics = ctx.measureText(this.label);
        let labelWidth = labelMetrics.width;
        let labelHeight = labelMetrics.actualBoundingBoxAscent + labelMetrics.actualBoundingBoxDescent;
        ctx.fillStyle = this.hovered ? (this.focused ? this.focusedColor : this.hoveredColor) : this.color;
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.fillText(this.label, this.x + (this.width - labelWidth) / 2, this.y + (this.height + labelHeight) / 2);
        ctx.restore();
    }
}