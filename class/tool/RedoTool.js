import Tool from "./Tool.js";
import * as KeyCode from "../keyboard/KeyCode.js";
import Control from "../keyboard/Control.js";

export default class RedoTool extends Tool {
    static get toolName() { return 'Redo'; }
    static get keyLabel() { return 'N'; }
    static get key() { return new Control(KeyCode.DOM_VK_N); }
    static get icon() { return 'redo'; }

    run() {
        this.track.undoManager.redo();
    }
}