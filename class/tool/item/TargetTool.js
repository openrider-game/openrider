import { TARGET_IMAGE } from "../../constant/ToolConstants.js";
import Target from "../../item/reachable/Target.js";
import ItemTool from "./ItemTool.js";
import * as KeyCode from "../../keyboard/KeyCode.js";
import Control from "../../keyboard/Control.js";
import Keyboard from "../../keyboard/Keyboard.js";

export default class TargetTool extends ItemTool {
    static get toolName() { return 'Target'; }
    static get keyLabel() { return 'Shift+T'; }
    static get key() { return new Control(KeyCode.DOM_VK_T, Keyboard.SHIFT); }
    static get icon() { return TARGET_IMAGE; }
    static get itemClass() { return Target; }
}