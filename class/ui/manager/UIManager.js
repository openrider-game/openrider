import GameObject from "../../game/GameObject.js";
import UIElement from "../base/UIElement.js";

export default class UIManager extends GameObject {
    /**
     *
     * @param {Track} track
     */
    constructor(track) {
        super();
        this.track = track;
        /**
         * @type {Array<UIElement>}
         */
        this.uiElements = new Array();
        this.cursor = 'none';
    }

    fixedUpdate() {
        for (let uiElement of this.uiElements) {
            uiElement.fixedUpdate();
        }
    }

    update(progress, delta) {
        for (let uiElement of this.uiElements) {
            uiElement.update(progress, delta);
        }
    }

    render(ctx) {
        for (let uiElement of this.uiElements) {
            uiElement.render(ctx);
        }

        let anyHovered = this.uiElements.some(uiElement => uiElement.hovered);
        this.track.canvas.style.cursor = anyHovered ? 'pointer' : this.cursor;
    }

    onMouseMove(e) {
        for (let uiElement of this.uiElements) {
            uiElement.onMouseMove(e);
        }
    }

    onMouseDown(e) {
        for (let uiElement of this.uiElements) {
            uiElement.onMouseDown(e);
        }
    }

    onMouseUp(e) {
        for (let uiElement of this.uiElements) {
            uiElement.onMouseUp(e);
        }
    }
}