import { Vector } from '../Vector.js';
import { Tool } from './Tool.js';
import { mousePos } from '../../bootstrap.js';

export class LineTool extends Tool {
    constructor(track, type = 'physics', hotkey) {
        super(track, hotkey);
        this.type = type;
        this.title = (type === 'physics') ? 'Line' : 'Scenery Line';
        this.startPos = new Vector();
        this.endPos = new Vector();
    }

    mouseDown() {
        if (!this.isMouseDown && !this.holding) {
            this.startPos = mousePos.clone();
            this.endPos = mousePos.clone();
        }
        this.isMouseDown = true;
    }

    mouseUp() {
        if (this.isMouseDown) {
            this.isMouseDown = false;
            if (this.checkLineLength()) {
                const line = this.track.addLine(this.startPos, this.endPos, this.type === 'scenery');
                this.startPos.set(this.endPos);
                this.track.pushUndo(function() {
                    line.remove();
                }, function() {
                    line.reAdd();
                });
            }
        }
    }

    update(delta) {
        if (this.isMouseDown || this.holding) {
            this.endPos = mousePos.clone();

            // Move the screen if the mouse is near the edge
            const mousePx = mousePos.toPixel(this.track);
            const zoom = this.track.zoomFactor;
            if (mousePx.x < 50) {
                this.track.camera.x -= delta / 4 / zoom;
                mousePos.x -= delta / 4 / zoom;
            } else if (mousePx.x > this.track.canvas.width - 50) {
                this.track.camera.x += delta / 4 / zoom;
                mousePos.x += delta / 4 / zoom;
            }
            if (mousePx.y < 50) {
                this.track.camera.y -= delta / 4 / zoom;
                mousePos.y -= delta / 4 / zoom;
            } else if (mousePx.y > this.track.canvas.height - 50) {
                this.track.camera.y += delta / 4 / zoom;
                mousePos.y += delta / 4 / zoom;
            }
        }
    }

    render(ctx) {
        const mousePx = mousePos.toPixel(this.track);
        ctx.beginPath();
        ctx.moveTo(mousePx.x - 10, mousePx.y);
        ctx.lineTo(mousePx.x + 10, mousePx.y);
        ctx.moveTo(mousePx.x, mousePx.y - 10);
        ctx.lineTo(mousePx.x, mousePx.y + 10);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#000';
        ctx.lineCap = 'round';
        ctx.stroke();
        if (this.isMouseDown || this.holding) {
            ctx.beginPath();
            ctx.moveTo(...this.startPos.toPixel(this.track).toArray());
            ctx.lineTo(...this.endPos.toPixel(this.track).toArray());
            ctx.strokeStyle = this.checkLineLength() ? "#00f" : "#f00";
            ctx.lineWidth = this.track.zoomFactor * 2;
            ctx.stroke();
        }
    }

    deselect() {
        if (this.isMouseDown) {
            this.mouseUp();
        }
    }

    checkLineLength() {
        const measure = Math.max(Math.abs(this.startPos.x - this.endPos.x), Math.abs(this.startPos.y - this.endPos.y));
        return (measure >= 2 && measure < 50000);
    }
}