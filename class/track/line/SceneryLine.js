import { Line } from "./Line.js";

export class SceneryLine extends Line {
    constructor(x1, y1, x2, y2, parent) {
        super(x1, y1, x2, y2, parent);
        this.isScenery = true;
    }

    getEnd() {
        this.stringGot = true;
        let end = ' ' + this.b.toString(),
            next = this.track.grid[Math.floor(this.b.x / this.track.gridSize)][Math.floor(this.b.y / this.track.gridSize)].search(this.b, 'sline');
        if (next !== undefined) {
            end += next.getEnd();
        }
        return end;
    }

    toString() {
        return this.a + this.getEnd();
    }

    toJSON() {
        return super.toJSON('SceneryLine');
    }
}