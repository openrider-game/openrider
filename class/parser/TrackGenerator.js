import Track from "../track/Track.js";

export default class TrackGenerator {
    constructor(track) {
        /** @type {Track} */
        this.track = track;

        this.stepSize = 1000;

        this.memReset();

        let grid = this.track.grid;
        let foregroundGrid = this.track.foregroundGrid;
        this.length =
            grid.totalSolidLines.size +
            grid.totalSceneryLines.size +
            grid.totalObjects.size +
            foregroundGrid.totalSolidLines.size +
            foregroundGrid.totalSceneryLines.size;
    }

    memReset() {
        this.done = false;
        this.currentStep = this.generateLines;
        this.progress = 0;
        this.lineData = this.emptyData();
        this.foregroundLineData = this.emptyData();
        this.sceneryData = this.emptyData();
        this.foregroundSceneryData = this.emptyData();
        this.objectData = this.emptyData();
    }

    /**
     *
     * @param {{}} lineData
     * @param {Map} gridTarget
     * @param {Function} nextStep
     */
    generate(lineData, gridTarget, nextStep) {
        let toGo = this.stepSize;
        let l = Math.min(lineData.index + toGo, gridTarget.size);
        let gridElements = Array.from(gridTarget.values());
        for (; lineData.index < l; lineData.index++) {
            let line = gridElements[lineData.index];
            if (!line.recorded) {
                lineData.code += `${line.toString()},`;
            }
        }

        if (lineData.index >= gridTarget.size) {
            this.currentStep = nextStep;
        }
    }

    generateLines() {
        this.generate(this.lineData, this.track.grid.totalSolidLines, this.generateScenery);
    }

    generateScenery() {
        this.generate(this.sceneryData, this.track.grid.totalSceneryLines, this.generateObjects);
    }

    generateObjects() {
        let toGo = this.stepSize;
        let l = Math.min(this.objectData.index + toGo, this.track.grid.totalObjects.size);
        let gridObjects = Array.from(this.track.grid.totalObjects.values());
        for (; this.objectData.index < l; this.objectData.index++) {
            let object = gridObjects[this.objectData.index];
            if (!object.recorded) {
                this.objectData.code += `${object.toString()},`;
            }
        }

        if (this.objectData.index >= this.track.grid.totalObjects.size) {
            this.currentStep = this.generateForegroundLines;
        }
    }

    generateForegroundLines() {
        this.generate(this.foregroundLineData, this.track.foregroundGrid.totalSolidLines, this.generateForegroundScenery);
    }

    generateForegroundScenery() {
        this.generate(this.foregroundSceneryData, this.track.foregroundGrid.totalSceneryLines, this.finish);
    }

    finish() {
        this.cleanup();
        this.done = true;
    }

    cleanup() {
        this.track.grid.totalSolidLines.forEach((line, key) => line.recorded = false);
        this.track.grid.totalSceneryLines.forEach((line, key) => line.recorded = false);
        this.track.foregroundGrid.totalSolidLines.forEach((line, key) => line.recorded = false);
        this.track.foregroundGrid.totalSceneryLines.forEach((line, key) => line.recorded = false);
    }

    getCode() {
        return `${this.lineData.code}#${this.sceneryData.code}#${this.objectData.code}#` +
            `${this.foregroundLineData.code}#${this.foregroundSceneryData.code}#` +
            `${this.track.playerRunner.bikeClass.bikeName}#${this.track.origin.toString()}`;
    }

    emptyData() {
        return { code: '', index: 0 };
    }
}