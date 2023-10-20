import RenderCellTask from "./RenderCellTask.js";
import RenderCellWorker from "./RenderCellWorker.js";

export default class RenderCellWorkerPool {
    static createWorkerPool() {
        for (let i = 0; i < navigator.hardwareConcurrency - 1; i++) {
            RenderCellWorkerPool.workers[i] = RenderCellWorker.createRenderCellWorker();
            RenderCellWorkerPool.workers[i].addEventListener('message', e => RenderCellWorkerPool.handleMessage(e, i));
            RenderCellWorkerPool.workers[i].postMessage({ cmd: 'setId', id: i });
        }
    }

    static broadcastMessage(message) {
        for (let i in RenderCellWorkerPool.workers) {
            RenderCellWorkerPool.postMessage(message, i);
        }
    }

    static postMessage(message, i, transferables) {
        RenderCellWorkerPool.workers[i].postMessage(message, transferables);
    }

    static handleMessage(e, i) {
        if (e.data.cmd) {
            switch (e.data.cmd) {
                case 'requestTask':
                    RenderCellWorkerPool.provideTask(i);
                    break;
                case 'taskResult':
                    RenderCellWorkerPool.receiveResults(e.data, i);
                    break;
                case 'busy':
                case 'idle':
                    // nothing for now :)
                    break;
                default:
                    console.log(`Unknown command: ${e.data.cmd}`, e.data);
            }
        } else if (e.data.msg) {
            console.log(`Message from #${i}: ${e.data.msg}`);
        } else {
            console.log(`Received from #${i}`, e.data);
        }
    }

    static provideTask(i) {
        if (RenderCellWorkerPool.queue.length > 0) {
            console.log(`#${i} requested a task`);

            let task = RenderCellWorkerPool.queue.shift();
            RenderCellWorkerPool.taskId++;

            RenderCellWorkerPool.callbacks[RenderCellWorkerPool.taskId] = task.callback;
            RenderCellWorkerPool.postMessage({ cmd: 'startTask', id: RenderCellWorkerPool.taskId, task: task.definition }, i, task.transferables);
        } else {
            console.log(`#${i} no tasks available`);
            RenderCellWorkerPool.postMessage({ cmd: 'noTask' }, i);
        }
    }

    /**
     * 
     * @param {RenderCellTask} task 
     */
    static postTask(task) {
        RenderCellWorkerPool.queue.push(task);

        if (RenderCellWorkerPool.queue.length == 1) {
            RenderCellWorkerPool.broadcastMessage({ cmd: 'newTask' });
        }

        console.log(`Task queue: ${RenderCellWorkerPool.queue.length}`);
    }

    static receiveResults(res, i) {
        if (res.id === undefined) {
            console.log(`Unidentified task result from #${i}`, res);
            return;
        }

        let callback = RenderCellWorkerPool.callbacks[res.id];
        if (callback) {
            RenderCellWorkerPool.callbacks[res.id] = null;
            callback();
        }
    }
}

RenderCellWorkerPool.taskId = 0;

/** @type {Worker[]} */
RenderCellWorkerPool.workers = [];
/** @type {RenderCellTask[]} */
RenderCellWorkerPool.queue = [];
RenderCellWorkerPool.callbacks = [];