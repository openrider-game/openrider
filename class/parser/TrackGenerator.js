import Track from "../track/Track.js";

export default class TrackGenerator {
    constructor(track) {
        /** @type {Track} */
        this.track = track;

        this.stepSize = 100;

        this.memReset();

        this.length = this.cellData.length + this.foregroundCellData.length;
    }

    memReset() {
        this.done = false;
        this.currentStep = this.generateCells;
        this.progress = 0;
        this.lines = '';
        this.foregroundLines = '';
        this.scenery = '';
        this.foregroundScenery = '';
        this.objects = '';

        this.cellData = this.emptyCellData(this.track.grid);
        this.foregroundCellData = this.emptyCellData(this.track.foregroundGrid);
    }

    generateCells() {
        let toGo = this.stepSize;
        let l = Math.min(this.cellData.index + toGo, this.cellData.length);
        for (; this.cellData.index < l; this.cellData.index++) {
            let cellKey = this.cellData.keys.get(this.cellData.index);
            let currentCell = this.track.grid.cells.get(cellKey);

            if(currentCell != null) {
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
            }
        }

        if (this.cellData.index >= this.cellData.length) {
            this.currentStep = this.generateForegroundCells;
        }
    }

    generateForegroundCells() {
        let toGo = this.stepSize;
        let l = Math.min(this.foregroundCellData.index + toGo, this.foregroundCellData.length);
        for (; this.foregroundCellData.index < l; this.foregroundCellData.index++) {
            let cellKey = this.foregroundCellData.keys.get(this.foregroundCellData.index);
            let currentCell = this.track.foregroundGrid.cells.get(cellKey);

            if(currentCell != null) {
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
            }
        }

        if (this.foregroundCellData.index >= this.foregroundCellData.length) {
            this.currentStep = this.finish;
        }
    }

    finish() {
        this.cleanup();
        this.done = true;
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
    }

    getCode() {
        return  `${this.lines}#${this.scenery}#${this.objects}#` +
                `${this.foregroundLines}#${this.foregroundScenery}#` +
                `${this.track.playerRunner.bikeClass.name}#${this.track.origin.toString()}`;
    }

    emptyCellData(grid) {
        let cellData = {
            index: 0,
            length: 0,
            keys: new Map()
        };

        grid.cells.forEach((cell, key) => {
            cellData.keys.set(cellData.length, key);
            cellData.length++;
        });

        return cellData;
    }
}