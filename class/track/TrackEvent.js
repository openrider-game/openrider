import Track from "./Track.js";
import Vector from "../numeric/Vector.js";
import Keyboard from "../keyboard/Keyboard.js";
import PauseTool from "../tool/PauseTool.js";

export default class TrackEvent {
    /**
     *
     * @param {Track} track
     */
    constructor(track) {
        this.track = track;
        this.keyboard = new Keyboard();

        this.controller = new AbortController();

        this.mouseIn = false;

        this.attach();
    }

    attach() {
        this.track.canvas.addEventListener('mousedown', e => this.onMouseDown(e), { signal: this.controller.signal });
        this.track.canvas.addEventListener('mouseup', e => this.onMouseUp(e), { signal: this.controller.signal });
        this.track.canvas.addEventListener('mousemove', e => this.onMouseMove(e), { signal: this.controller.signal });
        this.track.canvas.addEventListener('mousewheel', e => this.onScroll(e), { signal: this.controller.signal });

        this.track.canvas.addEventListener('mouseenter', e => this.onMouseEnter(e), { signal: this.controller.signal });
        this.track.canvas.addEventListener('mouseout', e => this.onMouseOut(e), { signal: this.controller.signal });

        this.track.canvas.addEventListener('contextmenu', e => this.onContextMenu(e), { signal: this.controller.signal });

        document.addEventListener('keydown', e => this.onKeyDown(e), { signal: this.controller.signal });
        document.addEventListener('keyup', e => this.onKeyUp(e), { signal: this.controller.signal });

        document.addEventListener('keyboarddown', e => this.onKeyboardDown(e), { signal: this.controller.signal });

        document.addEventListener('visibilitychange', () => this.onVisibilityChange(), { signal: this.controller.signal });
    }

    detach() {
        this.controller.abort();
        this.controller = new AbortController();
    }

    onMouseDown(e) {
        e.preventDefault();
        if (e.button !== 2) {
            this.track.focalPoint = null;
            this.track.lastClick.set(this.track.mousePos);
            this.track.toolManager.onMouseDown(e);
        }
    }

    onMouseUp(e) {
        this.track.toolManager.onMouseUp(e);
    }

    onMouseMove(e) {
        let canvasRect = this.track.canvas.getBoundingClientRect();
        this.track.mousePos.set(new Vector(
            e.clientX - canvasRect.left + window.pageXOffset,
            e.clientY - canvasRect.top + window.pageYOffset
        ).normalizeToCanvas(this.track));

        this.track.mousePos.x = Math.round(this.track.mousePos.x / this.track.gridDetail) * this.track.gridDetail;
        this.track.mousePos.y = Math.round(this.track.mousePos.y / this.track.gridDetail) * this.track.gridDetail;

        this.track.toolManager.onMouseMove(e);
    }

    onScroll(e) {
        e.preventDefault();
        this.track.toolManager.onScroll(e);
    }

    onContextMenu(e) {
        e.preventDefault();
        this.track.toolManager.onContextMenu(e);
    }

    onMouseEnter(e) {
        this.mouseIn = true;
    }

    onMouseOut(e) {
        this.mouseIn = false;
    }

    onKeyDown(e) {
        this.keyboard.onKeyDown(e);
    }

    onKeyUp(e) {
        this.keyboard.onKeyUp(e);
    }

    onKeyboardDown(e) {
        let tool = this.track.toolCollection.getByKeyLabel(e.detail);
        if(tool) {
            tool.run();
        }
    }

    onVisibilityChange() {
        if (document.hidden) {
            this.track.pause(true);
        }
    }
}