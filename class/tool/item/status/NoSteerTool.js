import { NOSTEER_IMAGE } from "../../../constant/ToolConstants.js";
import Control from "../../../keyboard/Control.js";
import * as KeyCode from "../../../keyboard/KeyCode.js";
import Keyboard from "../../../keyboard/Keyboard.js";
import StatusTool from "./StatusTool.js";
import NoSteer from "../../../item/status/NoSteer.js";

export default class NoSteerTool extends StatusTool {
    static get toolName() { return 'No Steer'; }
    static get keyLabel() { return 'Shift+N'; }
    static get key() { return new Control(KeyCode.DOM_VK_N, Keyboard.SHIFT); }
    static get icon() { return NOSTEER_IMAGE; }
    static get itemClass() { return NoSteer; }
}