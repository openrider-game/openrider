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
    update() {}
    render(ctx) {}
    mouseDown() {
        this.isMouseDown = true;
    }
    mouseUp() {
        this.isMouseDown = false;
    }
    scroll(e) {
        this.track.zoom(mousePos, -Math.sign(e.deltaY));
    }
}