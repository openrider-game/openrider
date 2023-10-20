import GameObject from "../game/GameObject.js";
import Vector from "../numeric/Vector.js";
import Entity from "../entity/Entity.js";
import Track from "../track/Track.js";

export default class Item extends GameObject {
    /**
     *
     * @param {Vector} pos
     * @param {Track} track
     */
    constructor(pos, track) {
        super();
        /** @type {number} */
        this.id = Item.id++;
        this.track = track;
        /** @type {Vector} */
        this.pos = pos;
        /** @type {Vector} */
        this.endPos = pos;

        /** @type {boolean} */
        this.recorded = false;

        this.grid = null;
        this.cache = null;
    }

    static get itemName() { return 'Item'; }
    static get color() { return '#fff'; }
    static get code() { return null; }

    fixedUpdate() {}
    update(progress, delta) {}

    /**
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
        let pos = this.pos.toPixel(this.track);

        ctx.save();
        ctx.fillStyle = this.constructor.color;
        ctx.lineWidth = Math.max(2 * this.track.zoomFactor, 0.5);
        ctx.beginPath();
        ctx.moveTo(pos.x + 7 * this.track.zoomFactor, pos.y);
        ctx.arc(pos.x, pos.y, 7 * this.track.zoomFactor, 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.stroke();

        ctx.restore();
    }

    renderDebug(ctx) {
        let pos = this.pos.toPixel(this.track);

        ctx.save();
        ctx.font = `bold ${Math.min(15 * this.track.zoomFactor, 15)}px Ubuntu`;
        ctx.fillStyle = '#000';
        let idMetrics = ctx.measureText(this.id);
        ctx.fillText(this.id, pos.x - idMetrics.width / 2, pos.y - 15 * this.track.zoomFactor);

        ctx.restore();
    }

    /**
     *
     * @param {Entity} part
     */
    touch(part) {
        if (part.pos.distanceToSquared(this.pos) < 500) {
            this.onTouch(part);
        }
    }

    /**
     *
     * @param {Vector} eraserPoint
     * @param {number} radius
     * @returns {Item}
     */
    checkDelete(eraserPoint, radius) {
        if (eraserPoint.distanceTo(this.pos) < radius + 7) {
            this.removeFromTrack();
            return this;
        }

        return null;
    }

    addToTrack() {
        this.track.add(this, this.grid, this.cache);
        this.onAdd();
        return this;
    }

    removeFromTrack() {
        this.track.remove(this);
        this.onDelete();
        return this;
    }

    toString() {
        this.recorded = true;
        return this.constructor.code + ' ' + this.pos.toString();
    }

    /**
     *
     * @param {Entity} part
     */
    onTouch(part) {}

    onDelete() {
        this.grid.totalObjects.delete(this.id);
    }

    onAdd() {
        this.grid.totalObjects.set(this.id, this);
    }

    static createInstance(itemCode, track) {
        let pos = new Vector(parseInt(itemCode[1], 32), parseInt(itemCode[2], 32));
        return new this(pos, track);
    }
}

Item.id = 0;