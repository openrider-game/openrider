import Item from "../Item.js";
import Vector from "../../numeric/Vector.js";
import Entity from "../../entity/Entity.js";
import Grid from "../../grid/Grid.js";
import PhysicsCell from "../../grid/cell/PhysicsCell.js";

export default class Line extends Item {
    /**
     *
     * @param {Vector} pos
     * @param {Vector} endPos
     */
    constructor(pos, endPos, track) {
        super(pos, track);
        /** @type {Vector} */
        this.endPos = endPos;
        /** @type {Vector} */
        this.vector = this.endPos.sub(this.pos);
        /** @type {number} */
        this.len = this.vector.getLength();
        /** @type {boolean} */
        this.touched = false;
        /** @type {boolean} */
        this.stringGot = false;
    }

    /**
     *
     * @param {Entity} part
     */
    touch(part) {}

    /**
     *
     * @param {Vector} eraserPoint
     * @param {number} radius
     */
    checkDelete(eraserPoint, radius) {
        let eraserToPosDistance = eraserPoint.sub(this.pos);
        let normalizedVector = this.vector.recipScale(this.len);
        let normalizedDirection = eraserToPosDistance.dot(normalizedVector);
        let posToCheck = new Vector();

        if (normalizedDirection <= 0) {
            posToCheck.set(this.pos);
        } else if (normalizedDirection >= this.len) {
            posToCheck.set(this.endPos);
        } else {
            posToCheck.set(this.pos.add(normalizedVector.scale(normalizedDirection)));
        }

        let eraserToPosToCheckDistance = eraserPoint.sub(posToCheck);

        if (eraserToPosToCheckDistance.getLength() <= radius) {
            this.removeFromTrack();
            return this;
        }

        return null;
    }

    /**
     * @return {string}
     */
    getEnd() {
        let end = ' ' + this.b.toString();
        let gridCoords = Grid.gridCoords(this.endPos, this.grid.cellSize);
        /** @type {PhysicsCell} */
        let nextGrid = this.grid.cell(gridCoords.x, gridCoords.y);
        let next = nextGrid.search(this.endPos, this.constructor);
        if (next !== undefined) {
            end += next.getEnd();
        }

        return end;
    }

    /**
     * @returns {string}
     */
    toString() {
        return this.pos.toString() + this.getEnd();
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     */
    renderCache(ctx, offsetLeft, offsetTop, zoom) {
        ctx.beginPath();
        ctx.moveTo(this.pos.x * zoom - offsetLeft, this.pos.y * zoom - offsetTop);
        ctx.lineTo(this.endPos.x * zoom - offsetLeft, this.endPos.y * zoom - offsetTop);
        ctx.stroke();
    }

    render(ctx) {}
}