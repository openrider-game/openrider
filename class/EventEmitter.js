export class EventEmitter {
    constructor() {
        this.events = {};
    }

    on(event, listener) {
        if (typeof this.events[event] !== 'object') {
            this.events[event] = [];
        }

        this.events[event].push(listener);
    }

    once(event, listener) {
        this.on(event, function g() {
            this.removeListener(event, g);
            listener.apply(this, arguments);
        });
    }

    emit(event) {
        let i, listeners, length, args = [].slice.call(arguments, 1);

        if (typeof this.events[event] === 'object') {
            listeners = this.events[event].slice();
            length = listeners.length;

            for (i = 0; i < length; i++) {
                listeners[i].apply(this, args);
            }
        }
    }

    removeListener(event, listener) {
        let idx;

        if (typeof this.events[event] === 'object') {
            idx = indexOf(this.events[event], listener);

            if (idx > -1) {
                this.events[event].splice(idx, 1);
            }
        }
    }
}