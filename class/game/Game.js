import { GAME_UPS } from "../constant/GameConstants.js";
import ParserState from "../state/ParserState.js";
import StateManager from "../state/StateManager.js";
import TrackState from "../state/TrackState.js";

export default class Game {
    /**
     *
     * @param {HTMLCanvasElement} canvas
     * @param {{}} opt
     */
    constructor(canvas, opt) {
        /** @type {StateManager} */
        this.stateManager = new StateManager(this, canvas, opt);
        this.stateManager.addState(ParserState, 'parser');
        this.stateManager.addState(TrackState, 'track');

        /** @type {CanvasRenderingContext2D} */
        this.ctx = canvas.getContext('2d');

        /** @type {number} */
        this.lastTime = performance.now();
        /** @type {number} */
        this.timer = performance.now();
        /** @type {number} */
        this.frameDuration = 1000 / GAME_UPS;
        /** @type {number} */
        this.progress = 0;
        /** @type {number} */
        this.frames = 0;
        /** @type {number} */
        this.updates = 0;
    }

    run() {
        requestAnimationFrame(() => this.run());

        let now = performance.now();
        let delta = now - this.lastTime;

        if (delta > 1000) {
            delta = this.frameDuration;
        }

        this.progress += delta / this.frameDuration;
        this.lastTime = now;

        while (this.progress >= 1) {
            this.stateManager.fixedUpdate();
            this.updates++;
            this.progress--;
        }

        this.stateManager.update(this.progress, delta);
        this.stateManager.render(this.ctx);
        this.frames++;

        if (performance.now() - this.timer > 1000) {
            this.timer = performance.now();

            document.title = `OpenRider - ${this.updates} ups, ${this.frames} fps`;

            this.updates = 0;
            this.frames = 0;
        }
    }
}