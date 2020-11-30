import { GAME_UPS, INTERPOLATE } from "../constant/GameConstants.js";
import StateManager from "../state/StateManager.js";

export default class Game {
    /**
     *
     * @param {HTMLCanvasElement} canvas
     * @param {{}} opt
     */
    constructor(canvas, opt) {
        /** @type {StateManager} */
        this.stateManager = new StateManager(this, canvas, opt);
        /** @type {CanvasRenderingContext2D} */
        this.ctx = canvas.getContext('2d');

        /** @type {number} */
        this.lastTime = performance.now();
        /** @type {number} */
        this.timer = performance.now();
        /** @type {number} */
        this.ms = 1000 / GAME_UPS;
        /** @type {boolean} */
        this.interpolate = INTERPOLATE;
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

        this.progress += delta / this.ms;
        this.lastTime = now;

        while (this.progress >= 1) {
            this.stateManager.fixedUpdate();
            this.updates++;
            this.progress--;

            if (!this.interpolate) {
                this.stateManager.update(0, this.ms);

                if (this.progress < 1) {
                    this.stateManager.render(this.ctx);
                    this.frames++;
                }
            }
        }

        if (this.interpolate) {
            this.stateManager.update(this.progress, delta);
            this.stateManager.render(this.ctx);
            this.frames++;
        }

        if (performance.now() - this.timer > 1000) {
            this.timer += 1000;

            document.title = 'OpenRider - ' + this.updates + " ups, " + this.frames + " fps";

            this.updates = 0;
            this.frames = 0;
        }
    }
}