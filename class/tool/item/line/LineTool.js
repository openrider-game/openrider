import { MAX_LINE_LENGTH, MIN_LINE_LENGTH } from "../../../constant/TrackConstants.js";
import Line from "../../../item/line/Line.js";
import LinePath from "../../../numeric/LinePath.js";
import Vector from "../../../numeric/Vector.js";
import Tool from "../../Tool.js";

export default class LineTool extends Tool {
    static get lineClass() { return Line; }

    constructor(track) {
        super(track);
        this.foreground = false;
        this.lastLine = new Vector();
    }

    onMouseDown(e) {
        if (this.isHolding()) {
            this.addLine(this.lastLine);
        } else if (e.button !== 2) {
            this.mouseDown = true;
        }
    }

    onMouseUp(e) {
        if (!this.mouseDown) return;

        this.mouseDown = false;

        if (!this.isHolding()) {
            this.addLine(this.track.lastClick);
        }
    }

    addLine(startPos) {
        let lineClass = this.constructor.lineClass;
        let line = new lineClass(startPos.clone(), this.track.mousePos.clone(), this.track);
        let grid = this.track.grid;
        let cache = this.track.cache;

        if (this.foreground) {
            grid = this.track.foregroundGrid;
            cache = this.track.foregroundCache;
        }

        line.grid = grid;
        line.cache = cache;

        line.addToTrack();

        this.track.undoManager.push({
            undo: () => line.removeFromTrack(),
            redo: () => line.addToTrack()
        });

        this.lastLine = this.track.mousePos.clone();
    }

    checkLineLength() {
        let measure = Math.max(
            Math.abs(this.track.lastClick.x - this.track.mousePos.x),
            Math.abs(this.track.lastClick.y - this.track.mousePos.y)
        );

        return (measure >= MIN_LINE_LENGTH && measure < MAX_LINE_LENGTH);
    }

    openOptions() {
        let foregroundLabel = document.createElement('label');
        foregroundLabel.setAttribute('for', 'foregroundCheckbox');
        foregroundLabel.textContent = 'Foreground:';

        let foregroundCheckbox = document.createElement('input');
        foregroundCheckbox.id = 'foregroundCheckbox';
        foregroundCheckbox.type = 'checkbox';
        foregroundCheckbox.checked = this.foreground;

        let buttonOk = document.createElement('button');
        buttonOk.textContent = 'OK';
        buttonOk.addEventListener('click', () => this.hideOptions());

        let foregroundDiv = document.createElement('div');
        let buttonDiv = document.createElement('div');

        foregroundDiv.appendChild(foregroundLabel);
        foregroundDiv.appendChild(foregroundCheckbox);
        buttonDiv.appendChild(buttonOk);

        options.appendChild(foregroundDiv);
        options.appendChild(buttonDiv);
    }

    closeOptions() {
        this.foreground = foregroundCheckbox.checked;
    }

    update(progress, delta) {
        if (this.mouseDown || this.isHolding()) {
            let mousePx = this.track.mousePos.toPixel(this.track);
            let deltaVec = new Vector();
            let deltaFactor = delta / 4 / this.track.zoomFactor;

            if (mousePx.x < 50) {
                deltaVec.x = -deltaFactor;
            } else if (mousePx.x > this.track.canvas.width - 50) {
                deltaVec.x = deltaFactor;
            }

            if (mousePx.y < 50) {
                deltaVec.y = -deltaFactor;
            } else if (mousePx.y > this.track.canvas.height - 50) {
                deltaVec.y = deltaFactor;
            }

            this.track.camera.selfAdd(deltaVec);
            this.track.mousePos.selfAdd(deltaVec);
        }
    }

    render(ctx) {
        let mousePx = this.track.mousePos.toPixel(this.track);

        ctx.lineWidth = 2;
        ctx.strokeStyle = '#000';
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(mousePx.x - 10, mousePx.y);
        ctx.lineTo(mousePx.x + 10, mousePx.y);
        ctx.moveTo(mousePx.x, mousePx.y - 10);
        ctx.lineTo(mousePx.x, mousePx.y + 10);
        ctx.stroke();

        if (this.mouseDown || this.isHolding()) {
            this.renderLineInfo(ctx, mousePx);
        }

        this.renderLineSize(ctx, mousePx);
    }

    renderLineSize(ctx, mousePx) {}

    renderLineInfo(ctx, mousePx) {
        ctx.strokeStyle = this.checkLineLength() ? "#00f" : "#f00";
        ctx.lineWidth = this.track.zoomFactor * 2;

        let startPos = this.isHolding() ? this.lastLine : this.track.lastClick;

        LinePath.render(ctx, [
            [startPos.toPixel(this.track), mousePx]
        ]);

        let length = startPos.distanceTo(this.track.mousePos);
        let distance = this.track.mousePos.sub(startPos);
        let angle = -Math.atan2(distance.y, distance.x) / Math.PI * 180;

        ctx.lineWidth = 0.5;
        ctx.fillStyle = '#777';
        ctx.fillText(Math.round(length), mousePx.x + 3, mousePx.y - 3);

        ctx.textAlign = 'right';
        ctx.fillText(Math.round(angle) + '°', mousePx.x - 3, mousePx.y - 3);
        ctx.textAlign = 'left';
    }
}