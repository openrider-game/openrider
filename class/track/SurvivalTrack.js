import { Point } from "../Point.js";
import { canvas } from "../../bootstrap.js";
import { Track } from "./Track.js";
import { CanvasHelper } from "../helper/CanvasHelper.js";

export class SurvivalTrack extends Track {
    constructor() {
        super();
        this.id = 'SURVIVAL';
        this.lines = [];
        this.difficulty = 0.5;
    }

    watchGhost() {
        return this;
    }

    touch(part) {
        let x = Math.floor(part.pos.x / this.gridSize - 0.5),
            y = Math.floor(part.pos.y / this.gridSize - 0.5);
        if (this.grid[x] !== undefined) {
            if (this.grid[x][y] !== undefined) {
                this.grid[x][y].untouch();
            }
            if (this.grid[x][y + 1] !== undefined) {
                this.grid[x][y + 1].untouch();
            }
        }
        if (this.grid[x + 1] !== undefined) {
            if (this.grid[x + 1][y] !== undefined) {
                this.grid[x + 1][y].untouch();
            }
            if (this.grid[x + 1][y + 1] !== undefined) {
                this.grid[x + 1][y + 1].untouch();
            }
        }
        if (this.grid[x] !== undefined && this.grid[x][y] !== undefined) {
            this.grid[x][y].touch(part);
        }
        if (this.grid[x + 1] !== undefined) {
            if (this.grid[x + 1][y] !== undefined) {
                this.grid[x + 1][y].touch(part);
            }
            if (this.grid[x + 1][y + 1] !== undefined) {
                this.grid[x + 1][y + 1].touch(part);
            }
        }
        if (this.grid[x] !== undefined && this.grid[x][y + 1] !== undefined) {
            this.grid[x][y + 1].touch(part);
        }
        return this;
    }

    update() {
        if (!this.paused) {
            this.bike && this.bike.update();
            this.currentTime += 40;
        }
        let p, line = this.lines[this.lines.length - 1];
        //~ while (this.bike.frontWheel.pos.distanceTo(p = line ? line.b : { x: -50, y: 50 }) < 2000) {
        p = line ? line.b : new Point(-50, 50);
        if (!this.bike.dead && p.distanceTo(this.bike.frontWheel.pos) < 2000) {
            this.addLine(p, p.cloneAdd(new Point(Math.floor(Math.random() * 100 / this.difficulty), Math.floor((Math.random() - 0.5) * 20 * this.difficulty))));
            //~ line = this.lines[this.lines.length - 1];
            this.difficulty += 0.001;
        }
        //~ }
        this.render();
        this.bike && this.bike.render();
        return this;
    }

    render() {
        let drawer = CanvasHelper.getInstance();
        if (this.focalPoint) {
            this.camera.selfAdd(this.focalPoint.pos.cloneSub(this.camera).cloneScale(1 / 5));
        }
        drawer.clearRect(0, 0, canvas.width, canvas.height);
        let center = new Point(0, 0).normalizeToCanvas(),
            border = new Point(canvas.width, canvas.height).normalizeToCanvas();
        center.x = Math.floor(center.x / this.gridSize);
        center.y = Math.floor(center.y / this.gridSize);
        border.x = Math.floor(border.x / this.gridSize);
        border.y = Math.floor(border.y / this.gridSize);
        let DI = [];
        for (let x = center.x; x <= border.x; x++) {
            for (let y = center.y; y <= border.y; y++) {
                if (this.grid[x] !== undefined && this.grid[x][y] !== undefined) {
                    if (this.grid[x][y].lines.length > 0) {
                        DI[x + '_' + y] = 1;
                        if (this.cache[x + '_' + y] === undefined) {
                            let el = this.cache[x + '_' + y] = document.createElement('canvas');
                            el.width = this.gridSize * this.zoomFactor;
                            el.height = this.gridSize * this.zoomFactor;
                            let graphic = el.getContext('2d');
                            graphic.lineCap = 'round';
                            graphic.lineWidth = Math.max(2 * this.zoomFactor, 0.5);
                            graphic.strokeStyle = '#000';
                            for (let i = 0, l = this.grid[x][y].lines.length; i < l; i++) {
                                this.grid[x][y].lines[i].render(this.cache[x + '_' + y].getContext('2d'), x * this.gridSize * this.zoomFactor, y * this.gridSize * this.zoomFactor);
                            }
                        }
                        drawer.drawImage(this.cache[x + '_' + y], Math.floor(canvas.width / 2 - this.camera.x * this.zoomFactor + x * this.gridSize * this.zoomFactor), Math.floor(canvas.height / 2 - this.camera.y * this.zoomFactor + y * this.gridSize * this.zoomFactor));
                    }
                    drawer.setProperty('strokeStyle', '#000');
                    //~ for(let i  = 0, l = this.grid[x][y].objects.length; i < l; i++) {
                    //~ this.grid[x][y].objects[i].render();
                    //~ }
                }
            }
        }
        for (let Ay in this.cache) {
            if (DI[Ay] === undefined) {
                delete this.cache[Ay];
            }
        }

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
        this.bike.render();
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