import { RESET_IMAGE } from "../../../constant/ToolConstants.js";
import Control from "../../../keyboard/Control.js";
import * as KeyCode from "../../../keyboard/KeyCode.js";
import Keyboard from "../../../keyboard/Keyboard.js";
import Reset from "../../../item/status/Reset.js";
import StatusTool from "./StatusTool.js";

export default class ResetTool extends StatusTool {
    static get toolName() { return 'Reset'; }
    static get keyLabel() { return 'Shift+R'; }
    static get key() { return new Control(KeyCode.DOM_VK_R, Keyboard.SHIFT); }
    static get icon() { return RESET_IMAGE; }
    static get itemClass() { return Reset; }
}