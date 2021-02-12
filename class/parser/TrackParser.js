import SolidLine from "../item/line/SolidLine.js";
import SceneryLine from "../item/line/SceneryLine.js";
import Vector from "../numeric/Vector.js";
import { ITEM_LIST, LINE, LINE_FOREGROUND } from "../constant/ItemConstants.js";
import DirectionalItem from "../item/DirectionalItem.js";
import Track from "../track/Track.js";
import Item from "../item/Item.js";
import Line from "../item/line/Line.js";
import Toolbar from "../tool/Toolbar.js";
import { BIKE_MAP } from "../constant/BikeConstants.js";
import GhostRunner from "../bike/GhostRunner.js";
import { getGame } from "../../bootstrap.js";

export default class TrackParser {
    /**
     *
     * @param {string} rawTrack
     */
    constructor(rawTrack, track) {
        this.rawTrack = rawTrack;
        /** @type {Track} */
        this.track = track;

        this.stepSize = 1000;

        this.memReset();

        this.split();

        this.length =
            this.solidLineData.code.length +
            this.sceneryLineData.code.length +
            this.itemData.code.length +
            this.foregroundSolidLineData.code.length +
            this.foregroundSceneryLineData.code.length;
    }

    memReset() {
        this.progress = 0;
        this.progressLabel = null;
        this.solidLineData = this.emptyData();
        this.sceneryLineData = this.emptyData();
        this.itemData = this.emptyData();
        this.foregroundSolidLineData = this.emptyData();
        this.foregroundSceneryLineData = this.emptyData();
        this.codeBike = '';
        this.codeOrigin = '';
    }

    parse() {
        this.parseSolidLines();
    }

    parseSolidLines() {
        this.progressLabel = 'Solid lines';
        this.parseLines(
            this.solidLineData,
            SolidLine,
            LINE,
            this.parseSolidLines,
            this.parseSceneryLines
        );
    }

    parseSceneryLines() {
        this.progressLabel = 'Scenery lines';
        this.parseLines(
            this.sceneryLineData,
            SceneryLine,
            LINE,
            this.parseSceneryLines,
            this.parseItems
        );
    }

    parseItems() {
        this.progressLabel = 'Items';
        let itemMap = new Map();
        ITEM_LIST.map(itemClass => {
            itemMap.set(itemClass.code, itemClass);
        });

        this.loopItems(itemMap);
    }

    loopItems(itemMap) {
        let toGo = this.stepSize;
        let l = Math.min(this.itemData.index + toGo, this.itemData.code.length);
        for (; this.itemData.index < l; this.itemData.index++) {
            let itemCode = this.itemData.code[this.itemData.index].split(' ');
            if (itemCode.length > 2) {
                /** @type {Item} */
                let item = null;
                let pos = new Vector(parseInt(itemCode[1], 32), parseInt(itemCode[2], 32));
                let itemClass = itemMap.get(itemCode[0]);

                if (itemClass) {
                    if (itemClass.prototype instanceof DirectionalItem) {
                        item = new itemClass(pos, parseInt(itemCode[3], 32) + 180, this.track);
                    } else {
                        item = new itemClass(pos, this.track);
                    }

                    item.grid = this.track.grid;
                    item.cache = this.track.cache;

                    item.addToTrack();
                }
            }
        }

        if (this.itemData.index < this.itemData.code.length) {
            requestAnimationFrame(() => this.loopItems(itemMap));
        } else {
            this.parseForegroundSolidLines();
        }
    }

    parseForegroundSolidLines() {
        this.progressLabel = 'Foreground Solid lines';
        this.parseLines(
            this.foregroundSolidLineData,
            SolidLine,
            LINE_FOREGROUND,
            this.parseForegroundSolidLines,
            this.parseForegroundSceneryLines
        );
    }

    parseForegroundSceneryLines() {
        this.progressLabel = 'Foreground Scenery lines';
        this.parseLines(
            this.foregroundSceneryLineData,
            SceneryLine,
            LINE_FOREGROUND,
            this.parseForegroundSceneryLines,
            this.parseOrigin
        );
    }

    parseOrigin() {
        this.progressLabel = 'Origin';
        let origin = this.codeOrigin.split(' ');
        let originVector = new Vector(parseInt(origin[0], 32), parseInt(origin[1], 32));
        this.track.origin.set(originVector);
        this.track.camera.set(originVector);
        this.parseBike();
    }

    parseBike() {
        this.progressLabel = 'Bike';
        this.track.playerRunner.bikeClass = BIKE_MAP[this.codeBike];
        this.track.playerRunner.createBike();
        this.track.focalPoint = this.track.playerRunner.instance.hitbox;

        // TODO: remove this temporary test
        let testGhost = new GhostRunner(this.track, '0 69 106 240 297 437 487 1542 1567,,119 133 182 186 191 198 296 305 327 333 362 367 510 517 536 542 905 924 975 981 1175 1187 1222 1228 1375 1382 1593 1607 1971 1995 1999 2004 2111 2119 2237 2247,66 97 242 281 435 470 592 603 765 769 949 963 1340 1352 1447 1455 1468 1475 1541 1564 1902 1946 2074 2089 2098 2105 2181 2196,662 663 1117 1118');
        this.track.ghostRunners.push(testGhost);
        testGhost.createBike();

        this.track.focalPoint = testGhost.instance.hitbox;

        this.done();
    }

    done() {
        getGame().stateManager.push('track');
        Toolbar.makeToolbars(this.track);

        this.memReset();
    }

    parseLines(lineData, type, event, current, next) {
        let toGo = this.stepSize;
        let l = Math.min(lineData.index + toGo, lineData.code.length);
        for (; lineData.index < l; lineData.index++) {
            let lineCode = lineData.code[lineData.index].split(' ');
            if (lineCode.length > 3) {
                for (let k = 0, m = lineCode.length - 2; k < m; k += 2) {
                    let grid = this.track.grid;
                    let cache = this.track.cache;
                    if (event == LINE_FOREGROUND) {
                        grid = this.track.foregroundGrid;
                        cache = this.track.foregroundCache;
                    }

                    /** @type {Line} */
                    let line = new type(
                        new Vector(parseInt(lineCode[k], 32), parseInt(lineCode[k + 1], 32)),
                        new Vector(parseInt(lineCode[k + 2], 32), parseInt(lineCode[k + 3], 32)),
                        this.track
                    );

                    line.grid = grid;
                    line.cache = cache;

                    line.addToTrack();
                }
            }
        }

        if (lineData.index < lineData.code.length) {
            requestAnimationFrame(() => (current.bind(this))());
        } else {
            (next.bind(this))();
        }
    }

    split() {
        let split = this.rawTrack.split('#');
        let i = 0;
        try {
            this.solidLineData.code = split[i++].split(',');
            this.sceneryLineData.code = split[i++].split(',');
            this.itemData.code = split[i++].split(',');
            this.foregroundSolidLineData.code = split[i++].split(',');
            this.foregroundSceneryLineData.code = split[i++].split(',');
            this.codeBike = split[i++] || 'BMX';
            this.codeOrigin = split[i] || '0 0';
        } catch (e) {
            this.codeBike = this.codeBike || 'BMX';
            this.codeOrigin = this.codeOrigin || '0 0';
        }
    }

    emptyData() {
        return { code: '', index: 0 };
    }
}