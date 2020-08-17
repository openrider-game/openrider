import { shadeLines } from "../../bootstrap.js";
import { TOOL } from "../constant/ToolConstants.js";
import { BIKE_BMX } from "../constant/BikeConstants.js";
import { GridBox } from "./GridBox.js";
import { SceneryLine } from "./line/SceneryLine.js";
import { SolidLine } from "./line/SolidLine.js";
import { Vector } from "../Vector.js";
import { BMX } from "../bike/BMX.js";
import { MTB } from "../bike/MTB.js";
import { Harley } from "../bike/Harley.js";
import { CanvasHelper } from "../helper/CanvasHelper.js";
import Controls from "../helper/Controls.js";
import { ENABLE_GRID } from "../constant/TrackConstants.js";

export class Track {
    constructor(canvas, game) {
        let drawer = CanvasHelper.getInstance();

        this.game = game;
        this.canvas = canvas;
        this.controls = new Controls(document);
        this.grid = {};
        this.gridSize = 100;
        this.cache = {};
        this.spreadCache = {};
        this.zoomFactor = 0.6;
        this.currentTime = 0;
        this.currentBike = BIKE_BMX;
        this.paused = false;
        this.currentTool = TOOL.CAMERA;
        this.camera = new Vector(0, 0);
        drawer.fillText('Loading track... Please wait.', 36, 16);
        this.collectables = [];
        this.checkpoints = [];
        this.left =
            this.right =
            this.up =
            this.down = 0;
        this.initControls();
    }

    update() {}
    fixedUpdate() {}

    initControls() {
        let controls = {
            'brake': [40, Controls.NONE],
            'accelerate': [38, Controls.NONE],
            'left': [37, Controls.NONE],
            'right': [39, Controls.NONE],
            'turn': [90, Controls.NONE],
            'camera-left': [37, Controls.SHIFT],
            'camera-right': [39, Controls.SHIFT],
            'camera-up': [38, Controls.SHIFT],
            'camera-down': [40, Controls.SHIFT]
        };

        for (let controlName in controls) {
            let control = controls[controlName];
            this.controls.registerControl(controlName, control[0], control[1]);
        }
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
        let topLeft = new Vector(0, 0).normalizeToCanvas(this);
        let bottomRight = new Vector(this.canvas.width, this.canvas.height).normalizeToCanvas(this);
        topLeft.x = Math.floor(topLeft.x / this.gridSize);
        topLeft.y = Math.floor(topLeft.y / this.gridSize);
        bottomRight.x = Math.floor(bottomRight.x / this.gridSize);
        bottomRight.y = Math.floor(bottomRight.y / this.gridSize);

        let onScreen = new Set(); // List of gridBoxes that are on the screen
        let key;
        // Loop through all the gridBoxes on the screen
        for (let x = topLeft.x; x <= bottomRight.x; x++) {
            for (let y = topLeft.y; y <= bottomRight.y; y++) {
                if (this.grid[x] !== undefined && this.grid[x][y] !== undefined) {
                    if (this.grid[x][y].lines.length > 0 || this.grid[x][y].scenery.length > 0) {
                        key = x + '_' + y;
                        onScreen.add(key);
                        if (this.cache[key] === undefined) { // If the gridBox is not drawn, draw it.
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
                        drawer.drawImage(this.cache[key], Math.floor(this.canvas.width / 2 - this.camera.x * this.zoomFactor + x * this.gridSize * this.zoomFactor), Math.floor(this.canvas.height / 2 - this.camera.y * this.zoomFactor + y * this.gridSize * this.zoomFactor));
                    }
                    drawer.setProperty('strokeStyle', '#000');
                    for (let i = 0, l = this.grid[x][y].powerups.length; i < l; i++) {
                        this.grid[x][y].powerups[i].render();
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

        if (ENABLE_GRID) {
            drawer.beginPath();
            for (let y = topLeft.y; y <= bottomRight.y; y++) {
                drawer.moveTo(0, Math.floor(this.canvas.height / 2 - this.camera.y * this.zoomFactor + y * this.gridSize * this.zoomFactor));
                drawer.lineTo(this.canvas.width, Math.floor(this.canvas.height / 2 - this.camera.y * this.zoomFactor + y * this.gridSize * this.zoomFactor));
            }
            for (let x = topLeft.x; x <= bottomRight.x; x++) {
                drawer.moveTo(Math.floor(this.canvas.width / 2 - this.camera.x * this.zoomFactor + x * this.gridSize * this.zoomFactor), 0);
                drawer.lineTo(Math.floor(this.canvas.width / 2 - this.camera.x * this.zoomFactor + x * this.gridSize * this.zoomFactor), this.canvas.height);
            }
            drawer.setProperty('strokeStyle', '#abc').setProperty('lineWidth', 2);
            drawer.stroke();
        }
    }

    gridSpread(_from, _to, q) {
        if (!this.spreadCache[q]) {
            this.spreadCache[q] = {};
        }
        let key = _from + ';' + _to;
        if (this.spreadCache[q][key]) {
            return this.spreadCache[q][key];
        }

        // If it's a powerup, skip the algorithm.
        if (_from.x === _to.x && _from.y === _to.y) {
            return this.spreadCache[q][key] = [new Vector(_from.x, _from.y)];
        }

        // To fix thin lines, go through the edges of the line, rather than the center of the line.
        const vector = new Vector(_to.x - _from.x, _to.y - _from.y);
        const len = vector.getLength();
        const froms = [
            new Vector(_from.x + (-vector.x - vector.y) / len, _from.y + (vector.x - vector.y) / len),
            new Vector(_from.x + (-vector.x + vector.y) / len, _from.y + (-vector.x - vector.y) / len)
        ];
        const tos = [
            new Vector(_to.x + (vector.x - vector.y) / len, _to.y + (vector.x + vector.y) / len),
            new Vector(_to.x + (vector.x + vector.y) / len, _to.y + (-vector.x + vector.y) / len)
        ];

        const gridPoints = this.spreadCache[q][key] = [];

        for (let edge = 0; edge < 2; edge++) {
            let from = new Vector(froms[edge].x, froms[edge].y),
                factor = (tos[edge].y - froms[edge].y) / (tos[edge].x - froms[edge].x),
                direction = new Vector(froms[edge].x < tos[edge].x ? 1 : -1, froms[edge].y < tos[edge].y ? 1 : -1),
                i = 0;
            gridPoints.push(froms[edge]);
            while (i < 5000) {
                if (Math.floor(from.x / q) === Math.floor(tos[edge].x / q) && Math.floor(from.y / q) === Math.floor(tos[edge].y / q)) {
                    break;
                }
                let to1 = new Vector(
                    direction.x < 0 ? Math.round(Math.ceil((from.x + 1) / q + direction.x) * q) - 1 : Math.round(Math.floor(from.x / q + direction.x) * q), 0
                );
                to1.y = Math.round(froms[edge].y + (to1.x - froms[edge].x) * factor);
                let to2 = new Vector(
                    0, direction.y < 0 ? Math.round(Math.ceil((from.y + 1) / q + direction.y) * q) - 1 : Math.round(Math.floor(from.y / q + direction.y) * q)
                );
                to2.x = Math.round(froms[edge].x + (to2.y - froms[edge].y) / factor);
                // Take the shortest line piece
                if (Math.pow(to1.x - froms[edge].x, 2) + Math.pow(to1.y - froms[edge].y, 2) < Math.pow(to2.x - froms[edge].x, 2) + Math.pow(to2.y - froms[edge].y, 2)) {
                    from = to1;
                } else {
                    from = to2;
                }
                gridPoints.push(from);

                i++;
            }
        }
        return gridPoints;
    }

    addLineInternal(line) {
        let grids = this.gridSpread(line.a, line.b, this.gridSize),
            x, y;
        const drawnLines = new WeakSet(); // List of gridBoxes that have the lines, to prevent duplicates
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
        track.grid[x][y].powerups.push(item);
    }

    touch(part) {
        let x = Math.floor(part.pos.x / this.gridSize - 0.5),
            y = Math.floor(part.pos.y / this.gridSize - 0.5),
            grid = this.grid;

        // Mark lines as untouched
        if (grid[x] !== undefined) {
            if (grid[x][y] !== undefined) {
                grid[x][y].untouch();
            }
            if (grid[x][y + 1] !== undefined) {
                grid[x][y + 1].untouch();
            }
        }
        if (grid[x + 1] !== undefined) {
            if (grid[x + 1][y] !== undefined) {
                grid[x + 1][y].untouch();
            }
            if (grid[x + 1][y + 1] !== undefined) {
                grid[x + 1][y + 1].untouch();
            }
        }

        // Collision detection
        if (grid[x] !== undefined && grid[x][y] !== undefined) {
            grid[x][y].touch(part);
        }
        if (grid[x + 1] !== undefined) {
            if (grid[x + 1][y] !== undefined) {
                grid[x + 1][y].touch(part);
            }
            if (grid[x + 1][y + 1] !== undefined) {
                grid[x + 1][y + 1].touch(part);
            }
        }
        if (grid[x] !== undefined && grid[x][y + 1] !== undefined) {
            grid[x][y + 1].touch(part);
        }
        return this;
    }
}