import GameObject from "../../game/GameObject.js";
import Track from "../../track/Track.js";
import Tool from "../Tool.js";

export default class ToolManager extends GameObject {
    constructor(track) {
        super();
        /** @type {Track} */
        this.track = track;
        this.tool = null;
        this.active = false;
        this.cameraTool = null;
    }

    /**
     *
     * @param {Tool} tool
     */
    setTool(tool) {
        if (tool !== this.tool) {
            if (this.tool) {
                this.tool.ui.toggleActive();
                this.tool.deactivate();
            }

            this.tool = tool;
            this.tool.activate();
            this.tool.ui.toggleActive();
        } else {
            if (this.tool.optionsOpen) {
                this.tool.closeOptions();
            } else {
                this.tool.openOptions();
            }
        }
    };

    setCamera(cameraTool) {
        this.cameraTool = cameraTool;
    }

    fixedUpdate() {
        if (this.tool && this.active) {
            this.tool.fixedUpdate();
        }
    }

    update(progress, delta) {
        if (this.tool && this.active) {
            this.tool.update(progress, delta);
        }
    }

    render(ctx) {
        if (this.tool && (this.allowRender() || this.tool.alwaysRender)) {
            this.tool.render(ctx);
        }
    }

    onMouseDown(e) {
        if (this.tool && e.button != 2) {
            this.active = true;
            this.tool.onMouseDown(e);
        }

        if (this.tool !== this.cameraTool && this.cameraTool && e.button == 2) {
            this.cameraTool.onMouseDown(e);
        }
    }

    onMouseUp(e) {
        if (this.tool) {
            this.active = true;
            this.tool.onMouseUp(e);
        }

        if (this.tool !== this.cameraTool && this.cameraTool) {
            this.cameraTool.onMouseUp(e);
        }
    }

    onMouseMove(e) {
        if (this.tool) {
            this.active = true;
            this.tool.onMouseMove(e);
        }

        if (this.tool !== this.cameraTool && this.cameraTool) {
            this.cameraTool.onMouseMove(e);
        }
    }

    onScroll(e) {
        if (this.tool) {
            this.active = true;
            this.tool.onScroll(e);
        }
    }

    onContextMenu(e) {
        if (this.tool) {
            this.active = true;
        }
    }

    allowRender() {
        return this.track.event.mouseIn && this.track.event.allowStateEvent() && this.active;
    }
}