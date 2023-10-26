import Control from "../../keyboard/Control.js";
import ToolGroupTool from "./ToolGroupTool.js";
import * as KeyCode from "../../keyboard/KeyCode.js";
import { TARGET_IMAGE } from "../../constant/ToolConstants.js";
import { STATUS_GROUP } from "../../constant/ToolbarConstants.js";

export default class StatusGroupTool extends ToolGroupTool {
    static get toolName() { return 'Status Effect Group'; }
    static get keyLabel() { return 'J'; }
    static get key() { return new Control(KeyCode.DOM_VK_J); }
    static get icon() { return TARGET_IMAGE; }

    constructor(track) {
        super(track, STATUS_GROUP);
    }
}