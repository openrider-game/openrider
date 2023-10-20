import GameState from "./GameState.js";
import TrackParser from "../parser/TrackParser.js";
import { TRACK_DEFAULT } from "../constant/TrackConstants.js";
import Requests from "../event/Requests.js";
import { TRACKDATA_URL } from "../constant/RequestConstants.js";

export default class ParserState extends GameState {
    onEnter() {
        let rawTrack = TRACK_DEFAULT;

        if (!!this.track.id) {
            let request = Requests.getPostRequest(TRACKDATA_URL, {
                id: this.track.id
            });

            let response = JSON.parse(request.responseText);

            if (response === false) {
                alert('Track does not exist');
                return false;
            }

            rawTrack = response.CODE;
        } else if (!!this.track.trackCode) {
            rawTrack = this.track.trackCode;
            this.track.id = null;
        }

        this.track.trackCode = null;

        this.parser = new TrackParser(this.track);
        this.parser.init(rawTrack);
    }

    fixedUpdate() {}

    update(progress, delta) {
        if (!this.parser) return;

        this.parser.currentStep();

        if (this.parser.caching) {
            this.parser.progress = this.parser.proxyIndex;
            this.parser.length = this.parser.renderIndex;
        } else {
            this.parser.progress =
                this.parser.solidLineData.index +
                this.parser.sceneryLineData.index +
                this.parser.itemData.index +
                this.parser.foregroundSolidLineData.index +
                this.parser.foregroundSceneryLineData.index;
        }
        if (this.parser.done) {
            this.manager.push('track');
        }
    }

    render(ctx) {
        if (!this.parser) {
            ctx.clearRect(0, 0, this.track.canvas.width, this.track.canvas.height);

            let unknownTrack = 'Track does not exist!';
            let unknownTrackMetrics = ctx.measureText(unknownTrack);
            let unknownTrackWidth = unknownTrackMetrics.width;
            let unknownTrackHeight = unknownTrackMetrics.actualBoundingBoxAscent + unknownTrackMetrics.actualBoundingBoxDescent;
            ctx.fillStyle = '#000';
            ctx.fillText(unknownTrack, (this.track.canvas.width - unknownTrackWidth) / 2, (this.track.canvas.height + unknownTrackHeight) / 2);

            return;
        }

        let barY = this.track.canvas.height / 2 - 15;
        let barW = this.track.canvas.width - 200;

        ctx.clearRect(0, 0, this.track.canvas.width, this.track.canvas.height);

        ctx.fillStyle = '#ccc';
        ctx.fillRect(100, barY, barW, 30);

        let progressText = 'Parsing...';
        if (this.parser.caching) {
            progressText = `Caching: ${this.parser.progressLabel} - ${this.parser.progress} / ${this.parser.length} cells`;
        } else {
            progressText = `Parsing ${this.parser.progressLabel}: ${Math.round(this.parser.progress / this.parser.length * 100)} %`;
        }

        ctx.fillStyle = '#aaa';
        ctx.fillRect(100, barY, this.parser.progress / this.parser.length * barW, 30);
        ctx.strokeRect(99, barY - 1, barW - 1, 32);

        let progressTextMetrics = ctx.measureText(progressText);
        let progressTextWidth = progressTextMetrics.width;
        let progressTextHeight = progressTextMetrics.actualBoundingBoxAscent + progressTextMetrics.actualBoundingBoxDescent;
        ctx.fillStyle = '#000';
        ctx.fillText(progressText, (this.track.canvas.width - progressTextWidth) / 2, (this.track.canvas.height + progressTextHeight) / 2);
    }
}