import GameObject from "../../game/GameObject.js";

export default class UIElement extends GameObject {
    constructor(uiManager, track, x, y, width, height, align) {
        super();

        this.uiManager = uiManager;
        /**
         * @type {Track}
         */
        this.track = track;
        this.originalX = x;
        this.originalY = y;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.align = align;

        this.hovered = false;
        this.focused = false;
    }

    /**
     *
     * @param {Vector} mousePos
     * @returns
     */
    intersects(mousePos) {
        let mousePx = mousePos.toPixel(this.track);

        return mousePx.x > this.x &&
            mousePx.y > this.y &&
            mousePx.x < this.x + this.width &&
            mousePx.y < this.y + this.height;
    }

    fixedUpdate() {}

    update(progress, delta) {
        if (!this.track.event.mouseIn) {
            this.hovered = false;
        }
    }

    render(ctx) {
        if (this.align & UIElement.ALIGN_BOTTOM) {
            this.y = this.track.canvas.height - this.height - this.originalY;
        }
        if (this.align & UIElement.ALIGN_RIGHT) {
            this.x = this.track.canvas.width - this.width - this.originalX;
        }
        if (this.align & UIElement.ALIGN_HORIZONTAL_CENTER) {
            this.x = (this.track.canvas.width - this.width) / 2;
        }
        if (this.align & UIElement.ALIGN_VERTICAL_CENTER) {
            this.y = (this.track.canvas.height - this.height) / 2;
        }
    }

    onClick() {}

    onMouseMove(e) {
        let intersects = this.intersects(this.track.realMousePos);
        this.hovered = intersects;

        if (!intersects && this.focused) {
            this.focused = false;
        }
    }

    onMouseDown(e) {
        this.focused = this.intersects(this.track.realMousePos);
    }

    onMouseUp(e) {
        let intersects = this.intersects(this.track.realMousePos);

        if (intersects && this.focused) {
            this.focused = false;
            this.onClick();
        }
    }
}

UIElement.ALIGN_RIGHT = 1 << 0;
UIElement.ALIGN_BOTTOM = 1 << 1;
UIElement.ALIGN_HORIZONTAL_CENTER = 1 << 2;
UIElement.ALIGN_VERTICAL_CENTER = 1 << 3;