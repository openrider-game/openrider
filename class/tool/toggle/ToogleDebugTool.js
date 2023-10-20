import Control from "../../keyboard/Control.js";
import * as KeyCode from "../../keyboard/KeyCode.js";
import Keyboard from "../../keyboard/Keyboard.js";
import ToggleTool from "./ToggleTool.js";

export default class ToggleDebugTool extends ToggleTool {
    static get toolName() { return 'Toggle Debug'; }
    static get keyLabel() { return 'Control+D'; }
    static get key() { return new Control(KeyCode.DOM_VK_D, Keyboard.CTRL); }
    static get icon() { return 'debug'; }

    toggle() {
        this.track.debug = !this.track.debug;
    }
}