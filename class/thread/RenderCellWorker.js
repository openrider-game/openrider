import RenderCell from "../grid/cell/RenderCell.js";

export default class RenderCellWorker {
    static createRenderCellWorker() {
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
                    this.postMessage({msg: message});
                }

                postCommand(command, args) {
                    this.postMessage({cmd: command, args: args});
                }

                handleMessage(e) {
                    if(e.data.cmd === undefined) {
                        this.postText(`#${this.id} Unknown message: ${e.data}`);
                        return;
                    }

                    switch(e.data.cmd) {
                        case 'setId':
                            this.id = e.data.id;
                            this.postText(`Worker #${this.id} allocated`);
                            break;
                        case 'startTask':
                            this.doTask(e.data);
                        default:
                            this.postText(`#${this.id} Unknown command: ${e.data.cmd}`);
                    }
                }

                doTask(data) {
                    let cellSize = data.cellSize;
                    let zoom = data.zoom;
                    let opacityFactor = data.opacityFactor;
                    let x = data.x;
                    let y = data.y;
                    let scenery = [...new Int32Array(data.sceneryBuffer)];
                    let lines = [...new Int32Array(data.lineBuffer)];
                    let canvas = data.canvas;
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

    /**
     *
     * @param {RenderCell} cell
     * @param {OffscreenCanvas} canvas
     */
    static renderCell(cell, zoom, opacityFactor, canvas) {
        let worker = RenderCellWorker.getNextWorker();
        let [sceneryBuffer, lineBuffer] = RenderCellWorker.createBuffers(cell);

        worker.postMessage({
            cellSize: cell.size,
            zoom: zoom,
            opacityFactor: opacityFactor,
            x: cell.x,
            y: cell.y,
            sceneryBuffer: sceneryBuffer,
            lineBuffer: lineBuffer,
            canvas: canvas
        }, [sceneryBuffer, lineBuffer, canvas]);
    }

    static createBuffers(cell) {
        let temp = new Array();

        for(let scenery of cell.scenery) {
            temp.push(scenery.pos.x, scenery.pos.y, scenery.endPos.x, scenery.endPos.y);
        }
        let sceneryByteArray = new Int32Array(temp);

        temp = new Array();
        for(let line of cell.lines) {
            temp.push(...line.pos.toArray(), ...line.endPos.toArray());
        }
        let lineByteArray = new Int32Array(temp);

        return [sceneryByteArray.buffer, lineByteArray.buffer];
    }

    static getNextWorker() {
        if (!RenderCellWorker.pool[RenderCellWorker.current]) {
            RenderCellWorker.pool[RenderCellWorker.current] = RenderCellWorker.createRenderCellWorker();
        }

        let worker = RenderCellWorker.pool[RenderCellWorker.current];
        RenderCellWorker.current = (RenderCellWorker.current + 1) % (navigator.hardwareConcurrency - 1);
        return worker;
    }
}

RenderCellWorker.pool = [];
RenderCellWorker.current = 0;