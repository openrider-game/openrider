import { UndoManager } from "../history/UndoManager.js";

export class ToolHandler {
    constructor(track) {
        this.track = track;
        this.tools = [];
        this.activeTool = null;
        this.undoManager = new UndoManager();
    }

    update(delta) {
        if (this.activeTool) this.activeTool.update(delta);
    }

    render(ctx) {
        if (this.activeTool) this.activeTool.render(ctx);
    }

    mouseDown(e) {
        if (this.activeTool) this.activeTool.mouseDown(e);
    }

    mouseUp(e) {
        if (this.activeTool) this.activeTool.mouseUp(e);
    }

    scroll(e) {
        if (this.activeTool) this.activeTool.scroll(e);
    }
}