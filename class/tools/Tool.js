export class Tool {
    constructor(track) {
        this.track = track;
        this.isMouseDown = false;
    }
    update() {}
    render() {}
    mouseDown() {
        this.isMouseDown = true;
    }
    mouseUp() {
        this.isMouseDown = false;
    }
    scroll() {}
}