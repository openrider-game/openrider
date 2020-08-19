import {mousePos} from '../../bootstrap.js';

export class Tool {
    constructor(track) {
        this.track = track;
        this.isMouseDown = false;        
    }

    deselect() {
        this.isMouseDown = false;
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
}