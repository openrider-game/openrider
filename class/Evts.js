export class Evts {
    constructor() {
        this.$events = {};
    }

    on(evt, fn) {
        (this.$events[evt] = this.$events[evt] || []).push(fn);
        return this;
    }

    once(evt, fn) {
        return this.on(evt, function() {
            fn.apply(this, args);
            this.off(evt, fn);
        });
    }

    off(evt, fn) {
        if (this.$events[evt]) {
            _remove(this.$events[evt], fn);
        }
        return this;
    }

    emit(evt) {
        let e = this.$events && this.$events[evt];
        if (e)
            for (let args = _slice.call(arguments, 1), i = 0, l = e.length; i < l; i++) {
                e[i].apply(this, args);
            }
        return this;
    }
}