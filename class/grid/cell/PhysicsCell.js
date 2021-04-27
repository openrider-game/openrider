import Cell from "./Cell.js";
import SceneryLine from "../../item/line/SceneryLine.js";
import SolidLine from "../../item/line/SolidLine.js";
import Entity from "../../entity/Entity.js";
import Vector from "../../numeric/Vector.js";

export default class PhysicsCell extends Cell {
    /**
     *
     * @param {Entity} part
     */
    touch(part) {
        for (let i = this.lines.length - 1; i >= 0; i--) {
            this.lines[i].touch(part);
        }
        if (!part.bike.runner.dead) {
            for (let i = this.objects.length - 1; i >= 0; i--) {
                this.objects[i].touch(part);
            }
        }
    }

    untouch() {
        for (let line of this.lines) {
            line.touched = false;
        }
    }

    search(point, type) {
        let lines;
        switch (type) {
            case SceneryLine:
                lines = this.scenery;
            case SolidLine:
                lines = this.lines;
        }

        for (let line of lines) {
            if (line && line.pos.x === point.x && line.pos.y === point.y && !line.stringGot) {
                return line;
            }
        }
    }

    /**
     *
     * @param {Vector} eraserPoint
     * @param {number} radius
     * @returns []
     */
    checkDelete(eraserPoint, radius, restrict) {
        let deleted = new Array();

        const del = (obj) => {
            let deletedObj = obj.checkDelete(eraserPoint, radius);
            if (deletedObj) {
                deleted.push(deletedObj);
            }
        }

        if (restrict.get('line')) {
            for (let line of this.lines) {
                del(line);
            }
        }

        if (restrict.get('scenery')) {
            for (let scenery of this.scenery) {
                del(scenery);
            }
        }

        if (restrict.get('object')) {
            for (let object of this.objects) {
                del(object);
            }
        }

        return deleted;
    }
}