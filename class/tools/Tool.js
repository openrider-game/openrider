import {mousePos} from '../../bootstrap.js';

export class Tool {
    constructor(track, hotkey) {
        this.track = track;
        this.isMouseDown = false;
        this.hotkey = hotkey || null;
        this.holding = false;
    }

    deselect() {
        this.isMouseDown = false;
        this.holding = false;
    }
    select() {}
    update(delta) {}
    render(ctx) {}
    mouseDown() {
        this.isMouseDown = true;
    }
    mouseUp() {
        this.isMouseDown = false;
    }
    mouseMove(e) {
        this.track.focalPoint = false;
    }
    scroll(e) {
        this.track.zoom(mousePos, -Math.sign(e.deltaY));
    }
    keyDown(e) {
        if (e.key.toLowerCase() === this.hotkey) {
            this.holding = true;
        }
    }
    keyUp(e) {
        if (e.key.toLowerCase() === this.hotkey) {
            this.holding = false;
        }
    }
}