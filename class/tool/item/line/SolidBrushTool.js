import { SOLID_BRUSH_IMAGE } from "../../../constant/ToolConstants.js";
import SolidLine from "../../../item/line/SolidLine.js";
import Control from "../../../keyboard/Control.js";
import * as KeyCode from "../../../keyboard/KeyCode.js";
import BrushTool from "./BrushTool.js";

export default class SolidBrushTool extends BrushTool {
    static get toolName() { return 'Solid Brush'; }
    static get keyLabel() { return 'A'; }
    static get key() { return new Control(KeyCode.DOM_VK_A); }
    static get icon() { return SOLID_BRUSH_IMAGE; }
    static get lineClass() { return SolidLine; }
}