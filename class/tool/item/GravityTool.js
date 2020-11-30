import DirectionalItemTool from "./DirectionalItemTool.js";
import { GRAVITY_IMAGE } from "../../constant/ToolConstants.js";
import Gravity from "../../item/directional/Gravity.js";
import Keyboard from "../../keyboard/Keyboard.js";
import Control from "../../keyboard/Control.js";
import * as KeyCode from "../../keyboard/KeyCode.js";

export default class GravityTool extends DirectionalItemTool {
    static get toolName() { return 'Gravity'; }
    static get keyLabel() { return 'Shift+G'; }
    static get key() { return new Control(KeyCode.DOM_VK_G, Keyboard.SHIFT); }
    static get icon() { return GRAVITY_IMAGE; }
    static get itemClass() { return Gravity; }
}