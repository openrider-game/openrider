import { context } from "../../unobfuscated_bhr.js";
import { TOOL_CAMERA } from "../constant/ToolConstants.js";
import { BIKE_BMX } from "../constant/TrackConstants.js";
import { fillText } from "../utils/DrawUtils.js";
import { GridBox } from "./GridBox.js";
import { SceneryLine } from "./line/SceneryLine.js";
import { SolidLine } from "./line/SolidLine.js";
import { Point } from "../Point.js";
import { floor, round, ceil, pow } from "../utils/MathUtils.js";

export class Track {
    constructor() {
        this.grid = {};
        this.gridSize = 100;
        this.cache = {};
        this.spreadCache = {};
        this.zoomFactor = 0.6;
        this.currentTime = 0;
        this.currentBike = BIKE_BMX;
        this.paused = false;
        this.currentTool = TOOL_CAMERA;
        this.camera = new Point(0, 0);
        context[fillText]('Loading track... Please wait.', 36, 16);
        this.objects = [];
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
            if (floor(from.x / q) === floor(_to.x / q) && floor(from.y / q) === floor(_to.y / q)) {
                break;
            }
            var to1 = new Point(
                direction.x < 0 ? round(ceil((from.x + 1) / q + direction.x) * q) - 1 : round(floor(from.x / q + direction.x) * q), 0
            );
            to1.y = round(_from.y + (to1.x - _from.x) * factor);
            var to2 = new Point(
                0, direction.y < 0 ? round(ceil((from.y + 1) / q + direction.y) * q) - 1 : round(floor(from.y / q + direction.y) * q)
            );
            to2.x = round(_from.x + (to2.y - _from.y) / factor);
            // Take the shortest line piece
            if (pow(to1.x - _from.x, 2) + pow(to1.y - _from.y, 2) < pow(to2.x - _from.x, 2) + pow(to2.y - _from.y, 2)) {
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
            x = floor(grids[i].x / this.gridSize);
            y = floor(grids[i].y / this.gridSize);
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
}