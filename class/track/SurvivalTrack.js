import { Vector } from "../Vector.js";
import { Track } from "./Track.js";
import { CanvasHelper } from "../helper/CanvasHelper.js";

export class SurvivalTrack extends Track {
    constructor(canvas, game) {
        super(canvas, game);
        this.id = 'SURVIVAL';
        this.lines = [];
        this.difficulty = 0.5;
    }

    watchGhost() {
        return this;
    }

    fixedUpdate() {
        if (!this.paused) {
            this.bike && this.bike.fixedUpdate();
            this.currentTime += this.game.ms;
        }
        let p, line = this.lines[this.lines.length - 1];
        //~ while (this.bike.frontWheel.pos.distanceTo(p = line ? line.b : { x: -50, y: 50 }) < 2000) {
        p = line ? line.b : new Vector(-50, 50);
        if (!this.bike.dead && p.distanceTo(this.bike.frontWheel.pos) < 2000) {
            this.addLine(p, p.add(new Vector(Math.floor(Math.random() * 100 / this.difficulty), Math.floor((Math.random() - 0.5) * 20 * this.difficulty))));
            //~ line = this.lines[this.lines.length - 1];
            this.difficulty += 0.001;
        }
        //~ }
        return this;
    }

    update(progress, delta) {
        if (!this.paused) {
            this.bike.update(progress, delta);

            if (this.focalPoint) {
                this.camera.selfAdd(this.focalPoint.displayPos.sub(this.camera).scale(delta / 200));
            }
        }
    }

    render() {
        let drawer = CanvasHelper.getInstance();
        drawer.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawGridBoxes(drawer, this.canvas);

        drawer.setProperty('lineWidth', 10);
        drawer.setProperty('strokeStyle', '#fff');
        drawer.setProperty('fillStyle', '#000');

        if (!this.bike.dead && this.bike.frontWheel.pos.x > this.farthestDistance) {
            this.farthestDistance = this.bike.frontWheel.pos.x;
        }
        let text, d = Math.floor((this.bike.dead ? this.bike.deathPoint : this.bike).frontWheel.pos.x / 10) / 10,
            v = Math.max(0, Math.floor((this.bike.dead ? this.bike.bike : this.bike).frontWheel.velocity.x * 2.5 * 3.6) / 10);
        if (d % 1 === 0) {
            d += '.0';
        }
        if (v % 1 === 0) {
            v += '.0';
        }
        drawer.ctx.strokeText(text =
            'Distance: ' + d + ' meters' +
            '; Speed: ' + v + ' km/h' + (this.bike.dead ? ' - Press ENTER to retry' : ''), 28, 16);
        drawer.fillText(text, 28, 16);
        this.bike && this.bike.render();
        return this;
    }

    doAfterAddLine(line) {
        this.lines.push(line);
    }

    selfAdd(arr) {
        for (let i = 0, l = arr.length; i < l; i++) {
            if (arr[i].isItem) {
                this.addObject(arr[i]);
            } else {
                this.addLine(arr[i].a, arr[i].b, arr[i].isScenery);
            }
        }
    }

    unreachEverything() {
        return this;
    }

    checkDelete() {
        return this;
    }

    remove() {
        return this;
    }

    pushUndo() {
        return this;
    }

    undo() {
        return this;
    }

    redo() {
        return this;
    }

    shortenLastLineSet() {
        return this;
    };

    toString() {
        return 'v1,SURVIVAL#' + this.currentBike;
    }
}