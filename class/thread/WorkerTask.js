export default class WorkerTask {
    constructor(callback) {
        this.callback = callback;
        this.definition = {};
        this.transferables = [];
    }
}