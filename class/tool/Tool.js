import Track from "../track/Track.js";
import GameObject from "../game/GameObject.js";
import UITool from "../ui/UITool.js";

export default class Tool extends GameObject {
    static get toolName() { return 'Tool'; }
    static get keyLabel() { return null; }
    static get key() { return null; }
    static get icon() { return null; }

    /**
     *
     * @param {Track} track
     */
    constructor(track) {
        super();
        this.track = track;
        this.mouseDown = false;
        this.alwaysRender = false;
        this.ui = null;
        this.optionsOpen = false;
        this.group = null;
    }

    registerControls() {
        if (this.constructor.keyLabel != null && this.constructor.key != null) {
            this.track.event.keyboard.registerControl(this.constructor.keyLabel, this.constructor.key);
        }
    }

    getUI(uiManager, pos, align) {
        if (this.ui == null) {
            this.ui = new UITool(uiManager, this.track, pos * 26, this.constructor, () => this.run(), align);
        }

        return this.ui;
    }

    isHolding() {
        return this.track.event.keyboard.isDown(this.constructor.keyLabel);
    }

    run() {
        if (this.group) {
            this.group.ui.icon = this.ui.icon;
            this.group.currentInstance = this;
        }
        this.track.toolManager.setTool(this);
    }

    createOptionsUI() {}

    openOptions() {
        if (this.ui.optionsUI.items.length == 0) {
            this.createOptionsUI();
        }
        this.ui.uiManager.uiElements.push(this.ui.optionsUI);
        this.optionsOpen = true;
    }

    closeOptions() {
        this.ui.uiManager.uiElements = this.ui.uiManager.uiElements.filter(obj => obj !== this.ui.optionsUI);
        this.optionsOpen = false;
    }

    activate() {
        if (this.group) {
            this.group.openOptions();
        }
        this.ui.uiManager.cursor = 'none';
        this.openOptions();
    }

    deactivate() {
        if (this.group) {
            this.group.closeOptions();
        }
        this.closeOptions();
        this.mouseDown = false;
    }

    onMouseDown(e) {
        this.mouseDown = true;
    }

    onMouseUp(e) {
        this.mouseDown = false;
    }

    onMouseMove(e) {
        this.track.focalPoint = null;
    }

    onScroll(e) {
        let pos = this.track.mousePos;
        if (this.track.focalPoint) {
            pos = this.track.focalPoint.displayPos;
        }
        this.track.zoom(pos, -Math.sign(e.deltaY));
    }

    fixedUpdate() {}
    update(progress, delta) {}
    render(ctx) {}
}