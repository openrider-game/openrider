import { canvas, combine, context, doc, drawingSize, eraserSize, gridDetail, gridSpread, label, lastClick, lastForeground, lastScenery, mousePos, secretlyErasing, shadeLines, snapFromPrevLine, toolbar2, track, up, watchGhost } from "../../unobfuscated_bhr.js";
import { BIKE_BMX, BIKE_MTB, TRACKSTRING_NEW, TRACKSTRING_OLD, TRACK_DEFAULT } from "../constant/TrackConstants.js";
import { TOOL_BRUSH, TOOL_CAMERA, TOOL_GOAL, TOOL_LINE, TOOL_SBRUSH, TOOL_SLINE } from "../constant/ToolConstants.js";
import { BMXGhost } from "../bike/ghost/BMXGhost.js";
import { MTBGhost } from "../bike/ghost/MTBGhost.js";
import { BMX } from "../bike/BMX.js";
import { Harley } from "../bike/Harley.js";
import { MTB } from "../bike/MTB.js";
import { CheckpointSave } from "../history/CheckpointSave.js";
import { UndoManager } from "../history/UndoManager.js";
import { Bomb } from "../item/Bomb.js";
import { Boost } from "../item/Boost.js";
import { Checkpoint } from "../item/Checkpoint.js";
import { Gravity } from "../item/Gravity.js";
import { SlowMo } from "../item/SlowMo.js";
import { Target } from "../item/Target.js";
import { Point } from "../Point.js";
import { arc, beginPath, fill, fillRect, fillText, lineTo, moveTo, stroke, strokeRect } from "../utils/DrawUtils.js";
import { floor, PI2, round, toInt } from "../utils/MathUtils.js";
import { GridBox } from "./GridBox.js";
import { SceneryLine } from "./line/SceneryLine.js";
import { SolidLine } from "./line/SolidLine.js";

export class Track {
    constructor(ID) {
        var rawTrack, i, k, l, m, x, y, rawLine;
        this.grid = {};
        this.gridSize = 100;
        this.ghostKeys = [];
        this.ghostInstances = [];
        this.checkpoints = [];
        this.canvas = canvas;
        this.cache = {};
        this.zoomFactor = 0.6;
        this.currentTime = 0;
        this.id = ID;
        this.currentBike = BIKE_BMX;
        this.trackStringVersion = TRACKSTRING_NEW;
        this.undoManager = new UndoManager();
        this.paused = false;
        this.watchGhost = this._watchGhost;
        this.currentTool = TOOL_CAMERA;
        this.lastTool = TOOL_CAMERA;
        context[fillText]('Loading track... Please wait.', 36, 16);
        this.camera = new Point(0, 0);
        if (!this.id) {
            rawTrack = TRACK_DEFAULT;
            toolbar2.style.display = 'block';
            this.currentTool = TOOL_LINE;
        } else if (this.id.length > 7) { // change to detect an int
            rawTrack = this.id;
            this.id = undefined;
            toolbar2.style.display = 'block';
            this.currentTool = TOOL_LINE;
        } else {
            var request = new XMLHttpRequest();
            request.open('POST', '/tracks/load', false);
            request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            request.send('id=' + this.id);
            rawTrack = request.responseText;
            if (rawTrack.substr(0, 3) !== 'v1,') {
                this.trackStringVersion = TRACKSTRING_OLD;
            }
        }
        this.origCode = rawTrack;
        var hashSplit = rawTrack.split('#'),
            lines = hashSplit[0] ? hashSplit[0].split(',') : [];
        for (i = 0, l = lines.length; i < l; i++) {
            rawLine = lines[i].split(/\s+/g);
            if (rawLine.length > 3) {
                for (k = 0, m = rawLine.length - 2; k < m; k += 2) {
                    this.addLine({ x: toInt(rawLine[k], 32), y: toInt(rawLine[k + 1], 32) }, { x: toInt(rawLine[k + 2], 32), y: toInt(rawLine[k + 3], 32) });
                }
            }
        }
        if (hashSplit.length > 1) {
            var scenery = hashSplit[1].split(',');
            for (i = 0, l = scenery.length; i < l; i++) {
                rawLine = scenery[i].split(/\s+/g);
                if (rawLine.length > 3) {
                    for (k = 0, m = rawLine.length - 2; k < m; k += 2) {
                        this.addLine({ x: toInt(rawLine[k], 32), y: toInt(rawLine[k + 1], 32) }, { x: toInt(rawLine[k + 2], 32), y: toInt(rawLine[k + 3], 32) }, true);
                    }
                }
            }
        }
        this.numTargets = 0;
        this.targetsReached = 0;
        this.objects = [];
        var objects = hashSplit[2] ? hashSplit[2].split(',') : [],
            item;
        for (i = 0, l = objects.length; i < l; i++) {
            var rawCoords = objects[i].split(/\s+/g);
            if (rawCoords.length > 2) {
                x = toInt(rawCoords[1], 32);
                y = toInt(rawCoords[2], 32);
                switch (rawCoords[0]) {
                    case 'T':
                        item = new Target(x, y, this);
                        this.numTargets++;
                        this.objects.push(item);
                        break;
                    case 'C':
                        item = new Checkpoint(x, y, this);
                        this.objects.push(item);
                        break;
                    case 'B':
                        item = new Boost(x, y, toInt(rawCoords[3], 32) + 180, this);
                        break;
                    case 'G':
                        item = new Gravity(x, y, toInt(rawCoords[3], 32) + 180, this);
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
                    x = floor(x / this.gridSize);
                    y = floor(y / this.gridSize);
                    if (this.grid[x] === undefined) {
                        this.grid[x] = {};
                    }
                    if (this.grid[x][y] === undefined) {
                        this.grid[x][y] = new GridBox(x, y);
                    }
                    this.grid[x][y].objects.push(item);
                }
            }
        }
        if (hashSplit[3] === BIKE_BMX || hashSplit[3] === BIKE_MTB || hashSplit[3] === 'HAR') {
            this.currentBike = hashSplit[3];
            this.time = hashSplit[4] !== '' ? hashSplit[4] : false;
        } else {
            this.time = hashSplit[3] !== '' ? hashSplit[3] : false;
        }
    }

    save() {
        var track = this,
            bike = track.bike,
            ghosts = track.ghostInstances,
            i = 0,
            l = track.objects.length,
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
            20: bike.joints[0].len,
            21: bike.joints[1].len,
            22: bike.joints[2].len,
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
            reached[i] = track.objects[i].reached;
        }
        for (i = 0, l = ghosts.length; i < l; i++) {
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
                20: ghost.joints[0].len,
                21: ghost.joints[1].len,
                22: ghost.joints[2].len,
                23: ghost.direction,
                24: ghost.gravity.x,
                25: ghost.gravity.y,
                26: ghost.slow,
                27: ghost.leftPressed,
                28: ghost.rightPressed,
                29: ghost.upPressed,
                30: ghost.downPressed,
                31: ghost.targetsReached,
                32: ghost.color,
                length: 33
            };
        }
        track.checkpoints.push(new CheckpointSave(track, bikeList, ghostLists));
    }

    restart() {
        this.unreachEverything();
        this.paused = false;
        this.ghostInstances = [];
        this.runningGhosts = [];
        var cp = this.checkpoints[this.checkpoints.length - 1],
            bike = this.bike = new({ BMX: BMX, MTB: MTB, HAR: Harley }[this.currentBike] || BMX)(this, cp && cp.bikeList),
            l = this.ghostInstances.length,
            i, ghostKeys = this.ghostKeys,
            ghost;
        if (bike) {
            this.focalPoint = bike.head;
            /** HACK */
            this.currentTime = cp ? cp.currentTime : 0;
            /** /HACK */
            this.camera = bike.head.pos.clone();
        }
        for (i = 0; i < l; i++) {
            this.ghostInstances[i] = ghost =
                new(ghostKeys[i][6] === 'BMX' ? BMXGhost : MTBGhost)(this, ghostKeys[i], cp && cp.ghostLists[i]);
            ghost.color = ghostKeys[i].color;
            if (!bike || bike.$consts.length === 1 && !up) {
                this.focalPoint = ghost.head;
            }
        }
    }

    reset() {
        this.checkpoints = [];
        this.restart();
    }

    unreachEverything() {
        var x, y, i, l, box;
        for (x in this.grid)
            if (this.grid.hasOwnProperty(x)) {
                for (y in this.grid[x])
                    if (this.grid[x].hasOwnProperty(y)) {
                        box = this.grid[x][y];
                        for (i = 0, l = box.objects.length; i < l; i++) {
                            if (box.objects[i].reached !== undefined) {
                                box.objects[i].reached = false;
                            }
                        }
                    }
            }
    }

    _watchGhost(g) {
        if (g = typeof g === 'string' && g.charAt(0) === 'g' ? toInt(g.substr(1), 10) : this.ghosts[toInt(g, 10) - 1]) {
            watchGhost(g, this);
        }
        return this;
    }

    touch(part) {
        var x = floor(part.pos.x / this.gridSize - 0.5),
            y = floor(part.pos.y / this.gridSize - 0.5),
            grid = this.grid;
        if (grid[x] !== undefined) {
            if (grid[x][y] !== undefined) {
                grid[x][y].untouch();
            }
            if (grid[x][y + 1] !== undefined) {
                grid[x][y + 1].untouch();
            }
        }
        if (grid[x + 1] !== undefined) {
            if (grid[x + 1][y] !== undefined) {
                grid[x + 1][y].untouch();
            }
            if (grid[x + 1][y + 1] !== undefined) {
                grid[x + 1][y + 1].untouch();
            }
        }
        if (grid[x] !== undefined && grid[x][y] !== undefined) {
            grid[x][y].touch(part);
        }
        if (grid[x + 1] !== undefined) {
            if (grid[x + 1][y] !== undefined) {
                grid[x + 1][y].touch(part);
            }
            if (grid[x + 1][y + 1] !== undefined) {
                grid[x + 1][y + 1].touch(part);
            }
        }
        if (grid[x] !== undefined && grid[x][y + 1] !== undefined) {
            grid[x][y + 1].touch(part);
        }
        return this;
    }

    proceed() {
        var l = this.ghostInstances.length,
            i = 0;
        if (!this.paused) {
            this.bike && this.bike.proceed();
            for (; i < l; i++) {
                this.ghostInstances[i].proceed();
            }
            this.currentTime += 40;
        }
        this.draw();
        for (i = 0; i < l; i++) {
            this.ghostInstances[i].draw();
        }
        this.bike && this.bike.draw();
        return this;
    }

    draw() {
        var bike = this.bike,
            ghost, time = this.currentTime,
            z = this.zoomFactor,
            gs = this.gridSize,
            mousePx = mousePos.toPixel(this),
            grid = this.grid;
        if (this.focalPoint) {
            this.camera.selfAdd(this.focalPoint.pos.cloneSub(this.camera).cloneScale(1 / 5));
        }
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.lineWidth = Math.max(2 * z, 0.5);
        if (snapFromPrevLine && !secretlyErasing && (this.currentTool === TOOL_LINE || this.currentTool === TOOL_SLINE ||
                this.currentTool === TOOL_BRUSH || this.currentTool === TOOL_SBRUSH)) {
            if (mousePx.x < 50) {
                this.camera.x -= 10 / z;
                mousePos.x -= 10 / z;
            } else if (mousePx.x > canvas.width - 50) {
                this.camera.x += 10 / z;
                mousePos.x += 10 / z;
            }
            if (mousePx.y < 50) {
                this.camera.y -= 10 / z;
                mousePos.y -= 10 / z;
            } else if (mousePx.y > canvas.height - 50) {
                this.camera.y += 10 / z;
                mousePos.y += 10 / z;
            }
            context.strokeStyle = '#f00';
            mousePx = mousePos.toPixel(this);
            context[beginPath]()[moveTo](lastClick.toPixel(this).x, lastClick.toPixel(this).y)[lineTo](mousePx.x, mousePx.y)[stroke]();
        }
        var center = new Point(0, 0).normalizeToCanvas(),
            border = new Point(canvas.width, canvas.height).normalizeToCanvas();
        center.x = floor(center.x / gs);
        center.y = floor(center.y / gs);
        border.x = floor(border.x / gs);
        border.y = floor(border.y / gs);
        var DI = [],
            i, l, x, y, key;
        for (x = center.x; x <= border.x; x++) {
            for (y = center.y; y <= border.y; y++) {
                if (grid[x] !== undefined && grid[x][y] !== undefined) {
                    if (grid[x][y].lines.length > 0 || grid[x][y].scenery.length > 0) {
                        DI[key = x + '_' + y] = 1;
                        if (this.cache[key] === undefined) {
                            var el = this.cache[key] = doc.createElement('canvas');
                            el.width = gs * z;
                            el.height = gs * z;
                            var graphic = el.getContext('2d');
                            graphic.lineCap = 'round';
                            graphic.lineWidth = Math.max(2 * z, 0.5);
                            graphic.strokeStyle = '#aaa';
                            for (i = 0, l = grid[x][y].scenery.length; i < l; i++) {
                                grid[x][y].scenery[i].draw(graphic, x * gs * z, y * gs * z);
                            }
                            graphic.strokeStyle = '#000';
                            if (shadeLines) {
                                graphic.shadowOffsetX =
                                    graphic.shadowOffsetY = 2;
                                graphic.shadowBlur = Math.max(2, 10 * z);
                                graphic.shadowColor = '#000';
                            }
                            for (i = 0, l = grid[x][y].lines.length; i < l; i++) {
                                grid[x][y].lines[i].draw(graphic, x * gs * z, y * gs * z);
                            }
                        }
                        context.drawImage(this.cache[key], floor(canvas.width / 2 - this.camera.x * z + x * gs * z), floor(canvas.height / 2 - this.camera.y * z + y * gs * z));
                    }
                    context.strokeStyle = '#000';
                    for (i = 0, l = grid[x][y].objects.length; i < l; i++) {
                        grid[x][y].objects[i].draw();
                    }
                }
            }
        }
        for (var Ay in this.cache) {
            if (DI[Ay] === undefined) {
                delete this.cache[Ay];
            }
        }
        if (canvas.width === 250) {
            return;
        }

        function eraser() {
            context.fillStyle = '#ffb6c1';
            context[beginPath]()[arc](mousePx.x, mousePx.y, (eraserSize - 1) * z, 0, PI2, true)[fill]();
        }
        if (secretlyErasing) {
            eraser();
        } else if (this.currentTool !== TOOL_CAMERA && !this.focalPoint) {
            switch (this.currentTool) {
                case 'line':
                case 'scenery line':
                case 'brush':
                case 'scenery brush':
                    context.lineWidth = 1;
                    context.strokeStyle = '#000';
                    x = mousePx.x;
                    y = mousePx.y;
                    context[beginPath]()[moveTo](x - 10, y)[lineTo](x + 10, y)[moveTo](x, y + 10)[lineTo](x, y - 10)[stroke]();
                    break;
                case 'eraser':
                    eraser();
                    break;
                case 'goal':
                case 'checkpoint':
                case 'bomb':
                case 'slow-mo':
                    context.fillStyle = this.currentTool === TOOL_GOAL ? '#ff0' : this.currentTool === 'checkpoint' ? '#00f' : this.currentTool === 'bomb' ? '#f00' : '#eee';
                    context[beginPath]()[arc](mousePx.x, mousePx.y, 7 * z, 0, PI2, true)[fill]()[stroke]();
                    break;
                case 'boost':
                case 'gravity':
                    context[beginPath]()
                        .fillStyle = this.currentTool === 'boost' ? '#ff0' : '#0f0';
                    context.save();
                    if (!snapFromPrevLine) {
                        context.translate(mousePx.x, mousePx.y);
                    } else {
                        context.translate(lastClick.toPixel(track).x, lastClick.toPixel(track).y);
                        context.rotate(Math.atan2(-(mousePos.x - lastClick.x), mousePos.y - lastClick.y));
                    }
                    context[moveTo](-7 * z, -10 * z)[lineTo](0, 10 * z)[lineTo](7 * z, -10 * z)[lineTo](-7 * z, -10 * z)[fill]()[stroke]()
                        .restore();
                    break;
                default:
                    ;
            }
        }
        context[beginPath]();
        context.fillStyle = '#ff0';
        context.lineWidth = 1;
        context[arc](40, 12, 3.5, 0, PI2, true)[fill]()[stroke]()[beginPath]();
        context.lineWidth = 10;
        context.strokeStyle = '#fff';
        context.fillStyle = '#000';
        var minutes = floor(time / 60000),
            seconds = floor(time % 60000 / 1000),
            millis = floor((time - minutes * 60000 - seconds * 1000) / 100),
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
        } else if (bike && bike.dead) {
            text = 'Press ENTER to restart' + (this.checkpoints.length ? ' or BACKSPACE to cancel Checkpoint' : '');
        } else if (this.id === undefined) {
            //~ text = 'BLACK HAT RIDER';
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
        context.strokeText(text = ': ' + this.targetsReached + ' / ' + this.numTargets + '  -  ' + text, 50, 16);
        context.fillText(text, 50, 16);
        context.textAlign = 'right';
        for (i = 0, l = this.ghostInstances.length; i < l; i++) {
            ghost = this.ghostInstances[i];
            context.fillStyle = (ghost.color !== '#000' && ghost.color) || '#777';
            text = (this.focalPoint === ghost.head ? '>> ' : '') + (ghost.name || 'Ghost') + (ghost.targetsReached === this.numTargets ? ' finished!' : ': ' + ghost.targetsReached + ' / ' + this.numTargets);
            context.strokeText(text, canvas.width - 7, 16 + 17 * i);
            context.fillText(text, canvas.width - 7, 16 + 17 * i);
        }
        context.textAlign = 'left';
        context.fillStyle = '#000';
        if (label) {
            if (!label[0]) {
                context.strokeText(label[2], 36, 15 + label[1] * 25);
                context.fillText(label[2], 36, 15 + label[1] * 25);
            } else {
                context.textAlign = 'right';
                if (doc.documentElement.offsetHeight <= window.innerHeight) {
                    context.strokeText(label[2], canvas.width - 36, 15 + label[1] * 25);
                    context.fillText(label[2], canvas.width - 36, 15 + label[1] * 25);
                } else {
                    context.strokeText(label[2], canvas.width - 51, 15 + label[1] * 25);
                    context.fillText(label[2], canvas.width - 51, 15 + label[1] * 25);
                }
                context.textAlign = 'left';
            }
        }
        if (this.changingThumb) {
            var x0 = (canvas.width - 250) / 2,
                x1 = x0 + 250,
                y0 = (canvas.height - 150) / 2,
                y1 = y0 + 150;
            context.lineWidth = 1;
            context.strokeStyle = '#fff';
            context.fillStyle = 'rgba(0, 0, 0, 0.4)';
            context[fillRect](0, 0, canvas.width, y0)[fillRect](0, y1, canvas.width, y0)[fillRect](0, y0, x0, 150)[fillRect](x1, y0, x0, 150)[strokeRect](x0, y0, 250, 150);
            //context.fillRect(x0, y1, canvas.width - x1, canvas.height - y1);
            //context.fillRect(x1, y0, canvas.width - x1, 150);
        }
        return this;
    }

    checkDelete(eraserPoint) {
        var x = floor(eraserPoint.x / this.gridSize - 0.5),
            y = floor(eraserPoint.y / this.gridSize - 0.5),
            Ix = this.grid[x],
            Ix1 = this.grid[x + 1],
            Ixy, Ixy1, Ix1y, Ix1y1, i, l, deleted = [];

        function del(obj) {
            var b = obj.checkDelete(eraserPoint);
            b && deleted.push(b);
        }
        if (Ix !== undefined) {
            Ixy = Ix[y];
            Ixy1 = Ix[y + 1];
            if (Ixy !== undefined) {
                for (i = 0, l = Ixy.lines.length; i < l; i++) {
                    Ixy.lines[i] && del(Ixy.lines[i]);
                }
                for (i = 0, l = Ixy.scenery.length; i < l; i++) {
                    Ixy.scenery[i] && del(Ixy.scenery[i]);
                }
                for (i = 0, l = Ixy.objects.length; i < l; i++) {
                    Ixy.objects[i] && del(Ixy.objects[i]);
                }
            }
            if (Ixy1 !== undefined) {
                for (i = 0, l = Ixy1.lines.length; i < l; i++) {
                    Ixy1.lines[i] && del(Ixy1.lines[i]);
                }
                for (i = 0, l = Ixy1.scenery.length; i < l; i++) {
                    Ixy1.scenery[i] && del(Ixy1.scenery[i]);
                }
                for (i = 0, l = Ixy1.objects.length; i < l; i++) {
                    Ixy1.objects[i] && del(Ixy1.objects[i]);
                }
            }
        }
        if (Ix1 !== undefined) {
            Ix1y = Ix1[y];
            Ix1y1 = Ix1[y + 1];
            if (Ix1y !== undefined) {
                for (i = 0, l = Ix1y.lines.length; i < l; i++) {
                    Ix1y.lines[i] && del(Ix1y.lines[i]);
                }
                for (i = 0, l = Ix1y.scenery.length; i < l; i++) {
                    Ix1y.scenery[i] && del(Ix1y.scenery[i]);
                }
                for (i = 0, l = Ix1y.objects.length; i < l; i++) {
                    Ix1y.objects[i] && del(Ix1y.objects[i]);
                }
            }
            if (Ix1y1 !== undefined) {
                for (i = 0, l = Ix1y1.lines.length; i < l; i++) {
                    Ix1y1.lines[i] && del(Ix1y1.lines[i]);
                }
                for (i = 0, l = Ix1y1.scenery.length; i < l; i++) {
                    Ix1y1.scenery[i] && del(Ix1y1.scenery[i]);
                }
                for (i = 0, l = Ix1y1.objects.length; i < l; i++) {
                    Ix1y1.objects[i] && del(Ix1y1.objects[i]);
                }
            }
        }
        for (i = 0, l = this.objects.length; i < l; i++) {
            if (this.objects[i] && this.objects[i].doRemove !== undefined) {
                deleted.push(this.objects.splice(i--, 1)[0]);
            }
        }
        return deleted;
    }

    addLine(a, b, scenery) {
        var L = scenery ? SceneryLine : SolidLine,
            line = new L(a.x, a.y, b.x, b.y, this);
        if (line.len >= 2 && line.len < 100000) {
            this.addLineInternal(line);
            if (this.currentTool === 'brush' || this.currentTool === 'line' ||
                this.currentTool === 'scenery brush' || this.currentTool === 'scenery line') {
                if (this.currentTool === 'brush' || this.currentTool === 'line') {
                    lastForeground.copy(mousePos);
                } else {
                    lastScenery.copy(mousePos);
                }
                lastClick.copy(mousePos);
            }
        }
        return line;
    }

    addLineInternal(line) {
        var grids = gridSpread(line.a, line.b, this.gridSize),
            x, y, i, l;
        for (i = 0, l = grids.length; i < l; i++) {
            x = floor(grids[i].x / this.gridSize);
            y = floor(grids[i].y / this.gridSize);
            if (this.grid[x] === undefined) {
                this.grid[x] = {};
            }
            if (this.grid[x][y] === undefined) {
                this.grid[x][y] = new GridBox();
            }
            if (line.isScenery) {
                this.grid[x][y].scenery.push(line);
            } else {
                this.grid[x][y].lines.push(line);
            }
            delete this.cache[x + '_' + y];
        }
    }

    addObject(item) {
        var track = this,
            x = floor(item.pos.x / track.gridSize),
            y = floor(item.pos.y / track.gridSize);
        if (track.grid[x] === undefined) {
            track.grid[x] = {};
        }
        if (track.grid[x][y] === undefined) {
            track.grid[x][y] = new GridBox(x, y);
        }
        track.grid[x][y].objects.push(item);
    }

    selfAdd(arr, known) {
        for (var i = 0, l = arr.length; i < l; i++) {
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
        var grids = gridSpread(Av, BZ, this.gridSize),
            deleted = [];
        for (var i = 0, l = grids.length; i < l; i++) {
            var x = floor(grids[i].x / this.gridSize),
                y = floor(grids[i].y / this.gridSize);
            deleted = deleted.concat(this.grid[x][y].remove());
            delete this.cache[x + '_' + y];
        }
        for (i = 0, l = deleted.length; i < l; i++) {
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
            var x = floor(lastScenery.x / this.gridSize),
                y = floor(lastScenery.y / this.gridSize),
                line = this.grid[x][y].scenery[this.grid[x][y].scenery.length - 1];
            if (line && line.b.x === round(lastScenery.x) && line.b.y === round(lastScenery.y)) {
                line.doRemove = true;
                lastScenery.copy(line.a);
                this.remove(line.a, line.b);
            } else {
                alert('No more scenery line to erase!');
            }
        } else {
            var x = floor(lastForeground.x / this.gridSize),
                y = floor(lastForeground.y / this.gridSize),
                line = this.grid[x][y].lines[this.grid[x][y].lines.length - 1];
            if (line !== undefined && line.b.x === round(lastForeground.x) && line.b.y === round(lastForeground.y)) {
                line.doRemove = true;
                lastForeground.copy(line.a);
                this.remove(line.a, line.b);
            } else {
                alert('No more line to erase!');
            }
        }
    }

    all() {
        var result = { lines: [], scenery: [], objects: [], bike: this.currentBike },
            box, x, y;
        for (x in this.grid) {
            for (y in this.grid[x]) {
                box = this.grid[x][y];
                combine(result.lines, box.lines);
                combine(result.scenery, box.scenery);
                combine(result.objects, box.objects);
            }
        }
        return result;
    }

    toString() {
        var lines = '',
            scenery = '',
            objects = '';
        for (var x in this.grid) {
            for (var y in this.grid[x])
                if (this.grid[x][y].lines) {
                    for (var P = 0; P < this.grid[x][y].lines.length; P++) {
                        if (!this.grid[x][y].lines[P].stringGot) {
                            lines += this.grid[x][y].lines[P].a + this.grid[x][y].lines[P].getEnd() + ',';
                        }
                    }
                    for (var v = 0; v < this.grid[x][y].scenery.length; v++) {
                        if (!this.grid[x][y].scenery[v].stringGot) {
                            scenery += this.grid[x][y].scenery[v].a + this.grid[x][y].scenery[v].getEnd() + ',';
                        }
                    }
                    for (var j = 0; j < this.grid[x][y].objects.length; j++) {
                        objects += this.grid[x][y].objects[j] + ',';
                    }
                }
        }
        for (var x in this.grid) {
            for (var y in this.grid[x])
                if (this.grid[x][y].lines) {
                    for (var P = 0; P < this.grid[x][y].lines.length; P++) {
                        this.grid[x][y].lines[P].stringGot = false;
                    }
                    for (var v = 0; v < this.grid[x][y].scenery.length; v++) {
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