import UIButton from "./UIButton.js";
import UICollection from "./base/UICollection.js";

export default class UITool extends UIButton {
    constructor(uiManager, track, y, toolClass, callback, align) {
        super(uiManager, track, 0, y, 26, 26, '', callback, align);

        this.toolClass = toolClass;

        this.toolLabel = toolClass.toolName;

        this.activeColor = '#456';

        this.icon = this.createIcon(this.toolClass.icon);
        this.optionsUI = new UICollection(this.uiManager, this.track);
    }

    createIcon(icon) {
        let src = `./media/icon/${icon}.svg`;
        if (icon.type === 'b64') {
            src = icon.data;
        }

        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');

        canvas.width = 24;
        canvas.height = 24;

        let img = new Image();
        img.onload = function() {
            let padding = 1;
            if (icon.type === 'b64') {
                padding = 6;
            }
            context.drawImage(img, padding, padding);
        }
        img.src = src;

        return canvas;
    }

    /**
     *
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
        super.render(ctx);
        ctx.save();
        ctx.drawImage(this.icon, this.x, this.y);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);

        if (this.hovered) {
            let label = `${this.toolLabel} (${this.toolClass.keyLabel})`;
            let labelMetrics = ctx.measureText(label);
            let labelWidth = labelMetrics.width;
            let labelHeight = labelMetrics.actualBoundingBoxAscent + labelMetrics.actualBoundingBoxDescent;

            let rectX = this.x + this.width + 4;
            if (this.x > this.track.canvas.width / 2) {
                rectX = this.x - 8 - labelWidth;
            }
            let textX = rectX + 2;

            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.rect(rectX, this.y + 1, labelWidth + 4, 24);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#000';
            ctx.fillText(label, textX, this.y + labelHeight + 5);
        }

        ctx.restore();
    }

    toggleActive() {
        [this.activeColor, this.color] = [this.color, this.activeColor];
    }

}