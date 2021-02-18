import Tool from "./Tool.js";
import * as KeyCode from "../keyboard/KeyCode.js";
import Control from "../keyboard/Control.js";

export default class CancelCheckpointTool extends Tool {
    static get toolName() { return 'Cancel Checkpoint'; }
    static get keyLabel() { return 'Backspace'; }
    static get key() { return new Control(KeyCode.DOM_VK_BACK_SPACE); }
    static get icon() { return 'rewind'; }

    run() {
        this.track.playerRunner.popCheckpoint();
        this.track.ghostRunners.forEach(runner => {
            runner.popCheckpoint();
        });
        this.track.restart();
    }
}