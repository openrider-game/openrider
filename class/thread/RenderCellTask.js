import RenderCell from "../grid/cell/RenderCell.js";
import WorkerTask from "./WorkerTask.js";

export default class RenderCellTask extends WorkerTask {
    /**
     *
     * @param {RenderCell} cell
     * @param {OffscreenCanvas} canvas
     */
    constructor(cell, zoom, opacityFactor, canvas, callback) {
        super(callback);

        let [sceneryBuffer, lineBuffer] = this.createBuffers(cell);

        this.definition = {
            cellSize: cell.size,
            zoom: zoom,
            opacityFactor: opacityFactor,
            x: cell.x,
            y: cell.y,
            sceneryBuffer: sceneryBuffer,
            lineBuffer: lineBuffer,
            canvas: canvas
        };

        this.transferables = [sceneryBuffer, lineBuffer, canvas];
    }

    /**
     *
     * @param {RenderCell} cell
     */
    createBuffers(cell) {
        let temp = new Array();

        for (let scenery of cell.scenery) {
            temp.push(scenery.pos.x, scenery.pos.y, scenery.endPos.x, scenery.endPos.y);
        }
        let sceneryByteArray = new Int32Array(temp);

        temp = new Array();
        for (let line of cell.lines) {
            temp.push(...line.pos.toArray(), ...line.endPos.toArray());
        }
        let lineByteArray = new Int32Array(temp);

        return [sceneryByteArray.buffer, lineByteArray.buffer];
    }
}