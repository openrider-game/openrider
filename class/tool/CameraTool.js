import Tool from "./Tool.js";
import * as KeyCode from "../keyboard/KeyCode.js";
import Control from "../keyboard/Control.js";

export default class CameraTool extends Tool {
    static get toolName() { return 'Camera'; }
    static get keyLabel() { return 'R'; }
    static get key() { return new Control(KeyCode.DOM_VK_R); }
    static get icon() { return 'arrows'; }

    activate() {
        this.track.canvas.style.cursor = 'move';
    }

    onMouseMove(e) {
        if (this.mouseDown) {
            super.onMouseMove(e);
            this.track.camera.selfAdd(this.track.lastClick.sub(this.track.mousePos));
            this.track.mousePos.set(this.track.lastClick);
        }
    }
}