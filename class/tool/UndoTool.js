import Tool from "./Tool.js";
import * as KeyCode from "../keyboard/KeyCode.js";
import Control from "../keyboard/Control.js";

export default class UndoTool extends Tool {
    static get toolName() { return 'Undo'; }
    static get keyLabel() { return 'M'; }
    static get key() { return new Control(KeyCode.DOM_VK_M); }
    static get icon() { return 'undo'; }

    run() {
        this.track.undoManager.undo();
    }
}