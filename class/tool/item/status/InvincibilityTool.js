import { INVINCIBILITY_IMAGE } from "../../../constant/ToolConstants.js";
import Control from "../../../keyboard/Control.js";
import * as KeyCode from "../../../keyboard/KeyCode.js";
import Keyboard from "../../../keyboard/Keyboard.js";
import Invincibility from "../../../item/status/Invincibility.js";
import StatusTool from "./StatusTool.js";

export default class InvincibilityTool extends StatusTool {
    static get toolName() { return 'Invincibility'; }
    static get keyLabel() { return 'Shift+I'; }
    static get key() { return new Control(KeyCode.DOM_VK_I, Keyboard.SHIFT); }
    static get icon() { return INVINCIBILITY_IMAGE; }
    static get itemClass() { return Invincibility; }
}