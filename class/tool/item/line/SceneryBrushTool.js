import { SCENERY_BRUSH_IMAGE } from "../../../constant/ToolConstants.js";
import SceneryLine from "../../../item/line/SceneryLine.js";
import Control from "../../../keyboard/Control.js";
import * as KeyCode from "../../../keyboard/KeyCode.js";
import BrushTool from "./BrushTool.js";

export default class SceneryBrushTool extends BrushTool {
    static get toolName() { return 'Scenery Brush'; }
    static get keyLabel() { return 'S'; }
    static get key() { return new Control(KeyCode.DOM_VK_S); }
    static get icon() { return SCENERY_BRUSH_IMAGE; }
    static get lineClass() { return SceneryLine; }
}