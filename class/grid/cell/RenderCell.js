import RenderCellTask from "../../thread/RenderCellTask.js";
import WorkerPool from "../../thread/WorkerPool.js";
import Cell from "./Cell.js";

export default class RenderCell extends Cell {
    constructor(x, y, size) {
        super(x, y, size);

        this.canvas = new Map();
    }

    clear() {
        this.canvas = new Map();
    }

    /**
     * @return {number} zoom
     * @return {number} opacityFactor
     * @return {HTMLCanvasElement}
     */
    getCanvas(zoom, opacityFactor, fastRender, callback) {
        if (!this.canvas.has(zoom)) {
            this.canvas.set(zoom, this.renderCache(zoom, opacityFactor, fastRender, callback));
        }

        return this.canvas.get(zoom);
    }

    /**
     * @return {number} zoom
     * @return {number} opacityFactor
     * @return {HTMLCanvasElement}
     */
    renderCache(zoom, opacityFactor, fastRender, callback) {
        let canvas = document.createElement('canvas');
        if (fastRender) {
            let offscreenCanvas = canvas.transferControlToOffscreen();
            WorkerPool.postTask(new RenderCellTask(this, zoom, opacityFactor, offscreenCanvas, callback));
        } else {
            let context = canvas.getContext('2d');

            // bleed cells by 1px on each side to avoid thin lines
            canvas.width = this.size * zoom + 2;
            canvas.height = this.size * zoom + 2;

            context.lineCap = 'round';
            context.lineWidth = Math.max(2 * zoom, 0.5);
            context.globalAlpha = opacityFactor;

            context.strokeStyle = '#aaa';
            for (let scenery of this.scenery) {
                scenery.renderCache(context, this.x * zoom - 1, this.y * zoom - 1, zoom);
            }

            context.strokeStyle = '#000';
            for (let line of this.lines) {
                line.renderCache(context, this.x * zoom - 1, this.y * zoom - 1, zoom);
            }

            if(callback) {
                callback();
            }
        }

        return canvas;
    }
}