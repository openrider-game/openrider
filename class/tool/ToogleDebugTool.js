import Control from "../keyboard/Control.js";
import Tool from "./Tool.js";
import * as KeyCode from "../keyboard/KeyCode.js";
import Keyboard from "../keyboard/Keyboard.js";

export default class TogglDebugTool extends Tool {
    static get toolName() { return 'Toggle Debug'; }
    static get keyLabel() { return 'Control+D'; }
    static get key() { return new Control(KeyCode.DOM_VK_D, Keyboard.CTRL); }
    static get icon() { return 'debug'; }

    run() {
        this.track.debug = !this.track.debug;
    }
}