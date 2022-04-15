import { TELEPORTER_IMAGE } from "../../constant/ToolConstants.js";
import Teleporter from "../../item/linked/Teleporter.js";
import Control from "../../keyboard/Control.js";
import Keyboard from "../../keyboard/Keyboard.js";
import * as KeyCode from "../../keyboard/KeyCode.js";
import LinkedItemTool from "../LinkedItemTool.js";

export default class TeleporterTool extends LinkedItemTool {
    static get toolName() { return 'Teleporter'; }
    static get keyLabel() { return 'Shift+W'; }
    static get key() { return new Control(KeyCode.DOM_VK_W, Keyboard.SHIFT); }
    static get icon() { return TELEPORTER_IMAGE; }
    static get itemClass() { return Teleporter; }
}