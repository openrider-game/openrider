import { Line } from "./Line.js";
import { floor } from "../../utils/MathUtils.js";

export class SceneryLine extends Line {
    constructor(x1, y1, x2, y2, parent) {
        super(x1, y1, x2, y2, parent);
        this.isScenery = true;
    }

    getEnd() {
        this.stringGot = true;
        let end = ' ' + this.b.toString(),
            next = this.parnt.grid[floor(this.b.x / this.parnt.gridSize)][floor(this.b.y / this.parnt.gridSize)].search(this.b, 'sline');
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