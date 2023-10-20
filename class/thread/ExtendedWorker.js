export default class ExtendedWorker {
    static createWorker() {
        let workerWorker = () => {
            class WorkerSlave {
                constructor() {
                    this.id = 0;
                    this.pending = false;
                }

                postMessage(message) {
                    self.postMessage(message);
                }

                postText(message) {
                    this.postMessage({ msg: message });
                }

                postCommand(command, args) {
                    this.postMessage({ cmd: command, args: args });
                }

                handleMessage(e) {
                    if (e.data.cmd === undefined) {
                        this.postText(`#${this.id} Unknown message: ${e.data}`);
                        return;
                    }

                    switch (e.data.cmd) {
                        case 'setId':
                            this.id = e.data.id;
                            this.postText(`Worker #${this.id} allocated`);
                            break;
                        case 'newTask':
                            this.requestTask();
                            break;
                        case 'startTask':
                            this.doTask(e.data);
                            break;
                        case 'noTask':
                            this.noTask();
                            break;
                        default:
                            this.postText(`#${this.id} Unknown command: ${e.data.cmd}`);
                    }
                }

                requestTask() {
                    if (!this.pending) {
                        this.pending = true;
                        this.postCommand('requestTask');
                    }
                }

                setBusy(busy) {
                    this.postCommand(busy ? 'busy' : 'idle');

                    if (!busy) {
                        this.requestTask();
                    }
                }

                doTask(data) {
                    this.pending = false;

                    this.setBusy(true);
                    this.renderCell(data.task);

                    this.postMessage({ cmd: 'taskResult', id: data.id, result: true });
                    this.setBusy(false);
                }

                noTask() {
                    this.pending = false;
                }

                renderCell(task) {
                    let cellSize = task.cellSize;
                    let zoom = task.zoom;
                    let opacityFactor = task.opacityFactor;
                    let x = task.x;
                    let y = task.y;
                    let scenery = [...new Int32Array(task.sceneryBuffer)];
                    let lines = [...new Int32Array(task.lineBuffer)];
                    let canvas = task.canvas;
                    let context = canvas.getContext('2d');

                    let posX, posY, endPosX, endPosY;
                    let offsetLeft = x * zoom - 1;
                    let offsetTop = y * zoom - 1;

                    const drawLines = (lines) => {
                        for (let i = 0; i < lines.length - 3; i += 4) {
                            posX = lines[i];
                            posY = lines[i + 1];
                            endPosX = lines[i + 2];
                            endPosY = lines[i + 3];

                            context.beginPath();
                            context.moveTo(posX * zoom - offsetLeft, posY * zoom - offsetTop);
                            context.lineTo(endPosX * zoom - offsetLeft, endPosY * zoom - offsetTop);
                            context.stroke();
                        }
                    };

                    // bleed cells by 1px on each side to avoid thin lines
                    canvas.width = cellSize * zoom + 2;
                    canvas.height = cellSize * zoom + 2;

                    context.lineCap = 'round';
                    context.lineWidth = Math.max(2 * zoom, 0.5);
                    context.globalAlpha = opacityFactor;

                    context.strokeStyle = '#aaa';
                    drawLines(scenery);
                    context.strokeStyle = '#000';
                    drawLines(lines);
                }
            }

            let workerSlave = new WorkerSlave();
            self.addEventListener('message', e => workerSlave.handleMessage(e));
        }

        let worker = new Worker(URL.createObjectURL(new Blob([`(${workerWorker.toString()})()`])));

        return worker;
    }
}