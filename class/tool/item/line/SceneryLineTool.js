import { SCENERY_LINE_IMAGE } from "../../../constant/ToolConstants.js";
import SceneryLine from "../../../item/line/SceneryLine.js";
import Control from "../../../keyboard/Control.js";
import * as KeyCode from "../../../keyboard/KeyCode.js";
import LineTool from "./LineTool.js";

export default class SceneryLineTool extends LineTool {
    static get toolName() { return 'Scenery Line'; }
    static get keyLabel() { return 'W'; }
    static get key() { return new Control(KeyCode.DOM_VK_W); }
    static get icon() { return SCENERY_LINE_IMAGE; }
    static get lineClass() { return SceneryLine; }
}