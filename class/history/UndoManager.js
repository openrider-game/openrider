export default class UndoManager {
    constructor() {
        this.undoStack = new Array();
        this.undoPosition = 0;
    }

    push(action) {
        let lastActionPos = Math.min(this.undoStack.length, this.undoPosition + 1);
        for (let actionPos in this.undoStack) {
            if (actionPos >= lastActionPos) {
                this.undoStack.splice(actionPos, 1);
            }
        }
        this.undoPosition = this.undoStack.push(action) - 1;
        return this;
    }

    undo() {
        if (this.undoPosition >= 0 && this.undoStack.length) {
            let undoAction = this.undoStack[this.undoPosition--].undo;
            if (typeof undoAction === 'function') {
                undoAction(this);
            }
        }
        return this;
    }

    redo() {
        if (this.undoPosition < this.undoStack.length - 1) {
            let redoAction = this.undoStack[++this.undoPosition].redo;
            if (typeof redoAction === 'function') {
                redoAction(this);
            }
        }
        return this;
    }
}