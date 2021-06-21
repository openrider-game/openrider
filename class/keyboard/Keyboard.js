export default class Keyboard {
    constructor() {
        this.controls = new Map();
        this.holding = new Map();
        this.firedOnce = new Map();
    }

    registerControl(name, control) {
        this.controls.set(name, control);
    }

    isDown(name) {
        let holding = !!this.holding.get(name);
        let fireOnce = this.controls.get(name).fireOnce;
        let firedOnce = !!this.firedOnce.get(name);

        if (fireOnce && !firedOnce && holding) {
            this.firedOnce.set(name, true);
            return true;
        }

        return holding && (!fireOnce || !firedOnce);
    }

    test(control, e) {
        let matches = control.codes.includes(e.which) || control.codes.includes(e.code);
        if (matches && (control.modifiers & Keyboard.CTRL)) {
            matches = e.ctrlKey;
        }
        if (matches && (control.modifiers & Keyboard.ALT)) {
            matches = e.altKey;
        }
        if (matches && (control.modifiers & Keyboard.SHIFT)) {
            matches = e.shiftKey;
        }
        return matches;
    }

    onKeyDown(e) {
        this.controls.forEach((control, key) => {
            if (this.test(control, e)) {
                e.preventDefault();
                if (!this.holding.get(key)) {
                    this.holding.set(key, true);
                    document.dispatchEvent(new CustomEvent('keyboarddown', { detail: key }));
                }
            }
        });
    }

    onKeyUp(e) {
        this.controls.forEach((control, key) => {
            if (this.test(control, e)) {
                e.preventDefault();
                if (this.holding.get(key)) {
                    this.holding.set(key, false);
                    this.firedOnce.set(key, false);
                    document.dispatchEvent(new CustomEvent('keyboardup', { detail: key }));
                }
            }
        });
    }
}

Keyboard.NONE = 0;
Keyboard.CTRL = 1;
Keyboard.ALT = 2;
Keyboard.SHIFT = 4;