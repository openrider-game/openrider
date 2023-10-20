import GameState from "./GameState.js";
import RenderCell from "../grid/cell/RenderCell.js";
import Vector from "../numeric/Vector.js";
import Grid from "../grid/Grid.js";
import Time from "../numeric/Time.js";
import UIToolbar from "../ui/UIToolbar.js";
import { LEFT_TOOLBAR_VIEWING, LEFT_TOOLBAR_EDITING, RIGHT_TOOLBAR } from "../constant/ToolbarConstants.js";
import CameraTool from "../tool/CameraTool.js";
import UIButton from "../ui/UIButton.js";
import UIElement from "../ui/base/UIElement.js";
import Track from "../track/Track.js";
import GhostParser from "../parser/GhostParser.js";
import Requests from "../event/Requests.js";
import GhostRunner from "../bike/GhostRunner.js";
import { GHOSTDATA_URL, GHOSTUPLOAD_URL } from "../constant/RequestConstants.js";

export default class TrackState extends GameState {
    onEnter() {
        let leftToolbar = new UIToolbar(this.ui, this.track, this.track.isRace() ? LEFT_TOOLBAR_VIEWING : LEFT_TOOLBAR_EDITING);

        this.track.toolManager.setTool(this.track.toolCollection.getByToolName(CameraTool.toolName));
        this.track.toolManager.setCamera(this.track.toolCollection.getByToolName(CameraTool.toolName));

        this.ui.uiElements.push(leftToolbar);

        if (!this.track.isRace()) {
            let rightToolbar = new UIToolbar(this.ui, this.track, RIGHT_TOOLBAR, UIElement.ALIGN_RIGHT);

            let importButton = new UIButton(this.ui, this.track, 10, 10, 100, 26, 'Import track', () => this.handleImport(), UIElement.ALIGN_BOTTOM);
            let exportButton = new UIButton(this.ui, this.track, 120, 10, 100, 26, 'Export track', () => this.handleExport(), UIElement.ALIGN_BOTTOM);
            let uploadButton = new UIButton(this.ui, this.track, 230, 10, 100, 26, 'Upload track', () => this.handleUpload(), UIElement.ALIGN_BOTTOM);

            this.ui.uiElements.push(rightToolbar, importButton, exportButton, uploadButton);
        }
    }

    handleImport() {
        let input = document.createElement('input');
        input.type = 'file';
        input.addEventListener('change', () => {
            let file = input.files[0];

            if (file) {
                let reader = new FileReader();
                reader.onload = () => {
                    this.track = new Track(this.track.canvas, { trackCode: reader.result }, this.manager.event);
                    this.manager.getState('parser').onEnter();
                    this.manager.pop();
                };

                reader.readAsText(file);
            }
        });

        input.click();
    }

    handleExport() {
        this.manager.push('generator');
    }

    handleUpload() {
        this.manager.getState('generator').isTrackUpload = true;
        this.manager.push('generator');
    }

    toggleGhost(ghostId) {
        if (this.track.ghostRunners.has(ghostId)) {
            this.track.ghostRunners.delete(ghostId);
            this.track.updateFocalPoint();
        } else {
            let ghostString = ',,,,,,BMX,Ghost';
            if (this.track.ghostCache.has(ghostId)) {
                ghostString = this.track.ghostCache.get(ghostId);
            } else {
                let request = Requests.getPostRequest(GHOSTDATA_URL, {
                    trackId: this.track.id,
                    id: ghostId
                });

                let response = JSON.parse(request.responseText);
                ghostString = response.GHOSTSTRING;

                this.track.ghostCache.set(ghostId, ghostString);
            }

            let ghost = new GhostRunner(this.track, ghostString);
            this.track.ghostRunners.set(ghostId, ghost);
            ghost.createBike();

            this.track.ghostRunners = new Map([
                ...this.track.ghostRunners.entries()
            ].sort((a, b) => a[1].finalTime - b[1].finalTime));

            this.track.playerRunner.reset();
            this.track.ghostRunners.forEach(runner => {
                runner.reset();
            });

            this.track.restart();
        }
    }

    saveGhost() {
        if (confirm('Do you want to save this time?')) {
            let ghostString = GhostParser.generate(this.track.playerRunner);

            let request = Requests.getPostRequest(GHOSTUPLOAD_URL, {
                ghostString: ghostString,
                trackId: this.track.id,
                time: this.track.time
            });
            let response;
            try {
                response = JSON.parse(request.responseText);

                console.log(response.ID);
            } catch (e) {
                alert(`Your ghost was refused: ${response}`);
            }
        }
    }

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
        if (this.track.playerRunner.done) {
            this.track.playerRunner.done = false;
            this.saveGhost();
        }

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

        let cacheGridTopLeft = Grid.gridCoords(topLeft, this.track.cache.cellSize);
        let cacheGridBottomRight = Grid.gridCoords(bottomRight, this.track.cache.cellSize);
        let physicsGridTopLeft = Grid.gridCoords(topLeft, this.track.grid.cellSize);
        let physicsGridBottomRight = Grid.gridCoords(bottomRight, this.track.grid.cellSize);

        for (let x = cacheGridTopLeft.x; x <= cacheGridBottomRight.x; x++) {
            for (let y = cacheGridTopLeft.y; y <= cacheGridBottomRight.y; y++) {
                this.renderCache(ctx, this.track.cache, x, y, 1);
            }
        }

        this.track.ghostRunners.forEach((runner) => {
            runner.render(ctx);
        });
        this.track.playerRunner.render(ctx);

        for (let x = cacheGridTopLeft.x; x <= cacheGridBottomRight.x; x++) {
            for (let y = cacheGridTopLeft.y; y <= cacheGridBottomRight.y; y++) {
                this.renderCache(ctx, this.track.foregroundCache, x, y, 0.5);
            }
        }

        this.track.toolManager.render(ctx);

        ctx.lineWidth = 0.5;
        ctx.fillStyle = '#000';
        ctx.fillText(Time.format(this.track.time * this.manager.game.frameDuration), 30, 15);
        ctx.fillText(`${this.track.playerRunner.targetsReached.size}/${this.track.targets.size}`, 30, 30);

        let index = 0;
        this.track.ghostRunners.forEach((runner) => {
            let ghostTime = Math.max(0, runner.finalTime - this.track.time);
            let remainingTimeText = ghostTime > 0 ? Time.format(ghostTime * this.manager.game.frameDuration) : 'finished!';
            let text = `${runner.ghostName}: ${remainingTimeText} - ${runner.targetsReached.size}/${this.track.targets.size}`;
            let textMetrics = ctx.measureText(text);

            ctx.fillStyle = runner.instance.color;
            ctx.fillText(text, this.track.canvas.width - 30 - textMetrics.width, 15 * (1 + index++));
        });

        if (this.track.debug) {
            this.renderDebug(ctx, cacheGridTopLeft, cacheGridBottomRight, physicsGridTopLeft, physicsGridBottomRight);
        }
    }

    renderDebug(ctx, cacheGridTopLeft, cacheGridBottomRight, physicsGridTopLeft, physicsGridBottomRight) {
        ctx.save();

        // cache grid
        ctx.beginPath();
        for (let y = cacheGridTopLeft.y; y <= cacheGridBottomRight.y; y++) {
            let gridLineY = Math.floor(this.track.canvas.height / 2 - this.track.camera.y * this.track.zoomFactor + y * this.track.cache.cellSize * this.track.zoomFactor);
            ctx.moveTo(0, gridLineY);
            ctx.lineTo(this.track.canvas.width, gridLineY);
        }

        for (let x = cacheGridTopLeft.x; x <= cacheGridBottomRight.x; x++) {
            let gridLineX = Math.floor(this.track.canvas.width / 2 - this.track.camera.x * this.track.zoomFactor + x * this.track.cache.cellSize * this.track.zoomFactor);
            ctx.moveTo(gridLineX, 0);
            ctx.lineTo(gridLineX, this.track.canvas.height);
        }

        ctx.strokeStyle = '#0000ff55';
        ctx.lineWidth = 2;
        ctx.stroke();

        // physics grid
        ctx.beginPath();
        for (let y = physicsGridTopLeft.y; y <= physicsGridBottomRight.y; y++) {
            let gridLineY = Math.floor(this.track.canvas.height / 2 - this.track.camera.y * this.track.zoomFactor + y * this.track.grid.cellSize * this.track.zoomFactor);
            ctx.moveTo(0, gridLineY);
            ctx.lineTo(this.track.canvas.width, gridLineY);
        }

        for (let x = physicsGridTopLeft.x; x <= physicsGridBottomRight.x; x++) {
            let gridLineX = Math.floor(this.track.canvas.width / 2 - this.track.camera.x * this.track.zoomFactor + x * this.track.grid.cellSize * this.track.zoomFactor);
            ctx.moveTo(gridLineX, 0);
            ctx.lineTo(gridLineX, this.track.canvas.height);
        }

        ctx.strokeStyle = '#0000ff22';
        ctx.lineWidth = 2;
        ctx.stroke();

        this.track.ghostRunners.forEach((runner) => {
            runner.renderDebug(ctx);
        });
        this.track.playerRunner.renderDebug(ctx);

        ctx.restore();
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
                cell.getCanvas(this.track.zoomFactor, opacityFactor, this.track.fastRender),
                Math.floor(this.track.canvas.width / 2 - this.track.camera.x * this.track.zoomFactor + cell.x * this.track.zoomFactor) - 1,
                Math.floor(this.track.canvas.height / 2 - this.track.camera.y * this.track.zoomFactor + cell.y * this.track.zoomFactor) - 1
            );

            ctx.strokeStyle = '#000';
            for (let object of cell.objects) {
                object.render(ctx);
                if (this.track.debug) {
                    object.renderDebug(ctx);
                }
            }
        }
    }

    onMouseDown(e) {
        this.track.toolManager.onMouseDown(e);
    }

    onMouseUp(e) {
        this.track.toolManager.onMouseUp(e);
    }

    onMouseMove(e) {
        this.track.toolManager.onMouseMove(e);
    }

    onScroll(e) {
        this.track.toolManager.onScroll(e);
    }

    onContextMenu(e) {
        this.track.toolManager.onContextMenu(e);
    }

    onKeyboardDown(e) {
        let tool = this.track.toolCollection.getByKeyLabel(e.detail);
        if (tool) {
            tool.run(true);
        }
    }

    onVisibilityChange() {
        if (document.hidden) {
            this.track.pause(true);
        }
    }
}