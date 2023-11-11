import { SLIPPERY_IMAGE } from "../../../constant/ToolConstants.js";
import Control from "../../../keyboard/Control.js";
import * as KeyCode from "../../../keyboard/KeyCode.js";
import Keyboard from "../../../keyboard/Keyboard.js";
import StatusTool from "./StatusTool.js";
import Slippery from "../../../item/status/Slippery.js";

export default class SlipperyTool extends StatusTool {
    static get toolName() { return 'Slippery'; }
    static get keyLabel() { return 'Shift+H'; }
    static get key() { return new Control(KeyCode.DOM_VK_R, Keyboard.SHIFT); }
    static get icon() { return SLIPPERY_IMAGE; }
    static get itemClass() { return Slippery; }
}