import Teleporter from "../../item/reachable/Teleporter.js";
import Control from "../../keyboard/Control.js";
import Keyboard from "../../keyboard/Keyboard.js";
import ItemTool from "./ItemTool.js";
import * as KeyCode from "../../keyboard/KeyCode.js";

export default class TeleporterTool extends ItemTool {
    static get toolName() { return 'Teleporter'; }
    static get keyLabel() { return 'Shift+W'; }
    static get key() { return new Control(KeyCode.DOM_VK_W, Keyboard.SHIFT); }
    static get icon() { return TARGET_IMAGE; }
    static get itemClass() { return Teleporter; }
}