import { EventEmitter } from "../EventEmitter.js";

export default class Controls extends EventEmitter {

    constructor(context) {
        super();

        this.controls = {};
        this.holding = {};

        context.addEventListener('keydown', e => this.onKeyDown(e));
        context.addEventListener('keyup', e => this.onKeyUp(e));
    }

    registerControl(name, keyCode, modifiers) {
        this.controls[name] = { name: name, modifiers: modifiers, code: keyCode };
    }

    getCode(name) {
        return this.controls[name].code;
    }

    getModifiers(name) {
        return this.controls[name].modifiers;
    }

    isDown(name) {
        return this.holding[name];
    }

    test(name, e) {
        var control = this.controls[name],
            matches = e.which === control.code || e.code === control.code;
        if (matches && (control.modifiers & Controls.CTRL)) {
            matches = e.ctrlKey;
        }
        if (matches && (control.modifiers & Controls.ALT)) {
            matches = e.altKey;
        }
        if (matches && (control.modifiers & Controls.SHIFT)) {
            matches = e.shiftKey;
        }
        return matches;
    }

    onKeyDown(e) {
        var ctrl;
        for (var i in this.controls)
            if (this.controls.hasOwnProperty(i)) {
                ctrl = this.controls[i];
                if (this.test(ctrl.name, e) && !this.holding[ctrl.name]) {
                    this.holding[ctrl.name] = true;
                    this.emit(ctrl.name + 'Down', e);
                }
            }
    }

    onKeyUp(e) {
        var ctrl;
        for (var i in this.controls)
            if (this.controls.hasOwnProperty(i)) {
                ctrl = this.controls[i];
                if (this.test(ctrl.name, e) && this.holding[ctrl.name]) {
                    this.holding[ctrl.name] = false;
                    this.emit(ctrl.name + 'Up', e)
                }
            }
    }
}

Controls.NONE = 0;
Controls.CTRL = 1;
Controls.ALT = 2;
Controls.SHIFT = 4;