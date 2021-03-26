import Tool from "./Tool.js";
import * as KeyCode from "../keyboard/KeyCode.js";
import Control from "../keyboard/Control.js";
import Keyboard from "../keyboard/Keyboard.js";
import { SWITCH_MAP } from "../constant/BikeConstants.js";
import StartPositionTool from "./StartPositionTool.js";

export default class SwitchBikeTool extends Tool {
    static get toolName() { return 'Switch Bike'; }
    static get keyLabel() { return 'Control+B'; }
    static get key() { return new Control(KeyCode.DOM_VK_B, Keyboard.CTRL); }
    static get icon() { return 'bike'; }

    run() {
        this.track.playerRunner.bikeClass = SWITCH_MAP[this.track.playerRunner.bikeClass.name];
        this.track.playerRunner.createBike();
        this.track.playerRunner.reset();
        this.track.ghostRunners.forEach(runner => {
            runner.reset();
        })

        this.track.restart();

        this.track.tools.get(StartPositionTool.toolName).createDummyRunner();
    }
}