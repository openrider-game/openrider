import { SurvivalTrack } from "./track/SurvivalTrack.js";
import { RaceTrack } from "./track/RaceTrack.js";
import { BMX } from "./bike/BMX.js";
import { Harley } from "./bike/Harley.js";
import { MTB } from "./bike/MTB.js";
import { canvas, label, hints, toolbar2, toolbar1 } from "../bootstrap.js";
import { GAME_UPS } from "./constant/TrackConstants.js";


export class Game {
    constructor(id, ghosts) {
        this.small();
        if (id === 'SURVIVAL') {
            this.track = new SurvivalTrack();
        } else {
            this.track = new RaceTrack(id);
            this.track.ghostIDs = ghosts || [];
        }
        this.track.bike = new({ BMX: BMX, MTB: MTB, HAR: Harley }[this.track.currentBike] || BMX)(this.track);
        this.track.focalPoint = this.track.bike.head;

        this.lastTime = performance.now();
        this.timer = performance.now();
        this.ms = 1000 / GAME_UPS;
        this.delta = 0;
        this.frames = 0;
        this.updates = 0;
    }

    small() {
        canvas.width = 700;
        canvas.height = 400;
        canvas.style.position = 'static';
        canvas.style.border = '1px solid black';
        toolbar2.style.left = (canvas.offsetLeft + canvas.width - 22) + 'px';
        label[2] = hints[0][7] = 'Enable fullscreen ( F )';
        canvas.style.zIndex = toolbar1.style.zIndex = toolbar2.style.zIndex = 2;
        document.body.style.overflowY = 'scroll';
    }

    run() {
        requestAnimationFrame(() => this.run());
        let now = performance.now();
        let progress = now - this.lastTime;
        this.delta += progress / this.ms;
        this.lastTime = now;
        while (this.delta >= 1) {
            this.track.update();
            this.updates++;
            this.delta--;
        }
        this.track.render();
        this.frames++;
        if (performance.now() - this.timer > 1000) {
            this.timer += 1000;
            document.title = 'OpenRider - ' + this.updates + " ups, " + this.frames + " fps";
            this.updates = 0;
            this.frames = 0;
        }
    }
}