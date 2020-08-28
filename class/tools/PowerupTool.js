import { Tool } from "./Tool.js";
import { Vector } from "../Vector.js";
import { mousePos } from "../../bootstrap.js";
import { TOOL } from "../constant/ToolConstants.js";
import { Bomb } from "../item/Bomb.js";
import { Checkpoint } from "../item/Checkpoint.js";
import { Target } from "../item/Target.js";
import { SlowMo } from "../item/SlowMo.js";

const fillColors = {
    [TOOL.GOAL]: '#ff0',
    [TOOL.CHECKPOINT]: '#00f',
    [TOOL.BOMB]: '#f00',
    [TOOL.SLOWMO]: '#eee',
}

const itemClasses = {
    [TOOL.GOAL]: Target,
    [TOOL.CHECKPOINT]: Checkpoint,
    [TOOL.BOMB]: Bomb,
    [TOOL.SLOWMO]: SlowMo,
}

const titles = {
    [TOOL.GOAL]: "Goal",
    [TOOL.CHECKPOINT]: "Checkpoint",
    [TOOL.BOMB]: "Bomb",
    [TOOL.SLOWMO]: "Slow Motion",
}

export class PowerupTool extends Tool {
    constructor(track, type, hotkey) {
        super(track, hotkey);
        this.title = titles[type];
        this.type = type;
        this.pos = new Vector(0, 0);
    }

    mouseDown() {
        this.isMouseDown = true;
        this.pos.set(mousePos);
    }

    mouseUp() {
        if (this.isMouseDown) {
            const item = new itemClasses[this.type](this.pos.x, this.pos.y, this.track);
            item.addToTrack();
            const track = this.track;
            this.isMouseDown = false;

            track.pushUndo(function() {
                item.remove();
            }, function() {
                if (item instanceof Target) ++track.numTargets;
                track.grid[Math.floor(item.pos.x / track.gridSize)][Math.floor(item.pos.y / track.gridSize)].powerups.push(item);
            });
        }
    }

    update() {
        if (!this.isMouseDown) {
            this.pos.set(mousePos);
        }
    }

    render(ctx) {
        ctx.fillStyle = fillColors[this.type];
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2 * this.track.zoomFactor;
        ctx.beginPath();
        ctx.arc(this.pos.toPixel(this.track).x, this.pos.toPixel(this.track).y, 7 * this.track.zoomFactor, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }
}