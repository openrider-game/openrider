import Vector from "../numeric/Vector.js";
import Keyboard from "../keyboard/Keyboard.js";
import StateManager from "../state/StateManager.js";

export default class EventManager {
    /**
     *
     * @param {StateManager} stateManager
     */
    constructor(stateManager) {
        this.stateManager = stateManager;
        this.keyboard = new Keyboard();

        this.evtController = new AbortController();
        this.keyboardEvtController = new AbortController();

        this.evtAttached = false;
        this.keyboardEvtAttached = false;

        this.mouseIn = false;
    }

    getTrack() {
        return this.stateManager.track;
    }

    getUI() {
        return this.stateManager.getCurrent().ui;
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
            this.getTrack().canvas.addEventListener('mousedown', e => this.onMouseDown(e), { signal: this.evtController.signal });
            this.getTrack().canvas.addEventListener('mouseup', e => this.onMouseUp(e), { signal: this.evtController.signal });
            this.getTrack().canvas.addEventListener('mousemove', e => this.onMouseMove(e), { signal: this.evtController.signal });
            this.getTrack().canvas.addEventListener('mousewheel', e => this.onScroll(e), { signal: this.evtController.signal });

            this.getTrack().canvas.addEventListener('mouseenter', e => this.onMouseEnter(e), { signal: this.evtController.signal });
            this.getTrack().canvas.addEventListener('mouseout', e => this.onMouseOut(e), { signal: this.evtController.signal });

            this.getTrack().canvas.addEventListener('contextmenu', e => this.onContextMenu(e), { signal: this.evtController.signal });

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
        this.setMousePos(e);
        this.getTrack().focalPoint = null;
        this.getTrack().lastClick.set(this.getTrack().mousePos);

        this.getUI().onMouseDown(e);
        if (this.allowStateEvent()) {
            this.stateManager.getCurrent().onMouseDown(e);
        }
    }

    onMouseUp(e) {
        this.getUI().onMouseUp(e);
        if (this.allowStateEvent()) {
            this.stateManager.getCurrent().onMouseUp(e);
        }
    }

    onMouseMove(e) {
        this.setMousePos(e);

        this.getTrack().mousePos.x = Math.round(this.getTrack().mousePos.x / this.getTrack().gridDetail) * this.getTrack().gridDetail;
        this.getTrack().mousePos.y = Math.round(this.getTrack().mousePos.y / this.getTrack().gridDetail) * this.getTrack().gridDetail;

        this.getUI().onMouseMove(e);

        if (this.allowStateEvent()) {
            this.stateManager.getCurrent().onMouseMove(e);
        }
    }

    onScroll(e) {
        e.preventDefault();
        if (this.stateManager.stateStack.length) {
            this.stateManager.getCurrent().onScroll(e);
        }
    }

    onContextMenu(e) {
        e.preventDefault();
        if (this.stateManager.stateStack.length) {
            this.stateManager.getCurrent().onContextMenu(e);
        }
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
        if (this.stateManager.stateStack.length) {
            this.stateManager.getCurrent().onKeyboardDown(e);
        }
    }

    onVisibilityChange() {
        if (this.stateManager.stateStack.length) {
            this.stateManager.getCurrent().onVisibilityChange();
        }
    }

    setMousePos(e) {
        let canvasRect = this.getTrack().canvas.getBoundingClientRect();
        this.getTrack().mousePos.set(new Vector(
            e.clientX - canvasRect.left + window.pageXOffset,
            e.clientY - canvasRect.top + window.pageYOffset
        ).normalizeToCanvas(this.getTrack()));
    }

    allowStateEvent() {
        return !this.getUI().uiElements.some(uiElement => uiElement.hovered) && this.stateManager.stateStack.length;
    }
}