import TrackGenerator from "../parser/TrackGenerator.js";
import GameState from "./GameState.js";

export default class GeneratorState extends GameState {
    onEnter() {
        this.generator = new TrackGenerator(this.track);
    }

    fixedUpdate() {}

    update(progress, delta) {
        let canProgress = this.generator.progress <= this.generator.cellCount;
        let canProgressForeground = this.generator.foregroundProgress <= this.generator.foregroundCellCount;
        
        if (canProgress) {
            this.generator.generateNextCell();
        }

        if(canProgressForeground) {
            this.generator.generateNextForegroundCell();
        }

        if(!canProgress && !canProgressForeground) {
            this.generator.cleanup();
            // use getCode to put it in the text box
            // change state
        }
    }

    render(ctx) {
        let barY = this.track.canvas.height / 2 - 15;
        let barW = this.track.canvas.width - 200;

        let progress = this.generator.progress + this.generator.foregroundProgress;
        let total = this.generator.cellCount + this.generator.foregroundCellCount;

        ctx.clearRect(0, 0, this.track.canvas.width, this.track.canvas.height);

        ctx.fillStyle = '#ccc';
        ctx.fillRect(100, barY, barW, 30);

        ctx.fillStyle = '#aaa';
        ctx.fillRect(100, barY, progress / total * barW, 30);
        ctx.strokeRect(99, barY - 1, barW - 1, 32);

        let progressText = `Generating track code: ${Math.round(progress / total * 100)} %`;
        let progressTextMetrics = ctx.measureText(progressText);
        let progressTextWidth = progressTextMetrics.width;
        let progressTextHeight = progressTextMetrics.actualBoundingBoxAscent + progressTextMetrics.actualBoundingBoxDescent;
        ctx.fillStyle = '#000';
        ctx.fillText(progressText, (this.track.canvas.width - progressTextWidth) / 2, (this.track.canvas.height + progressTextHeight) / 2);
    }
}