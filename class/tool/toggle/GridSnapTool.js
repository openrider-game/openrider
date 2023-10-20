import Control from "../../keyboard/Control.js";
import Keyboard from "../../keyboard/Keyboard.js";
import * as KeyCode from "../../keyboard/KeyCode.js";
import ToggleTool from "./ToggleTool.js";

export default class GridSnapTool extends ToggleTool {
    static get toolName() { return 'Toggle Grid Snapping'; }
    static get keyLabel() { return 'G'; }
    static get key() { return new Control(KeyCode.DOM_VK_G, Keyboard.NONE); }
    static get icon() { return 'grid'; }

    toggle() {
        this.track.gridDetail = 11 - this.track.gridDetail;
    }
}