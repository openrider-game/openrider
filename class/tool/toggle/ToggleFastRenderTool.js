import Control from "../../keyboard/Control.js";
import * as KeyCode from "../../keyboard/KeyCode.js";
import Keyboard from "../../keyboard/Keyboard.js";
import ToggleTool from "./ToggleTool.js";

export default class ToggleFastRenderTool extends ToggleTool {
    static get toolName() { return 'Toggle Fast Renderer (may cause flickering)'; }
    static get keyLabel() { return 'Control+Q'; }
    static get key() { return new Control(KeyCode.DOM_VK_Q, Keyboard.CTRL); }
    static get icon() { return 'speed'; }

    toggle() {
        this.track.fastRender = !this.track.fastRender;
    }
}