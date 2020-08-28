import { Tool } from "./Tool.js";
import { track } from "../../bootstrap.js";
import { Vector } from "../Vector.js";

export class CameraTool extends Tool {
    constructor(track) {
        super(track);
        this.title = 'Camera';
        this.cachedCursor = track.canvas.style.cursor;
    }

    select() {
        track.canvas.style.cursor = 'move';
    }

    deselect() {
        track.canvas.style.cursor = this.cachedCursor;
    }

    mouseMove(e) {
        if (this.isMouseDown) {
            this.track.camera.selfAdd(new Vector(-e.movementX / this.track.zoomFactor, -e.movementY / this.track.zoomFactor));
        }
    }
}