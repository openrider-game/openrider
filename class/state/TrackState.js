import GameState from "./GameState.js";
import RenderCell from "../grid/cell/RenderCell.js";
import Vector from "../numeric/Vector.js";
import Grid from "../grid/Grid.js";
import Time from "../numeric/Time.js";

export default class TrackState extends GameState {
    fixedUpdate() {
        this.track.toolManager.fixedUpdate();
        if (!this.track.paused) {
            // Run playerRunner before the ghosts so that when it saves a checkpoint
            // the physics from the ghosts don't get updated because if they do they run
            // twice on the same time increment, and they break!
            this.track.playerRunner.fixedUpdate();
            this.track.ghostRunners.forEach((runner) => {
                if (!runner.done) {
                    runner.fixedUpdate();
                }
            });

            this.track.time++;
        }
    }

    update(progress, delta) {
        this.track.toolManager.update(progress, delta);
        if (!this.track.paused) {
            this.track.ghostRunners.forEach((runner) => {
                if (!runner.done) {
                    runner.update(progress, delta);
                }
            });
            this.track.playerRunner.update(progress, delta);
        }
        if (this.track.focalPoint) {
            this.track.camera.selfAdd(this.track.focalPoint.displayPos.sub(this.track.camera).scale(delta / 200));
        }
    }

    /**
     *
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
        ctx.clearRect(0, 0, this.track.canvas.width, this.track.canvas.height);

        let topLeft = new Vector(0, 0).normalizeToCanvas(this.track);
        let bottomRight = new Vector(this.track.canvas.width, this.track.canvas.height).normalizeToCanvas(this.track);

        let gridTopLeft = Grid.gridCoords(bottomRight, this.track.cache.cellSize);
        let gridBottomRight = Grid.gridCoords(topLeft, this.track.cache.cellSize);

        for (let x = gridBottomRight.x; x <= gridTopLeft.x; x++) {
            for (let y = gridBottomRight.y; y <= gridTopLeft.y; y++) {
                this.renderCache(ctx, this.track.cache, x, y, 1);
            }
        }

        this.track.ghostRunners.forEach((runner) => {
            runner.render(ctx);
        });
        this.track.playerRunner.render(ctx);

        for (let x = gridBottomRight.x; x <= gridTopLeft.x; x++) {
            for (let y = gridBottomRight.y; y <= gridTopLeft.y; y++) {
                this.renderCache(ctx, this.track.foregroundCache, x, y, 0.5);
            }
        }

        this.track.toolManager.render(ctx);

        ctx.lineWidth = 0.5;
        ctx.fillStyle = '#000';
        ctx.fillText(Time.format(this.track.time * this.manager.game.frameDuration), 30, 15);
        ctx.fillText(`${this.track.playerRunner.targetsReached.size}/${this.track.targets.size}`, 30, 30);

        this.track.ghostRunners.forEach((runner, index) => {
            let ghostTime = Math.max(0, runner.finalTime - this.track.time);
            let remainingTimeText = ghostTime > 0 ? Time.format(ghostTime * this.manager.game.frameDuration) : 'finished!';
            let text = `${runner.ghostName}: ${remainingTimeText} - ${runner.targetsReached.size}/${this.track.targets.size}`;
            let textMetrics = ctx.measureText(text);

            ctx.fillStyle = runner.instance.color;
            ctx.fillText(text, this.track.canvas.width - 30 - textMetrics.width, 15 * (1 + index));
        });
    }

    /**
     * Draws images 1px top left to avoid thin lines
     * @see RenderCell
     *
     * @param {CanvasRenderingContext2D} ctx
     * @param {Grid} cache
     * @param {number} x
     * @param {number} y
     * @param {number} opacityFactor
     */
    renderCache(ctx, cache, x, y, opacityFactor) {
        if (cache.has(x, y)) {
            /** @type {RenderCell} */
            let cell = cache.cell(x, y);
            ctx.drawImage(
                cell.getCanvas(this.track.zoomFactor, opacityFactor),
                Math.floor(this.track.canvas.width / 2 - this.track.camera.x * this.track.zoomFactor + cell.x * this.track.zoomFactor) - 1,
                Math.floor(this.track.canvas.height / 2 - this.track.camera.y * this.track.zoomFactor + cell.y * this.track.zoomFactor) - 1
            );

            ctx.strokeStyle = '#000';
            for (let object of cell.objects) {
                object.render(ctx);
            }
        }
    }
}