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
        let testGhost = new GhostRunner(this.track, '4 1550 1590 1890 1892,,58 70 154 193 199 205 303 315 337 342 364 368 374 378 520 536 574 577 694 727 902 933 982 991 1238 1253 1311 1315 1393 1399 1501 1507 1598 1609 1626 1631 1647 1652 1998 2005 2013 2022 2124 2136 2252 2261,70 147 246 283 437 492 590 598 739 749 762 767 784 787 950 978 1185 1214 1357 1368 1467 1475 1489 1493 1551 1583 1972 1980 2083 2093 2113 2115 2142 2158 2198 2213 2237 2240,83 84 129 130 140 141 148 149 160 161 177 178 252 253 295 296 444 445 519 520 660 661 1134 1135 1556 1557 1604 1605');
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