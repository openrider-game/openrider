import { SLOWMO_IMAGE } from "../../constant/ToolConstants.js";
import SlowMo from "../../item/SlowMo.js";
import ItemTool from "./ItemTool.js";
import Keyboard from "../../keyboard/Keyboard.js";
import Control from "../../keyboard/Control.js";
import * as KeyCode from "../../keyboard/KeyCode.js";

export default class SlowMoTool extends ItemTool {
    static get toolName() { return 'Slow-Motion'; }
    static get keyLabel() { return 'Shift+S'; }
    static get key() { return new Control(KeyCode.DOM_VK_S, Keyboard.SHIFT); }
    static get icon() { return SLOWMO_IMAGE; }
    static get itemClass() { return SlowMo; }
}