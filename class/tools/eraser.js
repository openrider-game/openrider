import { Tool } from "./Tool.js";
import { mousePos } from "../../bootstrap.js";

export class Eraser extends Tool {
    constructor(track) {
        super(track);
        this.size = 15;
        this.minSize = 5;
        this.maxSize = 40;
        this.track.canvas.addEventListener('mousedown', this.mouseDown.bind(this));
        document.addEventListener('mouseup', this.mouseUp.bind(this));
        document.addEventListener('wheel', this.scroll.bind(this))
    }

    scroll(e) {
        if (e.shiftKey) {
            const direction = -Math.sign(e.deltaY);
            this.size = Math.max(this.minSize, Math.min(this.maxSize, this.size + 5 * direction));
        }
    }

    update() {
        if (this.isMouseDown) {
            const deleted = this.track.checkDelete(mousePos);
            if (deleted.length > 0) {
                this.track.pushUndo(
                    () => {
                        this.track.selfAdd(deleted, true);
                    },
                    () => {
                        for (var i = 0, l = deleted.length; i < l; i++) {
                            deleted[i].remove();
                        }
                    }
                );
            }
        }
    }

    render(ctx) {
        const mousePx = mousePos.toPixel(this.track);
        ctx.beginPath();
        ctx.arc(mousePx.x, mousePx.y, (this.size - 1) * this.track.zoomFactor, 0, 2 * Math.PI, true);
        ctx.fillStyle = "#ffb6c1";
        ctx.fill();
    }
}