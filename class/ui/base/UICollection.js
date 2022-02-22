import UIElement from "./UIElement.js";

export default class UICollection extends UIElement {
    constructor(uiManager, track) {
        super(uiManager, track);

        this.items = new Array();
    }

    intersects(mousePos) {
        for (let item of this.items) {
            if (item.intersects(mousePos)) {
                return true;
            }
        }

        return false;
    }

    fixedUpdate() {
        for (let item of this.items) {
            item.fixedUpdate();
        }
    }

    update(progress, delta) {
        super.update(progress, delta);
        for (let item of this.items) {
            item.update(progress, delta);
        }
    }

    render(ctx) {
        for (let item of this.items) {
            item.render(ctx);
        }
    }

    onMouseMove(e) {
        super.onMouseMove(e);
        for (let item of this.items) {
            item.onMouseMove(e);
        }
    }

    onMouseDown(e) {
        super.onMouseDown(e);
        for (let item of this.items) {
            item.onMouseDown(e);
        }
    }

    onMouseUp(e) {
        super.onMouseUp(e);
        for (let item of this.items) {
            item.onMouseUp(e);
        }
    }
}