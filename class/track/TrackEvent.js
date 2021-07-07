import Track from "./Track.js";
import Vector from "../numeric/Vector.js";
import Keyboard from "../keyboard/Keyboard.js";

export default class TrackEvent {
    /**
     *
     * @param {Track} track
     */
    constructor(track) {
        this.track = track;
        this.keyboard = new Keyboard();

        this.evtController = new AbortController();
        this.keyboardEvtController = new AbortController();

        this.evtAttached = false;
        this.keyboardEvtAttached = false;

        this.mouseIn = false;

        this.attachAllEvt();
    }

    attachAllEvt() {
        this.attachMiscEvt();
        this.attachKeyboardEvt();
    }

    detachAllEvt() {
        this.detachEvt();
        this.detachKeyboardEvt();
    }

    attachMiscEvt() {
        if (!this.evtAttached) {
            this.evtAttached = true;
            this.track.canvas.addEventListener('mousedown', e => this.onMouseDown(e), { signal: this.evtController.signal });
            this.track.canvas.addEventListener('mouseup', e => this.onMouseUp(e), { signal: this.evtController.signal });
            this.track.canvas.addEventListener('mousemove', e => this.onMouseMove(e), { signal: this.evtController.signal });
            this.track.canvas.addEventListener('mousewheel', e => this.onScroll(e), { signal: this.evtController.signal });

            this.track.canvas.addEventListener('mouseenter', e => this.onMouseEnter(e), { signal: this.evtController.signal });
            this.track.canvas.addEventListener('mouseout', e => this.onMouseOut(e), { signal: this.evtController.signal });

            this.track.canvas.addEventListener('contextmenu', e => this.onContextMenu(e), { signal: this.evtController.signal });

            document.addEventListener('visibilitychange', () => this.onVisibilityChange(), { signal: this.evtController.signal });
        }
    }

    attachKeyboardEvt() {
        if (!this.keyboardEvtAttached) {
            this.keyboardEvtAttached = true;
            document.addEventListener('keydown', e => this.onKeyDown(e), { signal: this.keyboardEvtController.signal });
            document.addEventListener('keyup', e => this.onKeyUp(e), { signal: this.keyboardEvtController.signal });

            document.addEventListener('keyboarddown', e => this.onKeyboardDown(e), { signal: this.keyboardEvtController.signal });
        }
    }

    detachEvt() {
        if (this.evtAttached) {
            this.evtAttached = false;
            this.evtController.abort();
            this.evtController = new AbortController();
        }
    }

    detachKeyboardEvt() {
        if (this.keyboardEvtAttached) {
            this.keyboardEvtAttached = false;
            this.keyboardEvtController.abort();
            this.keyboardEvtController = new AbortController();
        }
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
        if (tool) {
            tool.run();
        }
    }

    onVisibilityChange() {
        if (document.hidden) {
            this.track.pause(true);
        }
    }
}