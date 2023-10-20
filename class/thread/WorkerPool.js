import ExtendedWorker from "./ExtendedWorker.js";
import WorkerTask from "./WorkerTask.js";

export default class WorkerPool {
    static createWorkerPool() {
        for (let i = 0; i < navigator.hardwareConcurrency - 1; i++) {
            WorkerPool.workers[i] = ExtendedWorker.createWorker();
            WorkerPool.workers[i].addEventListener('message', e => WorkerPool.handleMessage(e, i));
            WorkerPool.workers[i].postMessage({ cmd: 'setId', id: i });
        }
    }

    static broadcastMessage(message, transferables) {
        for (let i in WorkerPool.workers) {
            WorkerPool.postMessage(i, message, transferables);
        }
    }

    static postMessage(i, message, transferables) {
        WorkerPool.workers[i].postMessage(message, transferables);
    }

    static handleMessage(e, i) {
        if (e.data.cmd) {
            switch (e.data.cmd) {
                case 'requestTask':
                    WorkerPool.provideTask(i);
                    break;
                case 'taskResult':
                    WorkerPool.receiveResults(e.data, i);
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
        if (WorkerPool.queue.length > 0) {
            console.log(`#${i} requested a task`);

            let task = WorkerPool.queue.shift();
            WorkerPool.taskId++;

            WorkerPool.callbacks[WorkerPool.taskId] = task.callback;
            WorkerPool.postMessage(i, { cmd: 'startTask', id: WorkerPool.taskId, task: task.definition }, task.transferables);
        } else {
            console.log(`#${i} no tasks available`);
            WorkerPool.postMessage(i, { cmd: 'noTask' });
        }
    }

    /**
     *
     * @param {WorkerTask} task
     */
    static postTask(task) {
        WorkerPool.queue.push(task);

        if (WorkerPool.queue.length == 1) {
            WorkerPool.broadcastMessage({ cmd: 'newTask' });
        }

        console.log(`Task queue: ${WorkerPool.queue.length}`);
    }

    static receiveResults(res, i) {
        if (res.id === undefined) {
            console.log(`Unidentified task result from #${i}`, res);
            return;
        }

        let callback = WorkerPool.callbacks[res.id];
        if (callback) {
            WorkerPool.callbacks[res.id] = null;
            callback();
        }
    }
}

WorkerPool.taskId = 0;

/** @type {Worker[]} */
WorkerPool.workers = [];
/** @type {WorkerTask[]} */
WorkerPool.queue = [];
WorkerPool.callbacks = [];