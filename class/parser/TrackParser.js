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

export default class TrackParser {
    /**
     *
     * @param {string} rawTrack
     */
    constructor(rawTrack, track) {
        this.rawTrack = rawTrack;
        /** @type {Track} */
        this.track = track;

        this.stepSize = 100;

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
        this.done = false;
        this.currentStep = this.parseSolidLines;
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

    parseSolidLines() {
        this.progressLabel = 'Solid lines';
        this.parseLines(
            this.solidLineData,
            SolidLine,
            LINE,
            this.parseSceneryLines
        );
    }

    parseSceneryLines() {
        this.progressLabel = 'Scenery lines';
        this.parseLines(
            this.sceneryLineData,
            SceneryLine,
            LINE,
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

        if (this.itemData.index >= this.itemData.code.length) {
            this.currentStep = this.parseForegroundSolidLines;
        }
    }

    parseForegroundSolidLines() {
        this.progressLabel = 'Foreground Solid lines';
        this.parseLines(
            this.foregroundSolidLineData,
            SolidLine,
            LINE_FOREGROUND,
            this.parseForegroundSceneryLines
        );
    }

    parseForegroundSceneryLines() {
        this.progressLabel = 'Foreground Scenery lines';
        this.parseLines(
            this.foregroundSceneryLineData,
            SceneryLine,
            LINE_FOREGROUND,
            this.parseOrigin
        );
    }

    parseOrigin() {
        this.progressLabel = 'Origin';
        let origin = this.codeOrigin.split(' ');
        let originVector = new Vector(parseInt(origin[0], 32), parseInt(origin[1], 32));
        this.track.origin.set(originVector);
        this.track.camera.set(originVector);

        this.currentStep = this.parseBike;
    }

    parseBike() {
        this.progressLabel = 'Bike';
        this.track.playerRunner.bikeClass = BIKE_MAP[this.codeBike];
        this.track.playerRunner.createBike();
        this.track.focalPoint = this.track.playerRunner.instance.hitbox;

        // TODO: remove this temporary test
        let testGhostBMX = new GhostRunner(this.track, '0 69 96 853 889,,51 68 100 128 185 196 298 304 331 335 353 355 507 514 542 553 668 676 853 877 1115 1123 1161 1165 1180 1187 1313 1321 1433 1436 1518 1522 1537 1540 1615 1620 1624 1634 1945 1953 2060 2064 2184 2188,71 91 151 158 176 180 236 268 420 449 709 714 889 901 916 922 1291 1305 1407 1425 1437 1446 1483 1506 1579 1602 1903 1912 2004 2014 2117 2134,72 73 152 153 240 241 302 303 423 424 491 492 625 626 1084 1085 1410 1411 1432 1433 1483 1484 1505 1506,2242,BMX,BMX Example');
        this.track.ghostRunners.push(testGhostBMX);
        testGhostBMX.createBike();

        let testGhostMTB = new GhostRunner(this.track, '0 67 97 426 475 861 904 1479 1502,1096 1112,48 66 111 133 175 181 188 202 341 347 370 377 505 522 551 557 687 695 863 893 917 924 1161 1194 1233 1241 1319 1332 1427 1431 1448 1453 1471 1482 1511 1527 1554 1559 1596 1600 1796 1901 1948 1960 2034 2042 2064 2074 2160 2182 2205 2213,68 91 149 156 238 269 363 368 426 473 712 719 755 757 895 903 930 948 1033 1040 1074 1103 1119 1148 1225 1233 1291 1305 1340 1347 1405 1421 1437 1444 1483 1500 1572 1579 1901 1932 1940 1947 2006 2022 2113 2144 2192 2198 2201 2204,244 245 309 310 432 433 493 494 634 635 1075 1076 1412 1413 1435 1436 1484 1485 1561 1562,2239,MTB,MTB Example');
        this.track.ghostRunners.push(testGhostMTB);
        testGhostMTB.createBike();

        this.track.ghostRunners.sort((a, b) => a.finalTime - b.finalTime);

        this.track.focalPoint = this.track.ghostRunners[0].instance.hitbox;

        this.currentStep = this.finish;
    }

    finish() {
        Toolbar.makeToolbars(this.track);

        this.memReset();
        this.done = true;
    }

    parseLines(lineData, type, event, next) {
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

        if (lineData.index >= lineData.code.length) {
            this.currentStep = next;
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