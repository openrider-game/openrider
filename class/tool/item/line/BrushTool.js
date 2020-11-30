import LineTool from "./LineTool.js";

export default class BrushTool extends LineTool {
    constructor(track) {
        super(track);
        this.size = 20;
        this.minSize = 4;
        this.maxSize = 200;
    }

    onScroll(e) {
        if (this.isHolding()) {
            this.size = Math.min(this.maxSize, Math.max(this.minSize, this.size + 8 * -Math.sign(e.deltaY)));
        } else {
            super.onScroll(e);
        }
    }

    update(progress, delta) {
        if (this.mouseDown || this.isHolding()) {
            let startPos = this.isHolding() ? this.lastLine : this.track.lastClick;

            if (startPos.distanceTo(this.track.mousePos) >= this.size) {
                this.addLine(startPos);
                this.track.lastClick = this.lastLine.clone();
            }
        }

        super.update(progress, delta);
    }

    renderLineSize(ctx, mousePx) {
        ctx.fillText(this.size, mousePx.x + 3, mousePx.y + 12);
    }
}