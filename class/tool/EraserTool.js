import Control from "../keyboard/Control.js";
import * as KeyCode from "../keyboard/KeyCode.js";
import UIElement from "../ui/base/UIElement.js";
import UIToggleableButton from "../ui/UIToggleableButton.js";
import Tool from "./Tool.js";

export default class EraserTool extends Tool {
    static get toolName() { return 'Eraser'; }
    static get keyLabel() { return 'E'; }
    static get key() { return new Control(KeyCode.DOM_VK_E); }
    static get icon() { return 'eraser'; }

    constructor(track) {
        super(track);

        this.size = 15;
        this.minSize = 5;
        this.maxSize = 40;

        this.restrict = new Map();
        this.restrict.set('foregroundLayer', new Map());
        this.restrict.get('foregroundLayer').set('line', true);
        this.restrict.get('foregroundLayer').set('scenery', true);
        this.restrict.get('foregroundLayer').set('object', false); // no objects in foreground
        this.restrict.set('mainLayer', new Map());
        this.restrict.get('mainLayer').set('line', true);
        this.restrict.get('mainLayer').set('scenery', true);
        this.restrict.get('mainLayer').set('object', true);
    }

    onMouseDown(e) {
        super.onMouseDown(e);
        this.onMouseMove(e);
    }

    onMouseMove(e) {
        super.onMouseMove(e);
        if (this.mouseDown) {
            let deleted = this.track.checkDelete(this.track.mousePos, this.size, this.restrict);
            if (deleted.length) {
                this.track.undoManager.push({
                    undo: () => deleted.forEach(e => e.addToTrack()),
                    redo: () => deleted.forEach(e => e.removeFromTrack())
                });
            }
        }
    }

    onScroll(e) {
        if (this.isHolding()) {
            this.size = Math.max(this.minSize, Math.min(this.maxSize, this.size + 5 * -Math.sign(e.deltaY)));
        } else {
            super.onScroll(e);
        }
    }

    createOptionsUI() {
        let x = (this.track.canvas.width - 300) / 2;

        let foregroundLineToggle = new UIToggleableButton(this.ui, this.track, x, 5, 300, 30, 'Foreground Line: inactive', 'Foreground Line: active', () => this.restrict.get('foregroundLayer').set('line', !this.restrict.get('foregroundLayer').get('line')), UIElement.ALIGN_HORIZONTAL_CENTER);
        foregroundLineToggle.active = true;
        foregroundLineToggle.label = foregroundLineToggle.activeLabel;

        let foregroundSceneryToggle = new UIToggleableButton(this.ui, this.track, x, 40, 300, 30, 'Foreground Scenery: inactive', 'Foreground Scenery: active', () => this.restrict.get('foregroundLayer').set('scenery', !this.restrict.get('foregroundLayer').get('scenery')), UIElement.ALIGN_HORIZONTAL_CENTER);
        foregroundSceneryToggle.active = true;
        foregroundSceneryToggle.label = foregroundSceneryToggle.activeLabel;

        let mainLineToggle = new UIToggleableButton(this.ui, this.track, x, 75, 300, 30, 'Main Line: inactive', 'Main Line: active', () => this.restrict.get('mainLayer').set('line', !this.restrict.get('mainLayer').get('line')), UIElement.ALIGN_HORIZONTAL_CENTER);
        mainLineToggle.active = true;
        mainLineToggle.label = mainLineToggle.activeLabel;

        let mainSceneryToggle = new UIToggleableButton(this.ui, this.track, x, 110, 300, 30, 'Main Scenery: inactive', 'Main Scenery: active', () => this.restrict.get('mainLayer').set('scenery', !this.restrict.get('mainLayer').get('scenery')), UIElement.ALIGN_HORIZONTAL_CENTER);
        mainSceneryToggle.active = true;
        mainSceneryToggle.label = mainSceneryToggle.activeLabel;

        let mainObjectToggle = new UIToggleableButton(this.ui, this.track, x, 145, 300, 30, 'Main Object: inactive', 'Main Object: active', () => this.restrict.get('mainLayer').set('object', !this.restrict.get('mainLayer').get('object')), UIElement.ALIGN_HORIZONTAL_CENTER);
        mainObjectToggle.active = true;
        mainObjectToggle.label = mainObjectToggle.activeLabel;

        this.ui.optionsUI.items.push(foregroundLineToggle, foregroundSceneryToggle, mainLineToggle, mainSceneryToggle, mainObjectToggle);
    }

    render(ctx) {
        let pos = this.track.mousePos.toPixel(this.track);
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, this.size * this.track.zoomFactor, 0, 2 * Math.PI, true);
        ctx.fillStyle = '#ffb6c1';
        ctx.fill();
    }
}