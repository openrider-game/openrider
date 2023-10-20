import GhostRunner from "../bike/GhostRunner.js";
import BMX from "../bike/instance/BMX.js";
import PlayerRunner from "../bike/PlayerRunner.js";
import { CACHE_CELL_SIZE, GRID_CELL_SIZE } from "../constant/GridConstants.js";
import { MAX_LINE_LENGTH, MAX_ZOOM, MIN_LINE_LENGTH, MIN_ZOOM } from "../constant/TrackConstants.js";
import Entity from "../entity/Entity.js";
import PhysicsCell from "../grid/cell/PhysicsCell.js";
import RenderCell from "../grid/cell/RenderCell.js";
import Grid from "../grid/Grid.js";
import UndoManager from "../history/UndoManager.js";
import Item from "../item/Item.js";
import Line from "../item/line/Line.js";
import ReachableItem from "../item/ReachableItem.js";
import Vector from "../numeric/Vector.js";
import ToolManager from "../tool/manager/ToolManager.js";
import ToolCollection from "../tool/collection/ToolCollection.js";
import PauseTool from "../tool/PauseTool.js";
import EventManager from "../event/EventManager.js";
import LinkedItem from "../item/LinkedItem.js";

export default class Track {
    /**
     *
     * @param {HTMLCanvasElement} canvas
     * @param {{}} opt
     * @param {EventManager} event
     */
    constructor(canvas, opt = {}, event) {
        /** @type {HTMLCanvasElement} */
        this.canvas = canvas;
        /** @type {number} */
        this.id = opt.id;
        /** @type {string} */
        this.trackCode = opt.trackCode;

        this.event = event;
        this.toolManager = new ToolManager(this);

        /** @type {number} */
        this.zoomFactor = 0.6;
        this.camera = new Vector();
        this.origin = new Vector();

        this.focalPoint = new Entity(new Vector(), new Vector());

        this.realMousePos = new Vector();
        this.mousePos = new Vector();
        this.lastClick = new Vector();
        this.gridDetail = 1;

        this.grid = new Grid(GRID_CELL_SIZE, PhysicsCell);
        this.foregroundGrid = new Grid(GRID_CELL_SIZE, PhysicsCell);

        this.cache = new Grid(CACHE_CELL_SIZE, RenderCell);
        this.foregroundCache = new Grid(CACHE_CELL_SIZE, RenderCell);

        this.targets = new Map();
        this.reachables = new Map();

        this.toolCollection = new ToolCollection();
        this.paused = false;
        this.time = 0;

        this.playerRunner = new PlayerRunner(this, BMX);
        /** @type {Map<number, GhostRunner>} */
        this.ghostRunners = new Map();
        /** @type {Map<number, string>} */
        this.ghostCache = new Map();

        this.undoManager = new UndoManager();

        this.debug = false;
        this.fastRender = false;
    }

    isRace() {
        return this.id && typeof this.id === 'number';
    }

    /**
     * @param {Vector} point
     * @param {number} direction
     */
    zoom(point, direction) {
        let px = point.toPixel(this);
        this.zoomFactor = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round((this.zoomFactor + 0.2 * direction) * 100) / 100));
        this.camera.x = point.x - (px.x - this.canvas.width / 2) / this.zoomFactor;
        this.camera.y = point.y - (px.y - this.canvas.height / 2) / this.zoomFactor;
    }

    /**
     *
     * @param {Item} item
     */
    remove(item) {
        item.grid.remove(item);
        item.cache.remove(item);
    }

    /**
     *
     * @param {Item} item
     * @param {Grid} grid
     * @param {Grid} cache
     */
    add(item, grid, cache) {
        if (!(item instanceof Line) || item.len >= MIN_LINE_LENGTH && item.len < MAX_LINE_LENGTH) {
            grid.add(item);
            cache.add(item);
        }

        return item;
    }

    /**
     *
     * @param {Entity} part
     */
    touch(part) {
        let x = Math.floor(part.pos.x / this.grid.cellSize - 0.5);
        let y = Math.floor(part.pos.y / this.grid.cellSize - 0.5);

        this.grid.cellBlockAction(x, y, cell => cell.untouch());
        this.grid.cellBlockAction(x, y, cell => cell.touch(part));
    }

    checkDelete(eraserPoint, radius, restrict) {
        let x = Math.floor(eraserPoint.x / this.grid.cellSize - 0.5),
            y = Math.floor(eraserPoint.y / this.grid.cellSize - 0.5),
            deleted = new Array();

        const checkCell = (cell, restrict) => {
            deleted.push(...cell.checkDelete(eraserPoint, radius, restrict));
        }

        let mainLayerRestrict = restrict.get('mainLayer');
        let foregroundLayerRestrict = restrict.get('foregroundLayer');
        let mainLayerActive = [...mainLayerRestrict.values()].some(Boolean);
        let foregroundLayerActive = [...foregroundLayerRestrict.values()].some(Boolean);

        if (mainLayerActive) {
            this.grid.cellBlockAction(x, y, cell => checkCell(cell, mainLayerRestrict));
        }

        if (foregroundLayerActive) {
            this.foregroundGrid.cellBlockAction(x, y, cell => checkCell(cell, foregroundLayerRestrict));
        }

        return deleted;
    }

    unreachEverything() {
        this.grid.cells.forEach((cell, key) => {
            for (let object of cell.objects) {
                if (object instanceof ReachableItem) {
                    object.reached = false;

                    if(object instanceof LinkedItem) {
                        object.group.reached = false;
                    }
                }
            }
        });
    }

    pause(paused) {
        this.paused = paused;
        this.toolCollection.getByToolName(PauseTool.toolName).updateUI();
    }

    restart() {
        this.unreachEverything();
        this.pause(false);

        this.playerRunner.restart();
        this.ghostRunners.forEach(runner => {
            runner.restart();
        });

        this.updateFocalPoint();
    }

    updateFocalPoint() {
        this.focalPoint = this.playerRunner.instance.hitbox;
        if (!this.playerRunner.snapshots.length && this.ghostRunners.size) {
            this.focalPoint = this.ghostRunners.get(Array.from(this.ghostRunners.keys())[0]).instance.hitbox;
        }

        this.camera.set(this.focalPoint.displayPos);
    }
}