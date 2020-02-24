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

    gridSpread(_from, _to, q) {
        if (!this.spreadCache[q]) {
            this.spreadCache[q] = {};
        }
        var key = _from + ';' + _to;
        if (this.spreadCache[q][key]) {
            return this.spreadCache[q][key];
        }
        var lines = this.spreadCache[q][key] = [],
            from = new Point(_from.x, _from.y),
            factor = (_to.y - _from.y) / (_to.x - _from.x),
            direction = new Point(_from.x < _to.x ? 1 : -1, _from.y < _to.y ? 1 : -1),
            i = 0;
        lines.push(_from);
        while (i < 5000) {
            if (Math.floor(from.x / q) === Math.floor(_to.x / q) && Math.floor(from.y / q) === Math.floor(_to.y / q)) {
                break;
            }
            var to1 = new Point(
                direction.x < 0 ? Math.round(Math.ceil((from.x + 1) / q + direction.x) * q) - 1 : Math.round(Math.floor(from.x / q + direction.x) * q), 0
            );
            to1.y = Math.round(_from.y + (to1.x - _from.x) * factor);
            var to2 = new Point(
                0, direction.y < 0 ? Math.round(Math.ceil((from.y + 1) / q + direction.y) * q) - 1 : Math.round(Math.floor(from.y / q + direction.y) * q)
            );
            to2.x = Math.round(_from.x + (to2.y - _from.y) / factor);
            // Take the shortest line piece
            if (Math.pow(to1.x - _from.x, 2) + Math.pow(to1.y - _from.y, 2) < Math.pow(to2.x - _from.x, 2) + Math.pow(to2.y - _from.y, 2)) {
                from = to1;
                lines.push(to1);
            } else {
                from = to2;
                lines.push(to2);
            }
            i++;
        }
        return lines;
    }

    addLineInternal(line) {
        let grids = this.gridSpread(line.a, line.b, this.gridSize),
            x, y;
        for (let i = 0, l = grids.length; i < l; i++) {
            x = Math.floor(grids[i].x / this.gridSize);
            y = Math.floor(grids[i].y / this.gridSize);
            if (this.grid[x] === undefined) {
                this.grid[x] = {};
            }
            if (this.grid[x][y] === undefined) {
                this.grid[x][y] = new GridBox();
            }
            if (line.isScenery) {
                this.grid[x][y].scenery.push(line);
            } else {
                this.grid[x][y].lines.push(line);
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