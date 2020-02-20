import { BMX } from "../bike/BMX.js";
import { Harley } from "../bike/Harley.js";
import { MTB } from "../bike/MTB.js";
import { Point } from "../Point.js";
import { GridBox } from "./GridBox.js";
import { SceneryLine } from "./line/SceneryLine.js";
import { SolidLine } from "./line/SolidLine.js";
import { beginPath } from "../utils/DrawUtils.js";
import { floor, rand } from "../utils/MathUtils.js";
import { context, canvas, doc, mix, gridSpread } from "../../unobfuscated_bhr.js";
import { TOOL_CAMERA } from "../constant/ToolConstants.js";

export class SurvivalTrack {
    constructor() {
        this.grid = {};
        this.gridSize = 100;
        this.cache = {};
        this.zoomFactor = 0.6;
        this.currentTime = 0;
        this.id = 'SURVIVAL';
        this.currentBike = 'BMX';
        this.paused = false;
        //~ this.currentBike = 'HAR';
        context.fillText('Building track... Please wait.', 36, 16);
        this.camera = new Point(0, 0);
        this.lines = [];
        this.objects = [];
        this.difficulty = 0.5;
        this.currentTool = TOOL_CAMERA;
    }

    restart() {
        this.unreachEverything();
        this.paused = false;
        var bike = this.bike = this.currentBike === 'BMX' ? new BMX(this) : this.currentBike === 'HAR' ? new Harley(this) : new MTB(this);
        this.focalPoint = bike.head;
        /** HACK */
        this.currentTime = bike.$consts[bike.$consts.length - 1][29];
        /** /HACK */
        this.camera = bike.head.pos.clone();
    }

    reset() {
        this.checkpoints = [];
        this.restart();
    }

    _watchGhost() {
        return this;
    }

    touch(part) {
        var x = floor(part.pos.x / this.gridSize - 0.5),
            y = floor(part.pos.y / this.gridSize - 0.5);
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

    proceed() {
        if (!this.paused) {
            this.ghost && this.ghost.proceed();
            this.bike && this.bike.proceed();
            this.currentTime += 40;
        }
        var p, line = this.lines[this.lines.length - 1];
        //~ while (this.bike.frontWheel.pos.distanceTo(p = line ? line.b : { x: -50, y: 50 }) < 2000) {
        p = line ? line.b : new Point(-50, 50);
        if (!this.bike.dead && p.distanceTo(this.bike.frontWheel.pos) < 2000) {
            this.addLine(p, p.cloneAdd(new Point(floor(rand() * 100 / this.difficulty), floor((rand() - 0.5) * 20 * this.difficulty))));
            //~ line = this.lines[this.lines.length - 1];
            this.difficulty += 0.001;
        }
        //~ }
        this.draw();
        this.ghost && this.ghost.draw();
        this.bike && this.bike.draw();
        return this;
    }

    draw() {
        var bike = this.bike,
            time = this.currentTime;
        if (this.focalPoint) {
            this.camera.selfAdd(this.focalPoint.pos.cloneSub(this.camera).cloneScale(1 / 5));
        }
        context.clearRect(0, 0, canvas.width, canvas.height);
        var center = new Point(0, 0).normalizeToCanvas(),
            border = new Point(canvas.width, canvas.height).normalizeToCanvas();
        center.x = floor(center.x / this.gridSize);
        center.y = floor(center.y / this.gridSize);
        border.x = floor(border.x / this.gridSize);
        border.y = floor(border.y / this.gridSize);
        var DI = [],
            i, l, x, y;
        for (x = center.x; x <= border.x; x++) {
            for (y = center.y; y <= border.y; y++) {
                if (this.grid[x] !== undefined && this.grid[x][y] !== undefined) {
                    if (this.grid[x][y].lines.length > 0) {
                        DI[x + '_' + y] = 1;
                        if (this.cache[x + '_' + y] === undefined) {
                            var el = this.cache[x + '_' + y] = doc.createElement('canvas');
                            el.width = this.gridSize * this.zoomFactor;
                            el.height = this.gridSize * this.zoomFactor;
                            var graphic = el.getContext('2d');
                            graphic.lineCap = 'round';
                            graphic.lineWidth = Math.max(2 * this.zoomFactor, 0.5);
                            graphic.strokeStyle = '#000';
                            for (i = 0, l = this.grid[x][y].lines.length; i < l; i++) {
                                this.grid[x][y].lines[i].draw(this.cache[x + '_' + y].getContext('2d'), x * this.gridSize * this.zoomFactor, y * this.gridSize * this.zoomFactor);
                            }
                        }
                        context.drawImage(this.cache[x + '_' + y], floor(canvas.width / 2 - this.camera.x * this.zoomFactor + x * this.gridSize * this.zoomFactor), floor(canvas.height / 2 - this.camera.y * this.zoomFactor + y * this.gridSize * this.zoomFactor));
                    }
                    context.strokeStyle = '#000';
                    //~ for (i = 0, l = this.grid[x][y].objects.length; i < l; i++) {
                    //~ this.grid[x][y].objects[i].draw();
                    //~ }
                }
            }
        }
        for (var Ay in this.cache) {
            if (DI[Ay] === undefined) {
                delete this.cache[Ay];
            }
        }
        mix(context[beginPath](), {
            lineWidth: 10,
            strokeStyle: '#fff',
            fillStyle: '#000'
        });
        if (!this.bike.dead && this.bike.frontWheel.pos.x > this.farthestDistance) {
            this.farthestDistance = this.bike.frontWheel.pos.x;
        }
        var text, d = floor((this.bike.dead ? this.bike.deathPoint : this.bike).frontWheel.pos.x / 10) / 10,
            v = Math.max(0, floor((this.bike.dead ? this.bike.bike : this.bike).frontWheel.velocity.x * 2.5 * 3.6) / 10);
        if (d % 1 === 0) {
            d += '.0';
        }
        if (v % 1 === 0) {
            v += '.0';
        }
        context.strokeText(text =
            'Distance: ' + d + ' meters' +
            '; Speed: ' + v + ' km/h' + (bike.dead ? ' - Press ENTER to retry' : ''), 28, 16);
        context.fillText(text, 28, 16);
        if (this.ghost) {
            context.fillStyle = '#aaa';
            context.textAlign = 'right';
            context.strokeText(text = (this.ghost.name || 'Ghost') + floor(this.ghost.frontWheel.pos.x / 10) / 10, canvas.width - 7, 16);
            context.fillText(text, canvas.width - 7, 16);
            context.textAlign = 'left';
            context.fillStyle = '#000';
        }
        this.bike.draw();
        return this;
    }

    addLine(a, b, scenery) {
        var L = scenery ? SceneryLine : SolidLine,
            line = new L(a.x, a.y, b.x, b.y, this);
        this.addLineInternal(line);
        return line;
    }

    addLineInternal(line) {
        var grids = gridSpread(line.a, line.b, this.gridSize),
            x, y, i, l;
        for (i = 0, l = grids.length; i < l; i++) {
            x = floor(grids[i].x / this.gridSize);
            y = floor(grids[i].y / this.gridSize);
            if (this.grid[x] === undefined) {
                this.grid[x] = {};
            }
            if (this.grid[x][y] === undefined) {
                this.grid[x][y] = new GridBox();
            }
            this.grid[x][y].lines.push(line);
            this.lines.push(line);
            delete this.cache[x + '_' + y];
        }
    }

    addObject(item) {
        var track = this,
            x = floor(item.pos.x / track.gridSize),
            y = floor(item.pos.y / track.gridSize);
        if (track.grid[x] === undefined) {
            track.grid[x] = {};
        }
        if (track.grid[x][y] === undefined) {
            track.grid[x][y] = new GridBox(x, y);
        }
        track.grid[x][y].objects.push(item);
    }

    selfAdd(arr) {
        for (var i = 0, l = arr.length; i < l; i++) {
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