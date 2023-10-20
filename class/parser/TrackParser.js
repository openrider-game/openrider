import SolidLine from "../item/line/SolidLine.js";
import SceneryLine from "../item/line/SceneryLine.js";
import Vector from "../numeric/Vector.js";
import { ITEM_LIST, LINE, LINE_FOREGROUND } from "../constant/ItemConstants.js";
import Track from "../track/Track.js";
import Line from "../item/line/Line.js";
import { BIKE_MAP } from "../constant/BikeConstants.js";
import { MIN_ZOOM } from "../constant/TrackConstants.js";

export default class TrackParser {
    /**
     *
     * @param {string} rawTrack
     */
    constructor(track) {
        /** @type {Track} */
        this.track = track;

        this.stepSize = 1000;
    }

    init(rawTrack) {
        this.memReset();

        this.split(rawTrack);

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

        this.caching = false;
        this.cacheIndex = 0;

        this.renderIndex = 0;
        this.proxyIndex = 0;
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
        let l = Math.min(this.itemData.index + this.stepSize, this.itemData.code.length);
        for (; this.itemData.index < l; this.itemData.index++) {
            let itemCode = this.itemData.code[this.itemData.index].split(' ');
            if (itemCode.length > 2) {
                let itemClass = itemMap.get(itemCode[0]);

                if (itemClass) {
                    let item = itemClass.createInstance(itemCode, this.track);

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

        this.currentStep = this.processMainCache;
        this.caching = true;
    }

    processMainCache() {
        this.progressLabel = 'Main cache';
        this.length = this.track.cache.cells.size;
        this.processCache(this.track.cache, 1, this.processForegroundCache);
    }

    processForegroundCache() {
        this.progressLabel = 'Foreground cache';
        this.length = this.track.foregroundCache.cells.size;
        this.processCache(this.track.foregroundCache, 0.5, this.finish);
    }

    finish() {
        this.memReset();
        this.done = true;
    }

    parseLines(lineData, type, event, next) {
        let l = Math.min(lineData.index + this.stepSize, lineData.code.length);
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

    processCache(cache, opacityFactor, next) {
        let l = Math.min(this.cacheIndex + 1, cache.cells.size);
        let cacheCells = Array.from(cache.cells.values());

        for (; this.cacheIndex < l; this.cacheIndex++) {
            let cell = cacheCells[this.cacheIndex];
            for (let zoom = MIN_ZOOM; zoom <= 1; zoom = Math.round((zoom + 0.2) * 100) / 100) {
                if (cell.lines.length + cell.scenery.length > 500) {
                    cell.canvas.set(zoom, cell.renderCache(zoom, opacityFactor, true, () => { this.proxyIndex++ }));
                } else {
                    this.proxyIndex++;
                }

                this.renderIndex++;
            }
        }

        if (this.cacheIndex >= cache.cells.size && this.proxyIndex >= this.renderIndex) {
            this.proxyIndex = 0;
            this.renderIndex = 0;
            this.cacheIndex = 0;
            this.currentStep = next;
        }
    }

    split(rawTrack) {
        let split = rawTrack.split('#');
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