import { Tool } from "./Tool.js";
import { mousePos } from "../../bootstrap.js";

export class EraserTool extends Tool {
    constructor(track, hotkey) {
        super(track, hotkey);
        this.title = "Eraser";
        this.size = 15;
        this.minSize = 5;
        this.maxSize = 40;
    }

    scroll(e) {
        const direction = -Math.sign(e.deltaY);
        if (this.holding) {
            this.size = Math.max(this.minSize, Math.min(this.maxSize, this.size + 5 * direction));
        }
        else {
            this.track.zoom(mousePos, direction);
        }
    }

    update() {
        if (this.isMouseDown) {
            const deleted = this.track.checkDelete(mousePos, this.size);
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
        ctx.arc(mousePx.x, mousePx.y, this.size * this.track.zoomFactor, 0, 2 * Math.PI, true);
        ctx.fillStyle = "#ffb6c1";
        ctx.fill();
    }
}