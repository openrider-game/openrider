import { SOLID_LINE_IMAGE } from "../../../constant/ToolConstants.js";
import SolidLine from "../../../item/line/SolidLine.js";
import Control from "../../../keyboard/Control.js";
import * as KeyCode from "../../../keyboard/KeyCode.js";
import LineTool from "./LineTool.js";

export default class SolidLineTool extends LineTool {
    static get toolName() { return 'Solid Line'; }
    static get keyLabel() { return 'Q'; }
    static get key() { return new Control(KeyCode.DOM_VK_Q); }
    static get icon() { return SOLID_LINE_IMAGE; }
    static get lineClass() { return SolidLine; }
}