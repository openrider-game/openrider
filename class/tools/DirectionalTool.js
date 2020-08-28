import { Tool } from "./Tool.js";
import { TOOL } from "../constant/ToolConstants.js";
import { Boost } from "../item/Boost.js";
import { Gravity } from "../item/Gravity.js";
import { Vector } from "../Vector.js";
import { mousePos } from "../../bootstrap.js";

const fillColors = {
    [TOOL.BOOST]: '#ff0',
    [TOOL.GRAVITY]: '#0f0'
}

const itemClasses = {
    [TOOL.BOOST]: Boost,
    [TOOL.GRAVITY]: Gravity
}

const titles = {
    [TOOL.BOOST]: "Speed Boost",
    [TOOL.GRAVITY]: "Gravity Changer"
}

export class DirectionalTool extends Tool {
    constructor(track, type, hotkey) {
        super(track, hotkey);
        this.type = type;
        this.title = titles[type];
        this.startPos = new Vector(0, 0);
        this.endPos = new Vector(0, 0);
        this.angle = 0;
    }

    mouseDown() {
        this.isMouseDown = true;
        this.startPos.set(mousePos);
        this.endPos.set(mousePos);
        this.angle = 0;
    }

    mouseUp() {
        if (this.isMouseDown) {
            const item = new itemClasses[this.type](this.startPos.x, this.startPos.y, this.angle, this.track);
            item.addToTrack();
            const track = this.track;
            this.isMouseDown = false;

            track.pushUndo(function() {
                item.remove();
            }, function() {
                track.grid[Math.floor(item.pos.x / track.gridSize)][Math.floor(item.pos.y / track.gridSize)].powerups.push(item);
            });
        }
    }

    update() {
        if (this.isMouseDown) {
            this.endPos.set(mousePos);
            this.angle = Math.atan2(-(this.endPos.x - this.startPos.x), this.endPos.y - this.startPos.y);
            this.angle = Math.round(this.angle * 180 / Math.PI);
            if (this.angle < 0) this.angle += 360;
        }
        else {
            this.startPos.set(mousePos);
            this.angle = (this.type === TOOL.BOOST) ? -90 : 0;
        }
    }

    render(ctx) {
        const rad = this.angle * Math.PI / 180;
        const mousePx = this.endPos.toPixel(this.track);

        ctx.fillStyle = fillColors[this.type];
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2 * this.track.zoomFactor;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.save();
        ctx.translate(...this.startPos.toPixel(this.track).toArray());
        ctx.rotate(rad);
        ctx.moveTo(-7 * this.track.zoomFactor, -10 * this.track.zoomFactor);
        ctx.lineTo(0, 10 * this.track.zoomFactor);
        ctx.lineTo(7 * this.track.zoomFactor, -10 * this.track.zoomFactor);
        ctx.lineTo(-7 * this.track.zoomFactor, -10 * this.track.zoomFactor);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        if (this.isMouseDown) {
            ctx.beginPath();
            ctx.moveTo(mousePx.x - 10, mousePx.y);
            ctx.lineTo(mousePx.x + 10, mousePx.y);
            ctx.moveTo(mousePx.x, mousePx.y - 10);
            ctx.lineTo(mousePx.x, mousePx.y + 10);
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }
}