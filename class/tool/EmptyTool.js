import Tool from './Tool.js';

export default class EmptyTool extends Tool {
    getDOM() {
        let el = super.getDOM();
        el.classList.add('empty');

        return el;
    }

    run() {}
}