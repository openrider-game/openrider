import TrackGenerator from "../parser/TrackGenerator.js";
import GameState from "./GameState.js";

export default class GeneratorState extends GameState {
    onEnter() {
        this.generator = new TrackGenerator(this.track);
    }

    fixedUpdate() {}

    update(progress, delta) {
        this.generator.currentStep();

        this.generator.progress =
            this.generator.lineData.index +
            this.generator.foregroundLineData.index +
            this.generator.sceneryData.index +
            this.generator.foregroundSceneryData.index +
            this.generator.objectData.index;

        if (this.generator.done) {
            this.manager.pop();

            let trackCode = this.generator.getCode();
            this.generator.memReset();

            if (this.isTrackUpload) {
                this.isTrackUpload = false;
                this.track.trackCode = trackCode;
                this.track.pause(true);
                this.manager.push('trackUpload');
            } else {
                let downloadLink = document.createElement('a');
                downloadLink.download = 'track.txt';
                let data = new Blob([trackCode], { type: 'text/plain' });
                let url = URL.createObjectURL(data);
                downloadLink.href = url;
                downloadLink.click();
                URL.revokeObjectURL(url);
            }
        }
    }

    render(ctx) {
        let barY = this.track.viewport.height / 2 - 15;
        let barW = this.track.viewport.width - 200;

        ctx.clearRect(0, 0, this.track.viewport.width, this.track.viewport.height);

        ctx.fillStyle = '#ccc';
        ctx.fillRect(100, barY, barW, 30);

        ctx.fillStyle = '#aaa';
        ctx.fillRect(100, barY, this.generator.progress / this.generator.length * barW, 30);
        ctx.strokeRect(99, barY - 1, barW - 1, 32);

        let progressText = `Generating track code: ${Math.round(this.generator.progress / this.generator.length * 100)} %`;
        let progressTextMetrics = ctx.measureText(progressText);
        let progressTextWidth = progressTextMetrics.width;
        let progressTextHeight = progressTextMetrics.actualBoundingBoxAscent + progressTextMetrics.actualBoundingBoxDescent;
        ctx.fillStyle = '#000';
        ctx.fillText(progressText, (this.track.viewport.width - progressTextWidth) / 2, (this.track.viewport.height + progressTextHeight) / 2);
    }
}
