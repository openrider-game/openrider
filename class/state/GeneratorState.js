import TrackGenerator from "../parser/TrackGenerator.js";
import GameState from "./GameState.js";
import CameraTool from "../tool/CameraTool.js";
import UI from "../ui/UI.js";

export default class GeneratorState extends GameState {
    onEnter() {
        UI.hideToolbars();
        this.track.canvas.style.cursor = 'none';
        this.track.event.detachAllEvt();
        this.generator = new TrackGenerator(this.track);
    }

    onLeave() {
        this.generator.memReset();
    }

    fixedUpdate() { }

    update(progress, delta) {
        this.generator.currentStep();

        this.generator.progress =
            this.generator.lineData.index +
            this.generator.foregroundLineData.index +
            this.generator.sceneryData.index +
            this.generator.foregroundSceneryData.index +
            this.generator.objectData.index;

        if (this.generator.done) {
            let trackCode = this.generator.getCode();

            if (this.isTrackUpload) {
                this.isTrackUpload = false;
                this.track.trackCode = trackCode;
                this.track.pause(true);
                this.track.toolManager.setTool(this.track.toolCollection.getByToolName(CameraTool.toolName));
                this.manager.getState('track').isTrackUpload = true;
                // Here we purposefully keep the toolbars hidden and keyboard events off to force the camera to be the only option
                this.track.event.attachMiscEvt();
            } else {
                let downloadLink = document.createElement("a");
                downloadLink.download = "track.txt";
                let data = new Blob([trackCode], { type: "text/plain" });
                let url = URL.createObjectURL(data);
                downloadLink.href = url;
                downloadLink.click();
                URL.revokeObjectURL(url);

                UI.showToolbars();
                this.track.event.attachAllEvt();
            }

            this.manager.pop();
        }
    }

    render(ctx) {
        let barY = this.track.canvas.height / 2 - 15;
        let barW = this.track.canvas.width - 200;

        ctx.clearRect(0, 0, this.track.canvas.width, this.track.canvas.height);

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
        ctx.fillText(progressText, (this.track.canvas.width - progressTextWidth) / 2, (this.track.canvas.height + progressTextHeight) / 2);
    }
}