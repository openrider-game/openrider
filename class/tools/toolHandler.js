import { UndoManager } from "../history/UndoManager.js";

export class ToolHandler {
    constructor(track) {
        this.track = track;
        this.tools = {};
        this.shortcuts = {};
        this.activeTool = null;
        this.inFocus = true;
        this.undoManager = new UndoManager();
    }

    addTool(tool, name, shortcut = null) {
        this.tools[name] = tool;
        if (shortcut) this.shortcuts[shortcut] = name;
    }

    removeTool(name) {
        if (this.activeTool === this.tools[name]) this.activeTool.deselect();

        for (let shortcut in this.shortcuts) {
            if (this.shortcuts[shortcut] === name) delete this.shortcuts[shortcut];
        }
        delete this.tools[name];
    }

    selectTool(name) {
        if (this.tools[name] !== this.activeTool) {
            if (this.activeTool) this.activeTool.deselect();
            this.activeTool = this.tools[name] || null;
            if (this.activeTool) this.activeTool.select();
        }
    }

    update(delta) {
        if (this.activeTool && this.inFocus) this.activeTool.update(delta);
    }

    render(ctx) {
        if (this.activeTool && this.inFocus) this.activeTool.render(ctx);
    }

    mouseDown(e) {
        this.inFocus = true;
        if (this.activeTool) this.activeTool.mouseDown(e);
    }

    mouseUp(e) {
        if (this.activeTool) this.activeTool.mouseUp(e);
    }

    mouseMove(e) {
        this.inFocus = true;
        if (this.activeTool) this.activeTool.mouseMove(e);
    }

    scroll(e) {
        this.inFocus = true;
        if (this.activeTool) this.activeTool.scroll(e);
    }

    keyDown(e) {
        const key = e.key.toLowerCase();
        if (['z', 'arrowup', 'arrowleft', 'arrowdown', 'arrowright', 'enter', 'backspace'].includes(key)
            && !this.activeTool.isMouseDown && !this.activeTool.holding) {
            this.inFocus = false;
            return;
        }
        if (this.shortcuts[key]) this.selectTool(this.shortcuts[key]);
        this.activeTool.keyDown(e);
    }

    keyUp(e) {
        this.activeTool.keyUp(e);
    }
}