import Control from "../keyboard/Control.js";
import ToolGroupTool from "./ToolGroupTool.js";
import * as KeyCode from "../keyboard/KeyCode.js";
import { TARGET_IMAGE } from "../constant/ToolConstants.js";
import { ITEM_GROUP } from "../constant/ToolbarConstants.js";

export default class ItemGroupTool extends ToolGroupTool {
    static get toolName() { return 'Item Group'; }
    static get keyLabel() { return 'I'; }
    static get key() { return new Control(KeyCode.DOM_VK_I); }
    static get icon() { return TARGET_IMAGE; }

    constructor(track) {
        super(track, ITEM_GROUP);
    }
}