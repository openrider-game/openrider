import UIButton from "./UIButton.js";

export default class UIToggleableButton extends UIButton {
    constructor(uiManager, track, x, y, width, height, label, activeLabel, callback, align) {
        super(uiManager, track, x, y, width, height, label, callback, align);
        this.active = false;
        this.activeLabel = activeLabel;
        this.inactiveLabel = label;
        this.callback = callback;
        this.onClick = this.toggle;
    }

    toggle() {
        this.active = !this.active;
        this.label = this.active ? this.activeLabel : this.inactiveLabel;
        this.callback();
    }
}