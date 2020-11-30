import { CHECKPOINT_IMAGE } from "../../constant/ToolConstants.js";
import Checkpoint from "../../item/reachable/Checkpoint.js";
import ItemTool from "./ItemTool.js";
import Keyboard from "../../keyboard/Keyboard.js";
import Control from "../../keyboard/Control.js";
import * as KeyCode from "../../keyboard/KeyCode.js";

export default class CheckpointTool extends ItemTool {
    static get toolName() { return 'Checkpoint'; }
    static get keyLabel() { return 'Shift+C'; }
    static get key() { return new Control(KeyCode.DOM_VK_C, Keyboard.SHIFT); }
    static get icon() { return CHECKPOINT_IMAGE; }
    static get itemClass() { return Checkpoint; }
}