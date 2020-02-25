import { canvas, shadeLines, DEBUG } from "../../bootstrap.js";
import { TOOL } from "../constant/ToolConstants.js";
import { BIKE_BMX } from "../constant/BikeConstants.js";
import { GridBox } from "./GridBox.js";
import { SceneryLine } from "./line/SceneryLine.js";
import { SolidLine } from "./line/SolidLine.js";
import { Point } from "../Point.js";
import { BMX } from "../bike/BMX.js";
import { MTB } from "../bike/MTB.js";
import { Harley } from "../bike/Harley.js";
import { CanvasHelper } from "../helper/CanvasHelper.js";

export class Track {
    constructor() {
        let drawer = CanvasHelper.getInstance();
        this.grid = {};
        this.gridSize = 100;
        this.cache = {};
        this.spreadCache = {};
        this.zoomFactor = 0.6;
        this.currentTime = 0;
        this.currentBike = BIKE_BMX;
        this.paused = false;
        this.currentTool = TOOL.CAMERA;
        this.camera = new Point(0, 0);
        drawer.fillText('Loading track... Please wait.', 36, 16);
        this.objects = [];
        this.checkpoints = [];
        this.left =
            this.right =
            this.up =
            this.down = 0;
    }

    reset() {
        this.checkpoints = [];
        this.restart();
    }

    restart() {
        this.unreachEverything();
        this.paused = false;
        let cp = this.checkpoints[this.checkpoints.length - 1];
        this.bike = new({ BMX: BMX, MTB: MTB, HAR: Harley }[this.currentBike] || BMX)(this, cp && cp.bikeList);
        if (this.bike) {
            this.focalPoint = this.bike.head;
            /** HACK */
            this.currentTime = cp ? cp.currentTime : 0;
            /** /HACK */
            this.camera = this.bike.head.pos.clone();
        }
    }

    drawGridBoxes(drawer) {
        // Coordinates of top left, and bottom right, gridBoxes.
        let topLeft = new Point(0, 0).normalizeToCanvas(this);
        let bottomRight = new Point(canvas.width, canvas.height).normalizeToCanvas(this);
        topLeft.x = Math.floor(topLeft.x / this.gridSize);
        topLeft.y = Math.floor(topLeft.y / this.gridSize);
        bottomRight.x = Math.floor(bottomRight.x / this.gridSize);
        bottomRight.y = Math.floor(bottomRight.y / this.gridSize);

        let onScreen = new Set();  // List of gridBoxes that are on the screen
        let key;
        // Loop through all the gridBoxes on the screen
        for (let x = topLeft.x; x <= bottomRight.x; x++) {
            for (let y = topLeft.y; y <= bottomRight.y; y++) {
                if (this.grid[x] !== undefined && this.grid[x][y] !== undefined) {
                    if (this.grid[x][y].lines.length > 0 || this.grid[x][y].scenery.length > 0) {
                        key = x + '_' + y;
                        onScreen.add(key);
                        if (this.cache[key] === undefined) {    // If the gridBox is not drawn, draw it.
                            let canvas = this.cache[key] = document.createElement('canvas');
                            let ctx = canvas.getContext('2d');
                            canvas.width = this.gridSize * this.zoomFactor;
                            canvas.height = this.gridSize * this.zoomFactor;
                            ctx.lineCap = 'round';
                            ctx.lineWidth = Math.max(2 * this.zoomFactor, 0.5);
                            ctx.strokeStyle = '#aaa';
                            ctx.beginPath();
                            for (let i = 0, l = this.grid[x][y].scenery.length; i < l; i++) {
                                this.grid[x][y].scenery[i].render(ctx, x * this.gridSize * this.zoomFactor, y * this.gridSize * this.zoomFactor);
                            }
                            ctx.stroke();
                            ctx.strokeStyle = '#000';
                            if (shadeLines) {
                                ctx.shadowOffsetX =
                                    ctx.shadowOffsetY = 2;
                                ctx.shadowBlur = Math.max(2, 10 * this.zoomFactor);
                                ctx.shadowColor = '#000';
                            }
                            ctx.beginPath();
                            for (let i = 0, l = this.grid[x][y].lines.length; i < l; i++) {
                                this.grid[x][y].lines[i].render(ctx, x * this.gridSize * this.zoomFactor, y * this.gridSize * this.zoomFactor);
                            }
                            ctx.stroke();
                        }
                        drawer.drawImage(this.cache[key], Math.floor(canvas.width / 2 - this.camera.x * this.zoomFactor + x * this.gridSize * this.zoomFactor), Math.floor(canvas.height / 2 - this.camera.y * this.zoomFactor + y * this.gridSize * this.zoomFactor));
                    }
                    drawer.setProperty('strokeStyle', '#000');
                    for (let i = 0, l = this.grid[x][y].objects.length; i < l; i++) {
                        this.grid[x][y].objects[i].render();
                    }
                }
            }
        }
        // Delete all cached gridBoxes that are no longer on the screen.
        // Note: It would be faster to store which gridBoxes were on screen in the last frame, and only check those.
        for (let Ay in this.cache) {
            if (!onScreen.has(Ay)) {
                delete this.cache[Ay];
            }
        }


        if (window.debugMode) {
            drawer.beginPath();
            for (let y = topLeft.y; y <= bottomRight.y; y++) {
                drawer.moveTo(0, Math.floor(canvas.height / 2 - this.camera.y * this.zoomFactor + y * this.gridSize * this.zoomFactor));
                drawer.lineTo(canvas.width, Math.floor(canvas.height / 2 - this.camera.y * this.zoomFactor + y * this.gridSize * this.zoomFactor));
            }
            for (let x = topLeft.x; x <= bottomRight.x; x++) {
                drawer.moveTo(Math.floor(canvas.width / 2 - this.camera.x * this.zoomFactor + x * this.gridSize * this.zoomFactor), 0);
                drawer.lineTo(Math.floor(canvas.width / 2 - this.camera.x * this.zoomFactor + x * this.gridSize * this.zoomFactor), canvas.height);
            }
            drawer.setProperty('strokeStyle', '#0000ff88').setProperty('lineWidth', 2);
            drawer.stroke();
        }
    }

    gridSpread(_from, _to, q) {
        if (!this.spreadCache[q]) {
            this.spreadCache[q] = {};
        }
        var key = _from + ';' + _to;
        if (this.spreadCache[q][key]) {
            return this.spreadCache[q][key];
        }

        // To fix thin lines, go through the edges of the line, rather than the center of the line.
        const vector = new Point(_to.x - _from.x, _to.y - _from.y);
        const len = vector.getLength();
        const froms = [
            new Point(_from.x + (-vector.x - vector.y) / len, _from.y + ( vector.x - vector.y) / len),
            new Point(_from.x + (-vector.x + vector.y) / len, _from.y + (-vector.x - vector.y) / len)
        ];
        const tos = [
            new Point(_to.x + ( vector.x - vector.y) / len, _to.y + ( vector.x + vector.y) / len),
            new Point(_to.x + ( vector.x + vector.y) / len, _to.y + (-vector.x + vector.y) / len)
        ];

        const lines = this.spreadCache[q][key] = [];

        for (let edge = 0; edge < 2; edge++) {
            var from = new Point(froms[edge].x, froms[edge].y),
                factor = (tos[edge].y - froms[edge].y) / (tos[edge].x - froms[edge].x),
                direction = new Point(froms[edge].x < tos[edge].x ? 1 : -1, froms[edge].y < tos[edge].y ? 1 : -1),
                i = 0;
            lines.push(froms[edge]);
            while (i < 5000) {
                if (Math.floor(from.x / q) === Math.floor(tos[edge].x / q) && Math.floor(from.y / q) === Math.floor(tos[edge].y / q)) {
                    break;
                }
                var to1 = new Point(
                    direction.x < 0 ? Math.round(Math.ceil((from.x + 1) / q + direction.x) * q) - 1 : Math.round(Math.floor(from.x / q + direction.x) * q), 0
                );
                to1.y = Math.round(froms[edge].y + (to1.x - froms[edge].x) * factor);
                var to2 = new Point(
                    0, direction.y < 0 ? Math.round(Math.ceil((from.y + 1) / q + direction.y) * q) - 1 : Math.round(Math.floor(from.y / q + direction.y) * q)
                );
                to2.x = Math.round(froms[edge].x + (to2.y - froms[edge].y) / factor);
                // Take the shortest line piece
                if (Math.pow(to1.x - froms[edge].x, 2) + Math.pow(to1.y - froms[edge].y, 2) < Math.pow(to2.x - froms[edge].x, 2) + Math.pow(to2.y - froms[edge].y, 2)) {
                    from = to1;
                } else {
                    from = to2;
                }
                lines.push(from);

                i++;
            }
        }
        return lines;
    }

    addLineInternal(line) {
        let grids = this.gridSpread(line.a, line.b, this.gridSize),
            x, y;
        const drawnLines = new WeakSet();   // List of gridBoxes that have the lines, to prevent duplicates
        for (let i = 0, l = grids.length; i < l; i++) {
            x = Math.floor(grids[i].x / this.gridSize);
            y = Math.floor(grids[i].y / this.gridSize);
            if (this.grid[x] === undefined) {
                this.grid[x] = {};
            }
            if (this.grid[x][y] === undefined) {
                this.grid[x][y] = new GridBox();
            }
            if (!drawnLines.has(this.grid[x][y])) {
                if (line.isScenery) {
                    this.grid[x][y].scenery.push(line);
                } else {
                    this.grid[x][y].lines.push(line);
                }
                drawnLines.add(this.grid[x][y]);
            }
            delete this.cache[x + '_' + y];
        }
    }

    doAfterAddLine() {}

    addLine(a, b, scenery) {
        let L = scenery ? SceneryLine : SolidLine,
            line = new L(a.x, a.y, b.x, b.y, this);
        if (line.len >= 2 && line.len < 100000) {
            this.addLineInternal(line);
            this.doAfterAddLine(line);
        }
        return line;
    }

    addObject(item) {
        let track = this,
            x = Math.floor(item.pos.x / track.gridSize),
            y = Math.floor(item.pos.y / track.gridSize);
        if (track.grid[x] === undefined) {
            track.grid[x] = {};
        }
        if (track.grid[x][y] === undefined) {
            track.grid[x][y] = new GridBox(x, y);
        }
        track.grid[x][y].objects.push(item);
    }
}