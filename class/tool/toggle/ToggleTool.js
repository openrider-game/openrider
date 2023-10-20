import Tool from "../Tool.js";

export default class ToggleTool extends Tool {
    constructor(track) {
        super(track);

        this.toggleColor = '#077';
    }

    run() {
        [this.toggleColor, this.ui.color] = [this.ui.color, this.toggleColor];
        this.toggle();
    }

    toggle() {}
}