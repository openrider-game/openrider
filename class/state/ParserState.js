import GameState from "./GameState.js";
import TrackParser from "../parser/TrackParser.js";

export default class ParserState extends GameState {
    onEnter() {
        this.getTrackParser();
    }

    async getTrackParser() {
        let rawTrack = await this.track.fetchRawTrack();
        this.parser = new TrackParser(rawTrack, this.track);
        this.parser.currentStep();
    }

    fixedUpdate() {}

    update(progress, delta) {
        this.parser.currentStep();

        this.parser.progress =
            this.parser.solidLineData.index +
            this.parser.sceneryLineData.index +
            this.parser.itemData.index +
            this.parser.foregroundSolidLineData.index +
            this.parser.foregroundSceneryLineData.index;
        if (this.parser.done) {
            this.manager.push('track');
        }
    }

    render(ctx) {
        let barY = this.track.canvas.height / 2 - 15;
        let barW = this.track.canvas.width - 200;

        ctx.clearRect(0, 0, this.track.canvas.width, this.track.canvas.height);

        ctx.fillStyle = '#ccc';
        ctx.fillRect(100, barY, barW, 30);

        ctx.fillStyle = '#aaa';
        ctx.fillRect(100, barY, this.parser.progress / this.parser.length * barW, 30);
        ctx.strokeRect(99, barY - 1, barW - 1, 32);

        let progressText = `Parsing ${this.parser.progressLabel}: ${Math.round(this.parser.progress / this.parser.length * 100)} %`;
        let progressTextMetrics = ctx.measureText(progressText);
        let progressTextWidth = progressTextMetrics.width;
        let progressTextHeight = progressTextMetrics.actualBoundingBoxAscent + progressTextMetrics.actualBoundingBoxDescent;
        ctx.fillStyle = '#000';
        ctx.fillText(progressText, (this.track.canvas.width - progressTextWidth) / 2, (this.track.canvas.height + progressTextHeight) / 2);
    }
}