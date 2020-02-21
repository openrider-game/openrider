export class UndoManager {
    constructor() {
        this.undoStack = [];
        this.undoPosition = 0;
    }

    push(fn) {
        this.undoStack.length = Math.min(this.undoStack.length, this.undoPosition + 1);
        this.undoPosition = this.undoStack.push(fn) - 1;
        return this;
    }

    undo() {
        if (this.undoPosition >= 0) {
            let fn = this.undoStack[this.undoPosition--].undo;
            if (typeof fn === 'function') {
                fn(this);
            }
        }
        return this;
    }

    redo() {
        if (this.undoPosition < this.undoStack.length - 1) {
            let fn = this.undoStack[++this.undoPosition].redo;
            if (typeof fn === 'function') {
                fn(this);
            }
        }
        return this;
    }
}