import Control from "../keyboard/Control.js";
import * as KeyCode from "../keyboard/KeyCode.js";
import Tool from "./Tool.js";

export default class GridSnapTool extends Tool {
    static get toolName() { return 'Toggle Grid Snapping'; }
    static get keyLabel() { return 'G'; }
    static get key() { return new Control(KeyCode.DOM_VK_G); }
    static get icon() { return 'grid'; }

    run() {
        this.track.gridDetail = 11 - this.track.gridDetail;
    }
}