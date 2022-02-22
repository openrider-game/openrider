import Line from "./Line.js";

export default class SceneryLine extends Line {
    onDelete() {
        this.grid.totalSceneryLines.delete(this.id);
    }

    onAdd() {
        this.grid.totalSceneryLines.set(this.id, this);
    }
}