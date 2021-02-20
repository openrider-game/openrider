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
        let testGhostBMX = new GhostRunner(this.track, '0 69 93 912 967 1548 1575 1902 1927,2266 2282 2291 2351 2392 2397,52 68 108 135 192 201 298 324 373 378 383 390 494 509 555 562 579 582 728 736 746 754 766 770 908 931 1170 1179 1219 1222 1297 1300 1306 1309 1391 1399 1593 1604 1669 1672 1687 1691 1926 1947 2001 2009 2119 2123 2356 2363,71 89 136 148 246 278 333 340 361 364 436 474 666 709 798 803 966 976 1195 1198 1356 1368 1469 1478 1497 1516 1544 1567 1903 1920 1966 1972 2076 2084 2102 2107 2196 2207 2235 2240 2252 2282 2287 2352 2375 2398,250 251 293 294 447 448 499 500 662 663 1134 1135 1471 1472 1487 1488,2419,BMX');
        this.track.ghostRunners.push(testGhostBMX);
        testGhostBMX.createBike();

        let testGhostMTB = new GhostRunner(this.track, '0 61 97 431 462 886 940 1525 1557 1881 1902,,41 63 109 120 159 165 171 188 320 328 346 352 361 366 369 374 471 488 563 567 572 576 675 742 759 765 885 960 1150 1154 1186 1193 1212 1217 1222 1233 1274 1279 1389 1397 1405 1409 1472 1488 1575 1586 1631 1636 1668 1672 1906 1927 1961 1966 1973 1978 2087 2098 2209 2216 2224 2228,69 92 231 272 425 458 511 521 767 787 964 991 1072 1077 1090 1140 1260 1267 1339 1348 1448 1467 1525 1556 1880 1902 1939 1945 2029 2050 2158 2175,235 236 287 288 432 433 509 510 647 648 1121 1122 1342 1343 1363 1364 1451 1452 1471 1472 1528 1529 1563 1564,2271,MTB');
        this.track.ghostRunners.push(testGhostMTB);
        testGhostMTB.createBike();

        this.track.ghostRunners.sort((a, b) => a.finalTime - b.finalTime);

        this.track.focalPoint = this.track.ghostRunners[0].instance.hitbox;

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