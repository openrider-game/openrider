import Tool from "./Tool.js";
import * as KeyCode from "../keyboard/KeyCode.js";
import Control from "../keyboard/Control.js";
import UITool from "../ui/UITool.js";

export default class PauseTool extends Tool {
    static get toolName() { return 'Pause'; }
    static get keyLabel() { return 'Space'; }
    static get key() { return new Control(KeyCode.DOM_VK_SPACE); }
    static get icon() { return 'pause'; }

    getUI(uiManager, pos) {
        super.getUI(uiManager, pos);
        this.pauseIcon = this.ui.icon;
        this.unpauseIcon = this.ui.createIcon('play');

        return this.ui;
    }

    run() {
        this.track.paused = !this.track.paused;
        this.updateUI();
    }

    updateUI() {
        let icon = this.track.paused ? this.unpauseIcon : this.pauseIcon;
        this.ui.icon = icon;
    }
}