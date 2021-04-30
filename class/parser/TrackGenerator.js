import Cell from "../grid/cell/Cell.js";
import Track from "../track/Track.js";

export default class TrackGenerator {
    constructor(track) {
        /** @type {Track} */
        this.track = track;

        this.memReset();
    }

    memReset() {
        this.lines = '';
        this.foregroundLines = '';
        this.scenery = '';
        this.foregroundScenery = '';
        this.objects = '';
        this.bike = '';
        this.origin = '';

        this.progress = 0;
        this.cellCount = 0;
        this.cellKeys = new Map();

        this.foregroundProgress = 0;
        this.foregroundCellCount = 0;
        this.foregroundCellKeys = new Map();

        this.track.grid.cells.forEach((cell, key) => {
            this.cellKeys.set(this.cellCount, key);
            this.cellCount++;
        });

        this.track.foregroundGrid.cells.forEach((cell, key) => {
            this.foregroundCellKeys.set(this.foregroundCellCount, key);
            this.foregroundCellCount++;
        });
    }

    generateNextCell() {
            /** @type {Cell} */
            let currentCell = this.track.grid.cells[this.cellKeys[this.progress]];

            // for (let type of ['lines', 'scenery', 'objects']) {
            //     for (let item of currentCell[type]) {
            //         if (!item.hasString) {
            //             this[type] += `${item.toString()},`;
            //         }
            //     }
            // }

            for (let line of currentCell.lines) {
                if (!line.hasString) {
                    this.lines += `${line.toString()},`;
                }
            }

            for (let scenery of currentCell.scenery) {
                if (!scenery.hasString) {
                    this.scenery += `${scenery.toString()},`;
                }
            }

            for (let object of currentCell.objects) {
                this.objects += `${object.toString()},`;
            }

            this.progress++;
    }

    generateNextForegroundCell() {
            /** @type {Cell} */
            let currentCell = this.track.foregroundGrid.cells[this.foregroundCellKeys[this.foregroundProgress]];

            for (let line of currentCell.lines) {
                if (!line.hasString) {
                    this.foregroundLines += `${line.toString()},`;
                }
            }

            for (let scenery of currentCell.scenery) {
                if (!scenery.hasString) {
                    this.foregroundScenery += `${scenery.toString()},`;
                }
            }

            this.foregroundProgress++;
        }

    cleanup() {
        const resetStrings = (cell, key) => {
            for (let line of cell.lines) {
                line.hasString = false;
            }

            for (let scenery of cell.scenery) {
                scenery.hasString = false;
            }
        };

        this.track.grid.cells.forEach(resetStrings);
        this.track.foregroundGrid.cells.forEach(resetStrings);
        this.memReset();
    }

    getCode() {
        return `${this.lines}#${this.scenery}#${this.objects}#${this.foregroundLines}#${this.foregroundScenery}#${this.bike}#${this.origin}`;
    }
}