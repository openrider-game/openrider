import { drawingSize, eraserSize, gridDetail, label, lastClick, lastForeground, lastScenery, mousePos, secretlyErasing, snapFromPrevLine, toolbar2, track, watchGhost } from "../../bootstrap.js";
import { BMXGhost } from "../bike/ghost/BMXGhost.js";
import { MTBGhost } from "../bike/ghost/MTBGhost.js";
import { BIKE_BMX, BIKE_HAR, BIKE_MTB } from "../constant/BikeConstants.js";
import { TOOL } from "../constant/ToolConstants.js";
import { TRACKSTRING_NEW, TRACKSTRING_OLD, TRACK_DEFAULT } from "../constant/TrackConstants.js";
import { CanvasHelper } from "../helper/CanvasHelper.js";
import { CheckpointSave } from "../history/CheckpointSave.js";
import { UndoManager } from "../history/UndoManager.js";
import { Bomb } from "../item/Bomb.js";
import { Boost } from "../item/Boost.js";
import { Checkpoint } from "../item/Checkpoint.js";
import { Gravity } from "../item/Gravity.js";
import { SlowMo } from "../item/SlowMo.js";
import { Target } from "../item/Target.js";
import { GridBox } from "./GridBox.js";
import { Track } from "./Track.js";
import { LineTool } from "../tools/LineTool.js";
import { Eraser } from "../tools/eraser.js";

export class RaceTrack extends Track {
    constructor(ID, canvas, game) {
        super(canvas, game);
        let rawTrack, x, y, rawLine;
        this.ghostKeys = [];
        this.ghostIDs = [];
        this.ghostInstances = [];
        this.id = ID;
        this.trackStringVersion = TRACKSTRING_NEW;
        this.undoManager = new UndoManager();
        this.lastTool = TOOL.CAMERA;

        this.lineTool = new LineTool(this);
        this.eraser = new Eraser(this);


        if (!this.id) {
            rawTrack = TRACK_DEFAULT;
            this.id = undefined;
            toolbar2.style.display = 'block';
            this.currentTool = TOOL.LINE;
        } else if (isNaN(this.id)) {
            rawTrack = this.id;
            this.id = undefined;
            toolbar2.style.display = 'block';
            this.currentTool = TOOL.LINE;
        } else {
            let request = new XMLHttpRequest();
            request.open('POST', '/tracks/load', false);
            request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            request.send('id=' + this.id);
            rawTrack = request.responseText;
            if (rawTrack.substr(0, 3) !== 'v1,') {
                this.trackStringVersion = TRACKSTRING_OLD;
            }
        }
        this.origCode = rawTrack;
        let hashSplit = rawTrack.split('#'),
            lines = hashSplit[0] ? hashSplit[0].split(',') : [];
        for (let i = 0, l = lines.length; i < l; i++) {
            rawLine = lines[i].split(/\s+/g);
            if (rawLine.length > 3) {
                for (let k = 0, m = rawLine.length - 2; k < m; k += 2) {
                    this.addLine({ x: parseInt(rawLine[k], 32), y: parseInt(rawLine[k + 1], 32) }, { x: parseInt(rawLine[k + 2], 32), y: parseInt(rawLine[k + 3], 32) });
                }
            }
        }
        if (hashSplit.length > 1) {
            let scenery = hashSplit[1].split(',');
            for (let i = 0, l = scenery.length; i < l; i++) {
                rawLine = scenery[i].split(/\s+/g);
                if (rawLine.length > 3) {
                    for (let k = 0, m = rawLine.length - 2; k < m; k += 2) {
                        this.addLine({ x: parseInt(rawLine[k], 32), y: parseInt(rawLine[k + 1], 32) }, { x: parseInt(rawLine[k + 2], 32), y: parseInt(rawLine[k + 3], 32) }, true);
                    }
                }
            }
        }
        this.numTargets = 0;
        this.targetsReached = 0;
        this.collectables = []; // Goals and Checkpoints
        let objects = hashSplit[2] ? hashSplit[2].split(',') : [],
            item;
        for (let i = 0, l = objects.length; i < l; i++) {
            let rawCoords = objects[i].split(/\s+/g);
            if (rawCoords.length > 2) {
                x = parseInt(rawCoords[1], 32);
                y = parseInt(rawCoords[2], 32);
                switch (rawCoords[0]) {
                    case 'T':
                        item = new Target(x, y, this);
                        this.numTargets++;
                        this.collectables.push(item);
                        break;
                    case 'C':
                        item = new Checkpoint(x, y, this);
                        this.collectables.push(item);
                        break;
                    case 'B':
                        item = new Boost(x, y, parseInt(rawCoords[3], 32) + 180, this);
                        break;
                    case 'G':
                        item = new Gravity(x, y, parseInt(rawCoords[3], 32) + 180, this);
                        break;
                    case 'O':
                        item = new Bomb(x, y, this);
                        break;
                    case 'S':
                        item = new SlowMo(x, y, this);
                        break;
                    default:
                        ;
                }
                if (item) {
                    x = Math.floor(x / this.gridSize);
                    y = Math.floor(y / this.gridSize);
                    if (this.grid[x] === undefined) {
                        this.grid[x] = {};
                    }
                    if (this.grid[x][y] === undefined) {
                        this.grid[x][y] = new GridBox(x, y);
                    }
                    this.grid[x][y].powerups.push(item);
                }
            }
        }
        if (hashSplit[3] === BIKE_BMX || hashSplit[3] === BIKE_MTB || hashSplit[3] === BIKE_HAR) {
            this.currentBike = hashSplit[3];
            this.time = hashSplit[4] !== '' ? hashSplit[4] : false;
        } else {
            this.time = hashSplit[3] !== '' ? hashSplit[3] : false;
        }
    }

    save() {
        let track = this,
            bike = track.bike,
            ghosts = track.ghostInstances,
            i = 0,
            l = track.collectables.length,
            ghost, reached = { length: l },
            bikeList, ghostLists = { length: ghosts.length };
        bikeList = {
            0: bike.head.pos.x,
            1: bike.head.pos.y,
            2: bike.head.oldPos.x,
            3: bike.head.oldPos.y,
            4: bike.head.velocity.x,
            5: bike.head.velocity.y,
            6: bike.backWheel.pos.x,
            7: bike.backWheel.pos.y,
            8: bike.backWheel.oldPos.x,
            9: bike.backWheel.oldPos.y,
            10: bike.backWheel.velocity.x,
            11: bike.backWheel.velocity.y,
            12: bike.backWheel.speedValue,
            13: bike.frontWheel.pos.x,
            14: bike.frontWheel.pos.y,
            15: bike.frontWheel.oldPos.x,
            16: bike.frontWheel.oldPos.y,
            17: bike.frontWheel.velocity.x,
            18: bike.frontWheel.velocity.y,
            19: bike.frontWheel.speedValue,
            20: bike.headToBack.len,
            21: bike.frontToBack.len,
            22: bike.headToFront.len,
            23: bike.direction,
            24: bike.gravity.x,
            25: bike.gravity.y,
            26: bike.slow,
            27: track.targetsReached,
            28: reached,
            29: track.currentTime,
            30: bike.leftPressed,
            31: bike.rightPressed,
            32: bike.upPressed,
            33: bike.downPressed,
            34: bike.keys,
            length: 35
        };
        for (; i < l; i++) {
            reached[i] = track.collectables[i].reached;
        }
        for (let i = 0, l = ghosts.length; i < l; i++) {
            ghost = ghosts[i];
            ghostLists[i] = {
                0: ghost.head.pos.x,
                1: ghost.head.pos.y,
                2: ghost.head.oldPos.x,
                3: ghost.head.oldPos.y,
                4: ghost.head.velocity.x,
                5: ghost.head.velocity.y,
                6: ghost.backWheel.pos.x,
                7: ghost.backWheel.pos.y,
                8: ghost.backWheel.oldPos.x,
                9: ghost.backWheel.oldPos.y,
                10: ghost.backWheel.velocity.x,
                11: ghost.backWheel.velocity.y,
                12: ghost.backWheel.speedValue,
                13: ghost.frontWheel.pos.x,
                14: ghost.frontWheel.pos.y,
                15: ghost.frontWheel.oldPos.x,
                16: ghost.frontWheel.oldPos.y,
                17: ghost.frontWheel.velocity.x,
                18: ghost.frontWheel.velocity.y,
                19: ghost.frontWheel.speedValue,
                20: ghost.headToBack.len,
                21: ghost.frontToBack.len,
                22: ghost.headToFront.len,
                23: ghost.direction,
                24: ghost.gravity.x,
                25: ghost.gravity.y,
                26: ghost.slow,
                27: track.targetsReached,
                28: reached,
                29: track.currentTime,
                30: ghost.leftPressed,
                31: ghost.rightPressed,
                32: ghost.upPressed,
                33: ghost.downPressed,
                34: ghost.color,
                length: 34
            };
        }
        track.checkpoints.push(new CheckpointSave(track, bikeList, ghostLists));
    }

    restart() {
        super.restart();
        this.ghostInstances = [];
        this.runningGhosts = [];
        let ghost;
        let cp = this.checkpoints[this.checkpoints.length - 1];
        for (let i = 0; i < this.ghostKeys.length; i++) {
            this.ghostInstances[i] = ghost =
                new(this.ghostKeys[i][6] === BIKE_BMX ? BMXGhost : MTBGhost)(this, this.ghostKeys[i], cp && cp.ghostLists[i]);
            ghost.color = this.ghostKeys[i].color;
            if (!this.bike || this.checkpoints.length === 0 && !this.up) {
                this.focalPoint = ghost.head;
            }
        }
    }

    unreachEverything() {
        let x, y, i, l, box;
        for (x in this.grid)
            if (this.grid.hasOwnProperty(x)) {
                for (y in this.grid[x])
                    if (this.grid[x].hasOwnProperty(y)) {
                        box = this.grid[x][y];
                        for (let i = 0, l = box.powerups.length; i < l; i++) {
                            if (box.powerups[i].reached !== undefined) {
                                box.powerups[i].reached = false;
                            }
                        }
                    }
            }
    }

    watchGhost(g) {
        watchGhost(g, this);
        return this;
    }

    fixedUpdate() {
        if (!this.paused) {
            if (this.bike) this.bike.fixedUpdate();
            for (let i = 0; i < this.ghostInstances.length; i++) {
                this.ghostInstances[i].fixedUpdate();
            }
            this.currentTime += this.game.ms;
        }
        return this;
    }

    update(progress, delta) {
        switch(this.currentTool) {
            case 'line':
            case 'scenery line':
                this.lineTool.update(delta);
                break;
            case 'eraser':
                this.eraser.update(delta);
        }
        if (!this.paused) {
            this.bike.update(progress, delta);
            for (let i = 0; i < this.ghostInstances.length; i++) {
                this.ghostInstances[i].update(progress, delta);
            }
            if (this.focalPoint) {
                this.camera.selfAdd(this.focalPoint.displayPos.sub(this.camera).scale(delta / 200));
            }
        }
    }

    render() {
        let drawer = CanvasHelper.getInstance();
        let mousePx = mousePos.toPixel(this);
        drawer.clearRect(0, 0, this.canvas.width, this.canvas.height);

        drawer.setProperty('lineWidth', Math.max(2 * this.zoomFactor, 0.5));
        drawer.setProperty('lineJoin', 'round');

        this.drawGridBoxes(drawer);

        drawer.setProperty('lineWidth', Math.max(2 * this.zoomFactor, 0.5));

        // Don't show text or tools if you're making a thumbnail.
        if (this.canvas.width === 250) {
            return;
        }

        
        // Draw tools (crosshairs, eraser, powerups)
        if (secretlyErasing) {
            this.eraser(mousePx);
        } else if (this.currentTool !== TOOL.CAMERA && !this.focalPoint) {
            switch (this.currentTool) {
                case 'line':
                case 'scenery line':
                case 'brush':
                case 'scenery brush':
                    this.lineTool.render(this.canvas.getContext('2d'));
                    break;
                case 'eraser':
                    this.eraser.render(this.canvas.getContext('2d'));
                    break;
                case 'goal':
                case 'checkpoint':
                case 'bomb':
                case 'slow-mo':
                    drawer.setProperty('fillStyle', this.currentTool === TOOL.GOAL ? '#ff0' : this.currentTool === TOOL.CHECKPOINT ? '#00f' : this.currentTool === TOOL.BOMB ? '#f00' : '#eee');
                    drawer.setProperty('strokeStyle', '#000');
                    drawer.beginPath().arc(mousePx.x, mousePx.y, 7 * this.zoomFactor, 0, 2 * Math.PI, true).fill().stroke();
                    break;
                case 'boost':
                case 'gravity':
                    drawer.setProperty('strokeStyle', '#000');
                    drawer.beginPath()
                        .setProperty('fillStyle', this.currentTool === TOOL.BOOST ? '#ff0' : '#0f0');
                    drawer.ctx.save();
                    if (!snapFromPrevLine) {
                        drawer.ctx.translate(mousePx.x, mousePx.y);
                    } else {
                        drawer.ctx.translate(lastClick.toPixel(track).x, lastClick.toPixel(track).y);
                        drawer.ctx.rotate(Math.atan2(-(mousePos.x - lastClick.x), mousePos.y - lastClick.y));
                    }
                    drawer.moveTo(-7 * this.zoomFactor, -10 * this.zoomFactor).lineTo(0, 10 * this.zoomFactor).lineTo(7 * this.zoomFactor, -10 * this.zoomFactor).lineTo(-7 * this.zoomFactor, -10 * this.zoomFactor).fill().stroke()
                    drawer.restore();
                    break;
                default:
                    break;
            }
        }

        this.drawText(drawer);

        if (this.changingThumb) {
            let x0 = (this.canvas.width - 250) / 2,
                x1 = x0 + 250,
                y0 = (this.canvas.height - 150) / 2,
                y1 = y0 + 150;
            drawer.setProperty('lineWidth', 1);
            drawer.setProperty('strokeStyle', '#fff');
            drawer.setProperty('fillStyle', 'rgba(0, 0, 0, 0.4)');
            drawer.fillRect(0, 0, this.canvas.width, y0).fillRect(0, y1, this.canvas.width, y0).fillRect(0, y0, x0, 150).fillRect(x1, y0, x0, 150).strokeRect(x0, y0, 250, 150);
            //drawer.fillRect(x0, y1, this.canvas.width - x1, this.canvas.height - y1);
            //drawer.fillRect(x1, y0, this.canvas.width - x1, 150);
        }

        for (let i = 0; i < this.ghostInstances.length; i++) {
            this.ghostInstances[i].render();
        }

        if (this.bike) this.bike.render();

        return this;
    }

    drawText(drawer) {
        drawer.beginPath();
        drawer.setProperty('fillStyle', '#ff0');
        drawer.setProperty('lineWidth', 1);
        drawer.arc(40, 12, 3.5, 0, 2 * Math.PI, true).fill().stroke().beginPath();
        drawer.setProperty('lineWidth', 10);
        drawer.setProperty('strokeStyle', '#fff');
        drawer.setProperty('fillStyle', '#000');
        let minutes = Math.floor(this.currentTime / 60000),
            seconds = Math.floor(this.currentTime % 60000 / 1000),
            millis = Math.floor((this.currentTime - minutes * 60000 - seconds * 1000) / 100),
            text = '';
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        if (seconds < 10) {
            seconds = '0' + seconds;
        }
        text = minutes + ':' + seconds + '.' + millis;
        if (this.paused) {
            text += ' - Game paused';
        } else if (this.bike && this.bike.dead) {
            text = 'Press ENTER to restart' + (this.checkpoints.length ? ' or BACKSPACE to cancel Checkpoint' : '');
        } else if (this.id === undefined) {
            if (gridDetail === 10 && (this.currentTool === 'line' || this.currentTool === 'scenery line' || this.currentTool === 'brush' || this.currentTool === 'scenery brush')) {
                text += ' - Grid ';
            }
            text += ' - ' + this.currentTool;
            if (this.currentTool === 'brush' || this.currentTool === 'scenery brush') {
                text += ' ( size ' + drawingSize + ' )';
            }
        }
        if (label && !label[0] && !label[1]) {
            text += ' - ' + (this.paused ? 'Unp' : 'P') + 'ause ( SPACE )';
        }
        drawer.strokeText(text = ': ' + this.targetsReached + ' / ' + this.numTargets + ' - ' + text, 50, 16);
        drawer.fillText(text, 50, 16);

        // Ghost info
        drawer.setProperty('textAlign', 'right');
        for (let i = 0, l = this.ghostInstances.length; i < l; i++) {
            const ghost = this.ghostInstances[i];
            drawer.setProperty('fillStyle', (ghost.color !== '#000' && ghost.color) || '#777');
            text = (this.focalPoint === ghost.head ? '>> ' : '') + (ghost.name || 'Ghost') + (ghost.targetsReached === this.numTargets ? ' finished!' : ': ' + ghost.targetsReached + ' / ' + this.numTargets);
            drawer.ctx.strokeText(text, this.canvas.width - 7, 16 + 17 * i);
            drawer.fillText(text, this.canvas.width - 7, 16 + 17 * i);
        }

        // Tooltip
        drawer.setProperty('textAlign', 'left');
        drawer.setProperty('fillStyle', '#000');
        if (label) {
            if (!label[0]) {
                drawer.ctx.strokeText(label[2], 36, 15 + label[1] * 25);
                drawer.fillText(label[2], 36, 15 + label[1] * 25);
            } else {
                drawer.setProperty('textAlign', 'right');
                if (document.documentElement.offsetHeight <= window.innerHeight) {
                    drawer.ctx.strokeText(label[2], this.canvas.width - 36, 15 + label[1] * 25);
                    drawer.fillText(label[2], this.canvas.width - 36, 15 + label[1] * 25);
                } else {
                    drawer.ctx.strokeText(label[2], this.canvas.width - 51, 15 + label[1] * 25);
                    drawer.fillText(label[2], this.canvas.width - 51, 15 + label[1] * 25);
                }
                drawer.setProperty('textAlign', 'left');
            }
        }
    }

    // eraser(mousePx) {
    //     let drawer = CanvasHelper.getInstance();
    //     drawer.setProperty('fillStyle', '#ffb6c1');
    //     drawer.beginPath().arc(mousePx.x, mousePx.y, (eraserSize - 1) * this.zoomFactor, 0, 2 * Math.PI, true).fill();
    // }

    checkDelete(eraserPoint) {
        let x = Math.floor(eraserPoint.x / this.gridSize - 0.5),
            y = Math.floor(eraserPoint.y / this.gridSize - 0.5),
            Ix = this.grid[x],
            Ix1 = this.grid[x + 1],
            Ixy, Ixy1, Ix1y, Ix1y1, i, l, deleted = [];

        function del(obj) {
            let b = obj.checkDelete(eraserPoint);
            b && deleted.push(b);
        }
        if (Ix !== undefined) {
            Ixy = Ix[y];
            Ixy1 = Ix[y + 1];
            if (Ixy !== undefined) {
                for (let i = 0, l = Ixy.lines.length; i < l; i++) {
                    Ixy.lines[i] && del(Ixy.lines[i]);
                }
                for (let i = 0, l = Ixy.scenery.length; i < l; i++) {
                    Ixy.scenery[i] && del(Ixy.scenery[i]);
                }
                for (let i = 0, l = Ixy.powerups.length; i < l; i++) {
                    Ixy.powerups[i] && del(Ixy.powerups[i]);
                }
            }
            if (Ixy1 !== undefined) {
                for (let i = 0, l = Ixy1.lines.length; i < l; i++) {
                    Ixy1.lines[i] && del(Ixy1.lines[i]);
                }
                for (let i = 0, l = Ixy1.scenery.length; i < l; i++) {
                    Ixy1.scenery[i] && del(Ixy1.scenery[i]);
                }
                for (let i = 0, l = Ixy1.powerups.length; i < l; i++) {
                    Ixy1.powerups[i] && del(Ixy1.powerups[i]);
                }
            }
        }
        if (Ix1 !== undefined) {
            Ix1y = Ix1[y];
            Ix1y1 = Ix1[y + 1];
            if (Ix1y !== undefined) {
                for (let i = 0, l = Ix1y.lines.length; i < l; i++) {
                    Ix1y.lines[i] && del(Ix1y.lines[i]);
                }
                for (let i = 0, l = Ix1y.scenery.length; i < l; i++) {
                    Ix1y.scenery[i] && del(Ix1y.scenery[i]);
                }
                for (let i = 0, l = Ix1y.powerups.length; i < l; i++) {
                    Ix1y.powerups[i] && del(Ix1y.powerups[i]);
                }
            }
            if (Ix1y1 !== undefined) {
                for (let i = 0, l = Ix1y1.lines.length; i < l; i++) {
                    Ix1y1.lines[i] && del(Ix1y1.lines[i]);
                }
                for (let i = 0, l = Ix1y1.scenery.length; i < l; i++) {
                    Ix1y1.scenery[i] && del(Ix1y1.scenery[i]);
                }
                for (let i = 0, l = Ix1y1.powerups.length; i < l; i++) {
                    Ix1y1.powerups[i] && del(Ix1y1.powerups[i]);
                }
            }
        }
        for (let i = 0, l = this.collectables.length; i < l; i++) {
            if (this.collectables[i] && this.collectables[i].doRemove !== undefined) {
                deleted.push(this.collectables.splice(i--, 1)[0]);
            }
        }
        return deleted;
    }

    doAfterAddLine() {
        if (this.currentTool === 'brush' || this.currentTool === 'line' ||
            this.currentTool === 'scenery brush' || this.currentTool === 'scenery line') {
            if (this.currentTool === 'brush' || this.currentTool === 'line') {
                lastForeground.set(mousePos);
            } else {
                lastScenery.set(mousePos);
            }
            lastClick.set(mousePos);
        }
    }

    selfAdd(arr, known) {
        for (let i = 0, l = arr.length; i < l; i++) {
            if (arr[i].type) {
                arr[i] = new arr[i].type(arr[i].x, arr[i].y, this);
            }
            if (arr[i].isItem) {
                this.addObject(arr[i]);
            } else {
                known ? this.addLineInternal(arr[i]) : this.addLine(arr[i].a, arr[i].b, arr[i].isScenery);
            }
        }
    }

    remove(Av, BZ) {
        if (BZ === undefined) {
            BZ = Av;
        }
        let grids = this.gridSpread(Av, BZ, this.gridSize),
            deleted = [];
        for (let i = 0, l = grids.length; i < l; i++) {
            let x = Math.floor(grids[i].x / this.gridSize),
                y = Math.floor(grids[i].y / this.gridSize);
            deleted = deleted.concat(this.grid[x][y].remove());
            delete this.cache[x + '_' + y];
        }
        for (let i = 0, l = deleted.length; i < l; i++) {
            deleted[i].doRemove = false;
        }
    }

    pushUndo(undo, redo) {
        this.undoManager.push({ undo: undo, redo: redo });
        return this;
    }

    undo() {
        this.undoManager.undo();
        return this;
    }

    redo() {
        this.undoManager.redo();
        return this;
    }

    shortenLastLineSet() {
        if (this.currentTool === 'scenery line' || this.currentTool === 'scenery brush') {
            let x = Math.floor(lastScenery.x / this.gridSize),
                y = Math.floor(lastScenery.y / this.gridSize),
                line = this.grid[x][y].scenery[this.grid[x][y].scenery.length - 1];
            if (line && line.b.x === Math.round(lastScenery.x) && line.b.y === Math.round(lastScenery.y)) {
                line.doRemove = true;
                lastScenery.set(line.a);
                this.remove(line.a, line.b);
            } else {
                alert('No more scenery line to erase!');
            }
        } else {
            let x = Math.floor(lastForeground.x / this.gridSize),
                y = Math.floor(lastForeground.y / this.gridSize),
                line = this.grid[x][y].lines[this.grid[x][y].lines.length - 1];
            if (line !== undefined && line.b.x === Math.round(lastForeground.x) && line.b.y === Math.round(lastForeground.y)) {
                line.doRemove = true;
                lastForeground.set(line.a);
                this.remove(line.a, line.b);
            } else {
                alert('No more line to erase!');
            }
        }
    }

    toString() {
        let lines = '',
            scenery = '',
            objects = '';
        for (let x in this.grid) {
            for (let y in this.grid[x])
                if (this.grid[x][y].lines) {
                    for (let P = 0; P < this.grid[x][y].lines.length; P++) {
                        if (!this.grid[x][y].lines[P].stringGot) {
                            lines += this.grid[x][y].lines[P].a + this.grid[x][y].lines[P].getEnd() + ',';
                        }
                    }
                    for (let v = 0; v < this.grid[x][y].scenery.length; v++) {
                        if (!this.grid[x][y].scenery[v].stringGot) {
                            scenery += this.grid[x][y].scenery[v].a + this.grid[x][y].scenery[v].getEnd() + ',';
                        }
                    }
                    for (let j = 0; j < this.grid[x][y].powerups.length; j++) {
                        objects += this.grid[x][y].powerups[j] + ',';
                    }
                }
        }
        for (let x in this.grid) {
            for (let y in this.grid[x])
                if (this.grid[x][y].lines) {
                    for (let P = 0; P < this.grid[x][y].lines.length; P++) {
                        this.grid[x][y].lines[P].stringGot = false;
                    }
                    for (let v = 0; v < this.grid[x][y].scenery.length; v++) {
                        this.grid[x][y].scenery[v].stringGot = false;
                    }
                }
        }
        return lines.substr(0, lines.length - 1) + '#' +
            scenery.substr(0, scenery.length - 1) + '#' +
            objects.substr(0, objects.length - 1) + '#' +
            this.currentBike;
    }
}