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

        this.mouseIn = false;
    }

    getTrack() {
        return this.stateManager.track;
    }

    getUI() {
        return this.stateManager.getCurrent().ui;
    }

    attach() {
        this.getTrack().canvas.addEventListener('mousedown', e => this.onMouseDown(e));
        this.getTrack().canvas.addEventListener('mouseup', e => this.onMouseUp(e));
        this.getTrack().canvas.addEventListener('mousemove', e => this.onMouseMove(e));
        this.getTrack().canvas.addEventListener('wheel', e => this.onScroll(e));

        this.getTrack().canvas.addEventListener('mouseenter', e => this.onMouseEnter(e));
        this.getTrack().canvas.addEventListener('mouseout', e => this.onMouseOut(e));

        this.getTrack().canvas.addEventListener('contextmenu', e => this.onContextMenu(e));

        document.addEventListener('visibilitychange', () => this.onVisibilityChange());

        document.addEventListener('keydown', e => this.onKeyDown(e));
        document.addEventListener('keyup', e => this.onKeyUp(e));

        document.addEventListener('keyboarddown', e => this.onKeyboardDown(e));
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
        if (document.activeElement === document.body) {
            this.keyboard.onKeyDown(e);
        }
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
        this.getTrack().realMousePos.set(new Vector(
            e.clientX - canvasRect.left + window.pageXOffset,
            e.clientY - canvasRect.top + window.pageYOffset
        ).normalizeToCanvas(this.getTrack()));

        this.getTrack().mousePos.x = Math.round(this.getTrack().realMousePos.x / this.getTrack().gridDetail) * this.getTrack().gridDetail;
        this.getTrack().mousePos.y = Math.round(this.getTrack().realMousePos.y / this.getTrack().gridDetail) * this.getTrack().gridDetail;
    }

    allowStateEvent() {
        return !this.getUI().uiElements.some(uiElement => uiElement.hovered) && this.stateManager.stateStack.length;
    }
}