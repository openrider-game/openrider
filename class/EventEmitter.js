export class EventEmitter {
    constructor() {
        this.events = {};
    }

    /**
     * Runs the callback whenever the event is emitted.
     * @param {string} event 
     * @param {function} listener 
     */
    on(event, listener) {
        if (typeof this.events[event] !== 'object') {
            this.events[event] = [];
        }

        this.events[event].push(listener);
    }

    /**
     * Runs the callback only once when the event is first emitted, and then removes the listener.
     * @param {string} event 
     * @param {function} listener 
     */
    once(event, listener) {
        this.on(event, function g() {
            this.removeListener(event, g);
            listener.apply(this, arguments);
        });
    }

    /**
     * @param {string} event 
     * @param  {...any} args Any additional arguments that may be required by the event.
     */
    emit(event, ...args) {
        if (typeof this.events[event] === 'object') {
            let listeners = this.events[event].slice();

            for (let listener of listeners) {
                listener.apply(this, args);
            }
        }
    }

    /**
     * @param {string} event 
     * @param {function} listener 
     */
    removeListener(event, listener) {
        if (typeof this.events[event] === 'object') {
            let idx = indexOf(this.events[event], listener);

            if (idx > -1) {
                this.events[event].splice(idx, 1);
            }
        }
    }
}