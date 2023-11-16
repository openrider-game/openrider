import { ENGINE_OFF_IMAGE } from "../../../constant/ToolConstants.js";
import Control from "../../../keyboard/Control.js";
import * as KeyCode from "../../../keyboard/KeyCode.js";
import Keyboard from "../../../keyboard/Keyboard.js";
import StatusTool from "./StatusTool.js";
import EngineOff from "../../../item/status/EngineOff.js";

export default class EngineOffTool extends StatusTool {
    static get toolName() { return 'Engine Off'; }
    static get keyLabel() { return 'Shift+E'; }
    static get key() { return new Control(KeyCode.DOM_VK_E, Keyboard.SHIFT); }
    static get icon() { return ENGINE_OFF_IMAGE; }
    static get itemClass() { return EngineOff; }
}