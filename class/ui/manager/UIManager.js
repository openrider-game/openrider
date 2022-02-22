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
        this.uiElements = [];
        // this.cursor = null;
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

        // let anyHovered = this.uiElements.some(uiElement => uiElement.hovered);
        // if (anyHovered && this.cursor == null) {
        //     this.cursor = this.track.canvas.style.cursor;
        //     this.track.canvas.style.cursor = 'default';
        // } else if (!anyHovered && this.cursor != null) {
        //     if (this.track.canvas.style.cursor == 'default') {
        //         this.track.canvas.style.cursor = this.cursor;
        //     }
        //     this.cursor = null;
        // }
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