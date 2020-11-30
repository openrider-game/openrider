import Keyboard from "./Keyboard.js";

export default class Control {
    constructor(keyCodes, modifiers = Keyboard.NONE) {
        if (!Array.isArray(keyCodes)) {
            keyCodes = [keyCodes];
        }

        this.modifiers = modifiers;
        this.codes = keyCodes;
    }
}