import Line from "./Line.js";

export default class SceneryLine extends Line {
    onDelete() {
        this.grid.totalSceneryLines.filter(obj => obj !== this);
    }

    onAdd() {
        this.grid.totalSceneryLines.push(this);
    }
}