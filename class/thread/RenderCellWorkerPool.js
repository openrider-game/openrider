import RenderCellWorker from "./RenderCellWorker.js";

export default class RenderCellWorkerPool {
    static createWorkerPool() {
        for (let i = 0; i < navigator.hardwareConcurrency - 1; i++) {
            RenderCellWorkerPool.workers[i] = RenderCellWorker.createRenderCellWorker();
            RenderCellWorkerPool.workers[i].addEventListener('message', e => RenderCellWorkerPool.handleMessage(e, i));
            RenderCellWorkerPool.workers[i].postMessage({cmd: 'setId', id: i});
        }
    }

    static broadcastMessage(message) {
        for(let i in workers) {
            RenderCellWorkerPool.postMessage(message, i);
        }
    }

    static postMessage(message, i) {
        RenderCellWorkerPool.workers[i].postMessage(message);
    }

    static handleMessage(e, i) {
        if(e.data.cmd) {
            switch(e.data.cmd) {
                case 'requestTask':
                    RenderCellWorkerPool.provideTask(i);
                    break;
                default:
                    console.log(`Unknown command: ${e.data.cmd}`, e.data);
            }
        } else if(e.data.msg) {
            console.log(`Message from #${i}: ${e.data.msg}`);
        } else {
            console.log(`Received from #${i}`, e.data);
        }
    }

    static provideTask(i) {
        if(RenderCellWorkerPool.queue.length > 0) {
            console.log(`#${i} requested a task`);

            let task = RenderCellWorkerPool.queue.shift();
            RenderCellWorkerPool.taskId++;

            RenderCellWorkerPool.callbacks[RenderCellWorkerPool.taskId] = task.callback;
            RenderCellWorkerPool.postMessage({cmd: 'startTask', id: RenderCellWorkerPool.taskId, task: task.definition}, i);
        } else {
            console.log(`#${i} no tasks available`);
            RenderCellWorkerPool.postMessage({cmd: 'noTask'}, i);
        }
    }
}

RenderCellWorkerPool.taskId = 0;

RenderCellWorkerPool.workers = [];
RenderCellWorkerPool.queue = [];
RenderCellWorkerPool.callbacks = [];