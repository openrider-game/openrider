import GameState from "./GameState.js";
import RenderCell from "../grid/cell/RenderCell.js";
import Vector from "../numeric/Vector.js";
import Grid from "../grid/Grid.js";
import UIToolbar from "../ui/UIToolbar.js";
import CameraTool from "../tool/CameraTool.js";
import UIButton from "../ui/UIButton.js";
import UIElement from "../ui/base/UIElement.js";
import FullscreenTool from "../tool/FullscreenTool.js";
import Requests from "../event/Requests.js";
import { TRACKUPLOAD_URL } from "../constant/RequestConstants.js";

export default class TrackUploadState extends GameState {
    onEnter() {
        let toolbar = new UIToolbar(this.ui, this.track, [CameraTool, FullscreenTool]);
        this.track.toolManager.setTool(this.track.toolCollection.getByToolName(CameraTool.toolName));
        this.track.toolManager.setCamera(this.track.toolCollection.getByToolName(CameraTool.toolName));
        this.ui.uiElements.push(toolbar);

        let cancelButton = new UIButton(this.ui, this.track, 10, 10, 100, 26, 'Cancel', () => this.handleCancel(), UIElement.ALIGN_BOTTOM);
        let uploadWithThumbnailButton = new UIButton(this.ui, this.track, 0, 10, 200, 26, 'Upload with thumbnail', () => this.handleUploadWithThumbnail(), UIElement.ALIGN_BOTTOM | UIElement.ALIGN_HORIZONTAL_CENTER);

        this.ui.uiElements.push(cancelButton, uploadWithThumbnailButton);
    }

    handleCancel() {
        this.manager.pop();
    }

    handleUploadWithThumbnail() {
        let thumb = document.createElement('canvas');

        // get proper upsized thumbnail
        thumb.width = 500;
        thumb.height = 300;
        this.track.zoomFactor *= 2;
        this.screenshotting = true;
        this.render(this.track.canvas.getContext('2d'));
        thumb.getContext('2d').drawImage(
            this.track.canvas,
            (this.track.canvas.width - 500) / 2, (this.track.canvas.height - 300) / 2,
            500, 300,
            0, 0,
            500, 300
        );
        this.track.zoomFactor /= 2;
        this.screenshotting = false;

        let image = thumb.toDataURL('image/png');

        let request = Requests.getPostRequest(TRACKUPLOAD_URL, {
            trackCode: this.track.trackCode,
            thumbnail: image.replace('data:image/png;base64,', '')
        });
        let response;
        try {
            response = JSON.parse(request.responseText);

            location.href = `./tracks/${response.ID}/`;
        } catch (e) {
            alert(`Your track was refused: ${response}`);
            return false;
        }
    }

    fixedUpdate() {
        this.track.toolManager.fixedUpdate();
    }

    update(progress, delta) {
        this.track.toolManager.update(progress, delta);
    }

    /**
     *
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
        ctx.clearRect(0, 0, this.track.canvas.width, this.track.canvas.height);

        let topLeft = new Vector(0, 0).normalizeToCanvas(this.track);
        let bottomRight = new Vector(this.track.canvas.width, this.track.canvas.height).normalizeToCanvas(this.track);

        let gridTopLeft = Grid.gridCoords(topLeft, this.track.cache.cellSize);
        let gridBottomRight = Grid.gridCoords(bottomRight, this.track.cache.cellSize);

        for (let x = gridTopLeft.x; x <= gridBottomRight.x; x++) {
            for (let y = gridTopLeft.y; y <= gridBottomRight.y; y++) {
                this.renderCache(ctx, this.track.cache, x, y, 1);
            }
        }

        this.track.ghostRunners.forEach((runner) => {
            runner.render(ctx);
        });
        this.track.playerRunner.render(ctx);

        for (let x = gridTopLeft.x; x <= gridBottomRight.x; x++) {
            for (let y = gridTopLeft.y; y <= gridBottomRight.y; y++) {
                this.renderCache(ctx, this.track.foregroundCache, x, y, 0.5);
            }
        }

        this.track.toolManager.render(ctx);

        if (!this.screenshotting) {
            let x0 = (this.track.canvas.width - 250) / 2;
            let x1 = x0 + 250;
            let y0 = (this.track.canvas.height - 150) / 2;
            let y1 = y0 + 150;

            ctx.save();

            ctx.lineWidth = 1;
            ctx.strokeStyle = '#fff';
            ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            ctx.fillRect(0, 0, this.track.canvas.width, y0);
            ctx.fillRect(0, y1, this.track.canvas.width, y0);
            ctx.fillRect(0, y0, x0, 150);
            ctx.fillRect(x1, y0, x0, 150);
            ctx.strokeRect(x0, y0, 250, 150);

            ctx.restore();
        }

        let helperText = 'Use your mouse to drag & fit an interesting part of your track in the thumbnail';
        let helperTextWidth = ctx.measureText(helperText).width;
        ctx.fillStyle = '#fff';
        ctx.fillRect((this.track.canvas.width - helperTextWidth) / 2 - 4, 6, helperTextWidth + 8, 18);
        ctx.fillStyle = '#000';
        ctx.fillText(helperText, (this.track.canvas.width - helperTextWidth) / 2, 20);
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
        if (tool instanceof CameraTool || tool instanceof FullscreenTool) {
            tool.run();
        }
    }

    onVisibilityChange() {
        if (document.hidden) {
            this.track.pause(true);
        }
    }
}