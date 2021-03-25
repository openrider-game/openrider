import GhostRunner from "../bike/GhostRunner.js";
import BikeRenderer from "../bike/instance/renderer/BikeRenderer.js";
import Control from "../keyboard/Control.js";
import * as KeyCode from "../keyboard/KeyCode.js";
import Vector from "../numeric/Vector.js";
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
        this.track.canvas.style.cursor = 'pointer';

        this.createDummyRunner();
    }

    onMouseMove(e) {
        super.onMouseMove(e);

        if (this.mouseDown) {
            this.dummyRunner.instance.setBikeInitialState(this.track.mousePos);
        }
    }

    onMouseUp(e) {
        super.onMouseUp(e);

        this.setStartPosition(this.track.mousePos);
    }

    setStartPosition(pos) {
        this.track.origin.set(pos);

        let bikeClass = this.track.playerRunner.bikeClass;
        this.track.playerRunner.initialBike = new bikeClass(this.track, this.track.playerRunner);

        this.dummyRunner.instance.setBikeInitialState(pos);
    }

    createDummyRunner() {
        this.dummyRunner = new GhostRunner(this.track, `,,,,,,${this.track.playerRunner.bikeClass.name},Start Position`);
        this.dummyRunner.assignColor = () => {};

        this.dummyRunner.createBike();
    }

    openOptions() {
        let buttonReset = document.createElement('button');
        buttonReset.textContent = 'Reset start position (0,0)';
        buttonReset.addEventListener('click', () => this.setStartPosition(new Vector()));

        let buttonOk = document.createElement('button');
        buttonOk.textContent = 'OK';
        buttonOk.addEventListener('click', () => this.hideOptions());

        let buttonDiv = document.createElement('div');

        buttonDiv.appendChild(buttonReset);
        buttonDiv.appendChild(buttonOk);

        options.appendChild(buttonDiv);
    }

    render(ctx) {
        this.dummyRunner.renderInstance(ctx);
    }
}