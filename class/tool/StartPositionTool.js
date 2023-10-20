import GhostRunner from "../bike/GhostRunner.js";
import Control from "../keyboard/Control.js";
import * as KeyCode from "../keyboard/KeyCode.js";
import Vector from "../numeric/Vector.js";
import UIButton from "../ui/UIButton.js";
import Tool from "./Tool.js";

export default class StartPositionTool extends Tool {
    static get toolName() { return 'Start Position'; }
    static get keyLabel() { return 'P'; }
    static get key() { return new Control(KeyCode.DOM_VK_P); }
    static get icon() { return 'start'; }

    constructor(track) {
        super(track);

        this.alwaysRender = true;
    }

    activate() {
        super.activate();
        this.ui.uiManager.cursor = 'pointer';

        this.createDummyRunner();
    }

    onMouseMove(e) {
        super.onMouseMove(e);

        if (this.mouseDown) {
            this.dummyRunner.instance.setBikeInitialState(this.track.mousePos);
        }
    }

    onMouseUp(e) {
        if (!this.mouseDown) return;

        this.mouseDown = false;

        this.setStartPosition(this.track.mousePos);
    }

    setStartPosition(pos) {
        this.track.origin.set(pos);

        let bikeClass = this.track.playerRunner.bikeClass;
        this.track.playerRunner.initialBike = new bikeClass(this.track, this.track.playerRunner);

        this.dummyRunner.instance.setBikeInitialState(pos);
    }

    createDummyRunner() {
        this.dummyRunner = new GhostRunner(this.track, `,,,,,,${this.track.playerRunner.bikeClass.bikeName},Start Position`);
        this.dummyRunner.assignColor = () => {};

        this.dummyRunner.createBike();
    }

    render(ctx) {
        this.dummyRunner.renderInstance(ctx);
    }

    createOptionsUI() {
        let x = (this.track.canvas.width - 300) / 2;
        let resetPos = new UIButton(this.ui, this.track, x, 5, 300, 30, 'Reset start position (0,0)', () => this.setStartPosition(new Vector()));
        resetPos.color = '#fff';
        resetPos.hoveredColor = '#eee';
        resetPos.focusedColor = '#ddd';
        this.ui.optionsUI.items.push(resetPos);
    }
}