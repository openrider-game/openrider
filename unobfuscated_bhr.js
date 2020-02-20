import { BMX } from "./class/bike/BMX.js";
import { Harley } from "./class/bike/Harley.js";
import { MTB } from "./class/bike/MTB.js";
import { Bomb } from "./class/item/Bomb.js";
import { Boost } from "./class/item/Boost.js";
import { Checkpoint } from "./class/item/Checkpoint.js";
import { Gravity } from "./class/item/Gravity.js";
import { SlowMo } from "./class/item/SlowMo.js";
import { Target } from "./class/item/Target.js";
import { Point } from "./class/Point.js";
import { GridBox } from "./class/track/GridBox.js";
import { Track } from "./class/track/Track.js";
import { arc, beginPath, fill, moveTo } from "./class/utils/DrawUtils.js";
import { ceil, floor, PI2, pow, round } from "./class/utils/MathUtils.js";
import { SurvivalTrack } from "./class/track/SurvivalTrack.js";
import { MIN_SIZE, GHOST_COLORS, TRACK_DEFAULT } from "./class/constant/TrackConstants.js";
import { TOOL_SLINE, TOOL_SBRUSH, TOOL_BRUSH, TOOL_LINE, TOOL_ERASER, TOOL_CAMERA, TOOL_GOAL, TOOL_CHECKPOINT, TOOL_BOOST, TOOL_GRAVITY, TOOL_BOMB, TOOL_SLOWMO } from "./class/constant/ToolConstants.js";
import { GhostString } from "./class/helper/GhostString.js";

/**
 * @define {boolean}
 */
const COMPILED = false;
export const DEBUG = !COMPILED;

export const doc = document;
const body = doc.body;

function isFunction(obj) { return typeof obj === 'function'; }

/** DOMinate by Adrian Sieber */
/**
 * @param {Array} array Array containing the DOM fragment in JsonML
 * @param {string=} namespace
 * @param {Object=} returnObject
 * @return {Object}
 */
function $$createElement(sugarString, ns) {
    var element = doc.createElementNS(ns, sugarString.match(/^\w+/)[0]),
        id, ref, classNames;
    if (id = sugarString.match(/#([\w-]+)/)) {
        element.id = id[1];
    }
    if (classNames = sugarString.match(/\.[\w-]+/g)) {
        element.setAttribute('class', classNames.join(' ').replace(/\./g, ''));
    }
    return element;
}

function dom(array, ns, returnObject) {

    var doc = document,
        i, b;

    if (array && array.big) {
        return doc.getElementById(array);
    }

    returnObject = returnObject || {}
    ns = ns || 'http://www.w3.org/1999/xhtml'

    if (array[0].big) {
        array[0] = $$createElement(array[0], ns);
    }

    for (i = 1; i < array.length; i++) {
        // if is string has to be content so set it
        if (array[i].big) {
            array[0].appendChild(doc.createTextNode(array[i]));
        }
        // if is array has to be child element
        else if (array[i].pop) {
            // if is string create DOM element else is already a DOM element
            if (array[i][0].big) array[i][0] = $$createElement(array[i][0], ns);
            array[0].appendChild(array[i][0]);
            // Use DOMinate recursively for all child elements
            dom(array[i], ns, returnObject);
        }
        // if is function call with current element as first argument
        else if (array[i].call) {
            array[i](array[0]);
        }
        // else must be object with attributes
        else {
            for (b in array[i]) {
                array[0].setAttribute(b, array[i][b]);
            }
        }

    }

    //Return root element on index 0
    returnObject[0] = array[0];

    //returns object containing all elements with an id and the root element
    return returnObject[0];
}

export function mix(target, source) {
    for (var key in source)
        if (source.hasOwnProperty(key)) {
            target[key] = source[key];
        }
}

function _include(arr, n) {~arr.indexOf(n) || arr.push(n) }

export function combine(arr, n) {
    for (var i = 0, l = n.length; i < l; i++) _include(arr, n[i]);
    return this;
}

// Split lines over grid helper
var spreadCache = {};

export function gridSpread(_from, _to, q) {
    if (!spreadCache[q]) {
        spreadCache[q] = {};
    }
    var key = _from + ';' + _to;
    if (spreadCache[q][key]) {
        return spreadCache[q][key];
    }
    var lines = spreadCache[q][key] = [],
        from = new Point(_from.x, _from.y),
        factor = (_to.y - _from.y) / (_to.x - _from.x),
        direction = new Point(_from.x < _to.x ? 1 : -1, _from.y < _to.y ? 1 : -1),
        i = 0;
    lines.push(_from);
    while (i < 5000) {
        if (floor(from.x / q) === floor(_to.x / q) && floor(from.y / q) === floor(_to.y / q)) {
            break;
        }
        var to1 = new Point(
            direction.x < 0 ? round(ceil((from.x + 1) / q + direction.x) * q) - 1 : round(floor(from.x / q + direction.x) * q), 0
        );
        to1.y = round(_from.y + (to1.x - _from.x) * factor);
        var to2 = new Point(
            0, direction.y < 0 ? round(ceil((from.y + 1) / q + direction.y) * q) - 1 : round(floor(from.y / q + direction.y) * q)
        );
        to2.x = round(_from.x + (to2.y - _from.y) / factor);
        // Take the shortest line piece
        if (pow(to1.x - _from.x, 2) + pow(to1.y - _from.y, 2) < pow(to2.x - _from.x, 2) + pow(to2.y - _from.y, 2)) {
            from = to1;
            lines.push(to1);
        } else {
            from = to2;
            lines.push(to2);
        }
        i++;
    }
    return lines;
}

// Error
if (!doc.createElement('canvas').getContext) {
    location.href = 'http://canvasrider.com/error';
}

// Initialize canvas
export var canvas = doc.getElementById('canvas_rider'),
    context = canvas.getContext('2d');
context.lineCap = 'round';
context.lineJoin = 'round';
context.font = '8px eiven';

var setPixel = function(x, y, c) {
    var o = context.fillStyle;
    context.fillStyle = c || '#f00';
    context
        [beginPath]()[moveTo](x, y)[arc](x, y, 2, 0, PI2, false)[fill]()
        .fillStyle = o;
};

// Chainable and short Canvas methods
function chain(fn, val) {
    return function() {
        fn.apply(val, arguments);
        return val;
    }
}
for (var i in context)
    if (isFunction(context[i])) {
        context['_' + i] = chain(context[i], context);
    }

    // Lots of init
export var track,
    // Pressed keys
    left = 0,
    right = 0,
    up = 0,
    down = 0,
    turn = 0,
    // Snapping
    snapFromPrevLine = false,
    // Last Clicks
    lastClick = new Point(40, 50),
    mousePos = new Point(0, 0),
    // Drawing sizes
    drawingSize = 20,
    eraserSize = 15,
    // ??
    shift = false,
    // Editor Tooling
    backToLastTool = false,
    secretlyErasing = false,
    // Selected Tool label
    label = [],
    // Grid Detail
    gridDetail = 1,
    // Track managers
    intv, instances = [],
    // Shade Lines
    shadeLines = false,
    // Labels
    hints = [
        ['', 'Restart ( ENTER )', 'Cancel Checkpoint ( BACKSPACE )', '', 'Switch bike ( B - Arrows to control, Z to turn )', '', 'Enable line shading', 'Enable fullscreen ( F )'],
        ['Brush ( A - Hold to snap, hold & scroll to adjust size )', 'Scenery brush ( S - Hold to snap, hold & scroll to adjust size )', 'Lines ( backWheel - Hold to snap )', 'Scenery lines ( W - Hold to snap )', 'Eraser ( E - Hold & scroll to adjust size )', 'Camera ( R - Release or press again to switch back, scroll to zoom )', 'Enable grid snapping ( G )', '', 'Goal', 'Checkpoint', 'Boost', 'Gravity modifier', 'Bomb', 'Slow-Mo', '', 'Shorten last line ( Z )']
    ],
    // Last clicks
    lastForeground = new Point(40, 50),
    lastScenery = new Point(-40, 50),
    // DOM
    trackcode = dom('trackcode'),
    charcount = dom('charcount'),
    contentElement = dom('content'),
    newButton = dom('new'),
    loadButton = dom('load'),
    saveButton = dom('save'),
    uploadButton = dom('upload'),
    toolbar1 = dom('toolbar1'),
    toolbar2 = dom('toolbar2');

mix(toolbar1.style, {
    top: canvas.offsetTop + 'px',
    left: canvas.offsetLeft + 'px',
    display: 'block'
});

mix(toolbar2.style, {
    top: canvas.offsetTop + 'px',
    left: canvas.offsetLeft + canvas.width - 22 + 'px'
});

function canvas_ride(id, ghosts) {
    small();
    if (id === 'SURVIVAL') {
        var t = new SurvivalTrack();
    } else {
        var t = new Track(id);
        t.ghosts = ghosts;
    }
    t.bike = t.currentBike === 'BMX' ? new BMX(t) : t.currentBike === 'HAR' ? new Harley(t) : new MTB(t);
    t.focalPoint = t.bike.head;
    instances.push(function() {
        t.proceed();
    });
    return track = t;
}

intv = setInterval(function() {
    for (var i = instances.length; i--;) {
        instances[i]();
    }
}, 40);

export function watchGhost(ID, track) {
    if (track.ghost.contains(ID)) {
        return;
    }
    fetch(new Request('ghost/load', { method: 'POST', body: 'id=' + ID })).then(function(ghostStr) {
        var ghostArr = GhostString.parse(ghostStr);
        // t.ghostKeys = ghostArr;
        // t.ghost = ghostArr[5];
        track.ghostKeys.push(ghostArr);
        ghostArr.color = GHOST_COLORS[track.ghostInstances.length % GHOST_COLORS.$length];
        track.ghost.push(ID);
        track.reset();
    });
}

function switchBikes() {
    track.currentBike = track.currentBike === 'BMX' ? 'MTB' : 'BMX';
    track.reset();
}

function erase() {
    var deleted = track.checkDelete(mousePos);
    deleted.length && track.pushUndo(function() {
        track.selfAdd(deleted, true);
    }, function() {
        for (var i = 0, l = deleted.length; i < l; i++) {
            deleted[i].remove();
        }
    });
}

function big() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'fixed';
    canvas.style.top =
        canvas.style.left = 0;
    canvas.style.border = 'none';
    toolbar2.style.left = canvas.width - (doc.documentElement.offsetHeight <= window.innerHeight ? 24 : 39) + 'px';
    label[2] = hints[0][7] = 'Disable fullscreen ( ESC or F )';
    window.scrollTo(0, 0);
    canvas.style.zIndex = 2000;
    toolbar1.style.zIndex = toolbar2.style.zIndex = 2001;
    document.body.style.overflowY = 'hidden';
}

function small() {
    canvas.width = 700;
    canvas.height = 400;
    canvas.style.position = 'static';
    canvas.style.border = '1px solid black';
    toolbar2.style.left = (canvas.offsetLeft + canvas.width - 22) + 'px';
    label[2] = hints[0][7] = 'Enable fullscreen ( F )';
    canvas.style.zIndex = toolbar1.style.zIndex = toolbar2.style.zIndex = 2;
    document.body.style.overflowY = 'scroll';
}

function afterResize() {
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.font = '8px eiven';
    toolbar1.style.top = toolbar2.style.top = canvas.offsetTop + 'px';
    toolbar1.style.left = canvas.offsetLeft + 'px';
}

window.onresize = function() {
    (canvas.width === 700 ? small : big)();
    afterResize();
};

function toggleFullscreen() {
    (canvas.width === 700 ? big : small)();
    afterResize();
}

function fixTyping(el) {
    el.addEventListener('focus', rmEvts);
    el.addEventListener('blur', addEvts);
}

doc.onkeydown = function(event) {
    var ctrl = event.ctrlKey;
    switch (event.keyCode) {
        case 8:
            {
                // backspace
                if (canvas.width !== 250) {
                    event.preventDefault();
                }
                track.checkpoints.pop();
                track.restart();
                break;
            }
        case 13:
            {
                // enter
                event.preventDefault();
                track.restart();
                break;
            }
        case 37:
            {
                // left
                if (track.bike) {
                    event.preventDefault();
                    track.focalPoint = track.bike.head;
                    left = 1;
                }
                break;
            }
        case 39:
            {
                // right
                if (track.bike) {
                    event.preventDefault();
                    track.focalPoint = track.bike.head;
                    right = 1;
                }
                break;
            }
        case 38:
            {
                // up
                if (track.bike) {
                    event.preventDefault();
                    track.focalPoint = track.bike.head;
                    up = 1;
                }
                break;
            }
        case 40:
            {
                // down
                if (track.bike) {
                    event.preventDefault();
                    track.focalPoint = track.bike.head;
                    down = 1;
                }
                break;
            }
        case 109:
        case 189:
            {
                // minus
                zoom(-1);
                break;
            }
        case 107:
        case 187:
            {
                // plus
                zoom(1);
                break;
            }
        case 90:
        case 222:
            {
                // Z
                if (!track.focalPoint && track.id === undefined) {
                    track.shortenLastLineSet();
                } else {
                    track.bike.doTurn = 1;
                }
                break;
            }
        case 32:
            {
                // space
                if (canvas.width !== 250) {
                    event.preventDefault();
                }
                track.paused = !track.paused;
                break;
            }
    }
    if (track.id === undefined) {
        switch (event.keyCode) {
            case 65:
                // A
                if (track.currentTool !== 'brush') {
                    track.currentTool = 'brush';
                    body.style.cursor = 'none';
                    shift = true;
                } else if (!snapFromPrevLine) {
                    snapFromPrevLine = true;
                    lastClick.copy(lastForeground);
                    shift = true;
                }
                break;
            case 83:
                // S
                if (track.currentTool !== 'scenery brush') {
                    track.currentTool = 'scenery brush';
                    body.style.cursor = 'none';
                    shift = true;
                } else if (!snapFromPrevLine) {
                    snapFromPrevLine = true;
                    lastClick.copy(lastScenery);
                    shift = true;
                }
                break;
            case 81:
                // Q
                if (track.currentTool !== 'line') {
                    track.currentTool = 'line';
                    body.style.cursor = 'none';
                } else if (!snapFromPrevLine) {
                    snapFromPrevLine = true;
                    lastClick.copy(lastForeground);
                    shift = true;
                }
                break;
            case 87:
                // W
                if (track.currentTool !== 'scenery line') {
                    track.currentTool = 'scenery line';
                    body.style.cursor = 'none';
                } else if (!snapFromPrevLine) {
                    snapFromPrevLine = true;
                    lastClick.copy(lastScenery);
                    shift = true;
                }
                break;
            case 69:
                // E
                track.currentTool = 'eraser';
                body.style.cursor = 'none';
                shift = true;
                break;
            case 82:
                // R
                if (track.currentTool !== 'camera') {
                    track.lastTool = track.currentTool;
                    track.currentTool = 'camera';
                    body.style.cursor = 'move';
                } else {
                    backToLastTool = true;
                }
                break;
            case 77: // M
                track.undo();
                break;
            case 78: // N
                track.redo();
                break;
            default:
                ;
        }
    }
};
doc.onkeypress = function(event) {
    switch (event.keyCode) {
        case 13: // enter
        case 37: // left
        case 39: // right
        case 38: // up
        case 40: // down
            event.preventDefault();
            break;
        case 8: // backspace
        case 32: // space
            if (canvas.width !== 250) {
                event.preventDefault();
            }
            break;
        case 113: // Q
            track.bike.doSave = DEBUG;
        default:
            ;
    }
};
doc.onkeyup = function(event) {
    switch (event.keyCode) {
        case 70: // f
        case 27: // esc
            toggleFullscreen();
            break;
        case 66: // B
            switchBikes();
            break;
        case 37: // left
            left = 0;
            break;
        case 39: // right
            right = 0;
            break;
        case 38: // up
            up = 0;
            break;
        case 40: // down
            down = 0;
            break;
        case 90:
        case 222: // Z
            break;
        case 71: // (G)
            // ghost lock
            if (track.ghostInstances.length) {
                var focalPoint = track.bike.head;
                if (track.focalPoint === track.bike.head) {
                    focalPoint = track.ghostInstances[0].head;
                }
                for (var ghost, i = 0, l = track.ghostInstances.length - 1; i < l; i++) {
                    ghost = track.ghostInstances[i];
                    if (track.focalPoint === ghost.head) {
                        focalPoint = track.ghostInstances[i + 1].head;
                        break;
                    }
                }
                track.focalPoint = focalPoint;
            }
            // grid snapping
            else {
                gridDetail = 11 - gridDetail;
                hints[1][6] = (gridDetail === 1 ? 'En' : 'Dis') + "able grid snapping ( G )";
            }
            break;
        case 82: // R (camera toggle)
            if (backToLastTool) {
                track.currentTool = track.lastTool;
                body.style.cursor = 'none';
                backToLastTool = false;
            }
            break;
        case 49: // 1
        case 50: // 2
        case 51: // 3
        case 52: // 4
        case 53: // 5
        case 54: // 6
        case 55: // 7
        case 56: // 8
        case 57: // 9
        case 58: // 0
            if (track.id !== undefined) {
                track._watchGhost(event.keyCode - 48);
            }
            break;
        case 81: // Q
        case 87: // W
        case 69: // E
        case 83: // S
            if (track.ghostInstances.length) {
                // stop focused ghost
                return;
            }
        case 65: // A
            if (shift) {
                shift =
                    snapFromPrevLine = false;
            }
            break;
        default:
            ;
    }
};
toolbar1.onmousemove = function(event) {
    var pos = floor((event.clientY - toolbar1.offsetTop + window.pageYOffset) / 25);
    label = [0, pos, hints[0][pos]];
};
toolbar2.onmousemove = function(event) {
    var pos = floor((event.clientY - toolbar2.offsetTop + window.pageYOffset) / 25);
    label = [1, pos, hints[1][pos]];
    if (pos === 14) {
        if (track.currentTool === TOOL_SLINE || track.currentTool === TOOL_SBRUSH) {
            label[2] = 'Shorten last set of scenery lines ( Z )';
        }
    }
};
toolbar1.onmousedown = function(event) {
    track.focalPoint = false;
    switch (floor((event.clientY - toolbar1.offsetTop + window.pageYOffset) / 25) + 1) {
        case 1:
            track.paused = !track.paused;
            break;
        case 3:
            track.checkpoints.pop();
        case 2:
            track.restart();
            break;
        case 5:
            switchBikes();
            break;
        case 7:
            if (!shadeLines) {
                shadeLines = true;
                label[2] = hints[0][6] = "Disable line shading";
            } else {
                shadeLines = false;
                label[2] = hints[0][6] = "Enable line shading";
            }
            track.cache = [];
            break;
        case 8:
            toggleFullscreen();
            break;
        default:
            ;
    }
};
toolbar2.onmousedown = function(event) {
    if (track.id) return false;
    track.focalPoint = false;
    switch (floor((event.clientY - toolbar1.offsetTop + window.pageYOffset) / 25) + 1) {
        case 1:
            track.currentTool = TOOL_BRUSH;
            break;
        case 2:
            track.currentTool = TOOL_SBRUSH;
            break;
        case 3:
            track.currentTool = TOOL_LINE;
            break;
        case 4:
            track.currentTool = TOOL_SLINE;
            break;
        case 5:
            track.currentTool = TOOL_ERASER;
            break;
        case 6:
            track.currentTool = TOOL_CAMERA;
            break;
        case 7:
            if (gridDetail === 1) {
                gridDetail = 10;
                label[2] = hints[1][6] = "Disable grid snapping ( G )";
            } else {
                gridDetail = 1;
                label[2] = hints[1][6] = "Enable grid snapping ( G )";
            }
            break;
        case 9:
            track.currentTool = TOOL_GOAL;
            break;
        case 10:
            track.currentTool = TOOL_CHECKPOINT;
            break;
        case 11:
            track.currentTool = TOOL_BOOST;
            break;
        case 12:
            track.currentTool = TOOL_GRAVITY;
            break;
        case 13:
            track.currentTool = TOOL_BOMB;
            break;
        case 14:
            track.currentTool = TOOL_SLOWMO;
            break;
        case 16:
            track.shortenLastLineSet();
            break;
        default:
            ;
    }
};
canvas.onmouseover = function() {
    label = [];
    body.style.cursor = track.currentTool === TOOL_CAMERA ? 'move' : 'none';
};
canvas.onmousedown = function(event) {
    event.preventDefault();
    snapFromPrevLine = true;
    track.focalPoint = false;

    if (event.button === 2 && track.currentTool !== TOOL_CAMERA) {
        erase();
        secretlyErasing = true;
        return;
    }
    var item;
    if (!shift) {
        lastClick.copy(mousePos);
    }
    switch (track.currentTool) {
        case TOOL_BOOST:
        case TOOL_GRAVITY:
            body.style.cursor = 'crosshair';
            break;
        case TOOL_ERASER:
            erase();
            break;
        case TOOL_GOAL:
            track.objects.push(item = new Target(lastClick.x, lastClick.y, track));
            track.numTargets++;
            break;
        case TOOL_CHECKPOINT:
            track.objects.push(item = new Checkpoint(lastClick.x, lastClick.y, track));
            break;
        case TOOL_BOMB:
            item = new Bomb(lastClick.x, lastClick.y, track);
            break;
        case TOOL_SLOWMO:
            item = new SlowMo(lastClick.x, lastClick.y, track);
        case TOOL_BRUSH:
        case TOOL_SBRUSH:
            if (shift) {
                track.addLine(lastClick, mousePos, track.currentTool !== TOOL_BRUSH);
            }
            shift = false;
            snapFromPrevLine = true;
            break;
        default:
            ;
    }
    if (item !== undefined) {
        var x = floor(item.pos.x / track.gridSize);
        var y = floor(item.pos.y / track.gridSize);
        if (track.grid[x] === undefined) {
            track.grid[x] = [];
        }
        if (track.grid[x][y] === undefined) {
            track.grid[x][y] = new GridBox(x, y);
        }
        track.grid[x][y].objects.push(item);
        track.pushUndo(function() {
            item.remove();
        }, function() {
            item instanceof Target && ++track.numTargets;
            track.grid[x][y].objects.push(item);
        });
    }
};
canvas.oncontextmenu = function(event) {
    event.preventDefault();
};
doc.onmousemove = function(event) {
    if (track.currentTool !== TOOL_CAMERA) {
        track.focalPoint = false;
    }
    mousePos = new Point(
        event.clientX - canvas.offsetLeft,
        event.clientY - canvas.offsetTop + window.pageYOffset
    ).normalizeToCanvas();
    if (track.currentTool !== TOOL_ERASER && event.button !== 2) {
        mousePos.x = round(mousePos.x / gridDetail) * gridDetail;
        mousePos.y = round(mousePos.y / gridDetail) * gridDetail;
    }
    if (snapFromPrevLine) {
        if (track.currentTool === TOOL_CAMERA) {
            track.camera.selfAdd(lastClick.cloneSub(mousePos));
            mousePos.copy(lastClick);
        } else if (track.currentTool === TOOL_ERASER || event.button === 2) {
            erase();
        } else if (!shift && (track.currentTool === TOOL_BRUSH || track.currentTool === TOOL_SBRUSH) && lastClick.distanceTo(mousePos) >= drawingSize) {
            var line = track.addLine(lastClick, mousePos, track.currentTool !== TOOL_BRUSH);
            track.pushUndo(function() {
                line.remove();
            }, function() {
                line.reAdd();
            });
        }
    }
};
canvas.onmouseup = function() {
    var x, y, item, direction;
    if (secretlyErasing) {
        return secretlyErasing = false;
    }
    if (snapFromPrevLine) {
        if (track.currentTool === TOOL_LINE || track.currentTool === TOOL_SLINE ||
            track.currentTool === TOOL_BRUSH || track.currentTool === TOOL_SBRUSH) {
            var line = track.addLine(lastClick, mousePos, track.currentTool !== TOOL_LINE && track.currentTool !== TOOL_BRUSH);
            track.pushUndo(function() {
                line.remove();
            }, function() {
                line.reAdd();
            });
        } else if (track.currentTool === TOOL_BOOST || track.currentTool === TOOL_GRAVITY) {
            body.style.cursor = 'none';
            direction = round(Math.atan2(-(mousePos.x - lastClick.x), mousePos.y - lastClick.y) * 180 / Math.PI);
            item = track.currentTool === TOOL_BOOST ? new Boost(lastClick.x, lastClick.y, direction, track) :
                new Gravity(lastClick.x, lastClick.y, direction, track);
            x = floor(item.pos.x / track.gridSize);
            y = floor(item.pos.y / track.gridSize);
            if (track.grid[x] === undefined) {
                track.grid[x] = [];
            }
            if (track.grid[x][y] === undefined) {
                track.grid[x][y] = new GridBox(x, y);
            }
            track.grid[x][y].objects.push(item);
            track.pushUndo(function() {
                item.remove();
            }, function() {
                track.grid[x][y].objects.push(item);
            });
        }
    }
};
doc.onmouseup = function() {
    if (!shift) {
        snapFromPrevLine = false;
    }
};
canvas.onmouseout = function() {
    body.style.cursor = 'default';
};

newButton && (newButton.onclick = function() {
    if (confirm('Do you really want to start a new track?')) {
        instances.pop();
        track = canvas_ride(TRACK_DEFAULT, []);
        charcount.innerHTML = 'trackcode';
        trackcode.value = null;
        track.reset();
    }
});
loadButton && (loadButton.onclick = function() {
    if (trackcode.value.length > 10) {
        instances.pop();
        track = canvas_ride(trackcode.value, []);
        charcount.innerHTML = "Trackcode";
        trackcode.value = null;
        track.reset();
    } else {
        alert("No trackcode to load!");
    }
});
saveButton && (saveButton.onclick = function() {
    if (track.id === undefined) {
        trackcode.value = track.toString();
        trackcode.select();
        charcount.innerHTML = "Trackcode - " + round(trackcode.value.length / 1000) + "k - CTRL + C to copy";
    }
});
uploadButton && (uploadButton.onclick = function() {
    var trackcode = track.toString();
    if (trackcode.length > MIN_SIZE) {
        // pause the track and select the camera tool
        track.paused = true;
        track.currentTool = TOOL_CAMERA;
        // start thumb-changing mode and hide superfluous things.
        changeThumb(true);
        toolbar1.style.display = 'none';
        toolbar2.style.display = 'none';
        context.lineCap = 'round';
        context.lineJoin = 'round';
        doc.getElementById('track_menu').style.display = 'none';

        // build options & messages DOM
        var inputName = dom(['input#name.input-block-level', { type: 'text', size: 18, maxlength: 20, placeholder: 'Name...' }]),
            inputDesc = dom(['textarea.input-block-level', { rows: 4, placeholder: 'Description...' }]),
            submit = dom(['input.btn.btn-primary.btn-block.btn-large', { type: 'submit', value: 'Save track' }]),
            optVisibility = dom(['div.span3', 'Visibility:']),
            optVisibilities = dom(['div.btn-group.span9', { 'data-toggle': 'buttons-radio' },
                ['button.btn#optPublic.active', ['i.icon-globe'], ' Public'],
                ['button.btn#optHidden', ['i.icon-eye-close'], ' Hidden'],
                ['button.btn#optPrivate', ['i.icon-lock'], ' Private']
            ]),
            listTags = dom(['input.span12', { placeholder: 'Partners...', type: 'text' }]),
            optCollabTarget = dom(['div.span5']),
            optCollab = dom([
                'label.hide.row-fluid', ['div.span3', 'Collaboration with: '],
                ['div.span4', [listTags]],
                [optCollabTarget]
            ]),
            optsRadios = dom(['div.row-fluid']),
            adjustMessage = dom(['div']),
            tagif,
            well = dom(['div.well.row-fluid#track_menu']);

        // styling of new elements
        adjustMessage.style.color = canvas.style.borderColor = '#f00';
        adjustMessage.innerHTML = 'Use your mouse to drag & fit an interesting part of your track in the thumbnail';
        optCollab.style.lineHeight = optVisibility.style.lineHeight = '30px';

        function appendChild(el) {
            var args = [].slice.call(arguments, 1),
                i = 0,
                l = args.length;
            for (; i < l; i++) {
                el.appendChild(args[i]);
            }
            return el;
        }
        // footer
        appendChild(well, inputName, inputDesc,
            appendChild(optsRadios, optVisibility, optVisibilities),
            //~ optCollab,
            submit);
        // header piece before canvas, footer piece below canvas.
        contentElement.insertBefore(well, canvas.nextSibling);
        contentElement.insertBefore(adjustMessage, canvas);

        // add events
        fixTyping(inputName);
        inputName.addEventListener('keypress', function(e) {
            e.stopPropagation();
        }, false);
        inputName.focus();

        fixTyping(listTags);
        fixTyping(inputDesc);

        submit.addEventListener('click', function() {
            var thumb = doc.createElement('canvas');
            var name, image, desc, partners, tmp, trackID, request;

            // get proper upsized thumbnail
            thumb.width = 500;
            thumb.height = 300;
            // Caching the track cache. How meta.
            track.zoomFactor = track.zoomFactor * 2;
            tmp = track.cache;
            track.cache = {};
            changeThumb(false);
            track.draw();
            thumb.getContext('2d')
                .drawImage(canvas,
                    (canvas.width - 500) / 2, (canvas.height - 300) / 2,
                    500, 300,
                    0, 0,
                    500, 300);
            track.zoomFactor = track.zoomFactor / 2;
            track.cache = tmp;

            image = thumb.toDataURL('image/png');
            if (image === 'asdf') { alert('The thumbnail is blank!\nDrag & fit an interesting part of your track inside.'); return false; }

            name = inputName.value;
            if (name.length < 4) { alert('The track name is too short!'); return false; }

            desc = inputDesc.value;
            //~ partners = tagif.getTags().map(function (n) { return map[n].toInt(); });

            submit.disabled = true;
            request = new XMLHttpRequest();
            request.open('POST', '/tracks/save', false);
            request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            request.send(
                'n=' + encodeURIComponent(name) +
                '&c=' + encodeURIComponent(trackcode) +
                '&d=' + encodeURIComponent(desc) +
                '&p=' + encodeURIComponent($(optVisibilities).getElement('.active').get('id'))
            );
            trackID = JSON.parse(request.responseText);
            if (typeof trackID === 'string') { alert('Your track was refused: ' + trackID); return false; }
            request = new XMLHttpRequest();
            request.open('POST', '/tracks/thumbnail/' + trackID, false);
            request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            request.send(image.replace('data:image/png;base64,', 'i='));
            location.href = '/tracks/' + trackID;
        });
    } else {
        alert('Sorry, but your track must be bigger or more detailed.');
        return false;
    }
});

function zoom(way) {
    if ((way < 0 && track.zoomFactor > 0.2) || (way > 0 && track.zoomFactor < 4)) {
        track.zoomFactor = round(track.zoomFactor * 10 + 2 * way) / 10;
        track.cache = {};
    }
}

function onScroll(e) {
    e.preventDefault();
    if (shift) {
        if (track.currentTool === TOOL_ERASER) {
            if ((e.detail > 0 || e.wheelDelta < 0) && eraserSize > 5) { eraserSize -= 5; } else if ((e.detail < 0 || e.wheelDelta > 0) && eraserSize < 40) { eraserSize += 5; }
        } else if (track.currentTool === TOOL_BRUSH || track.currentTool === TOOL_SBRUSH) {
            if ((e.detail > 0 || e.wheelDelta < 0) && drawingSize > 4) { drawingSize -= 8; } else if ((e.detail < 0 || e.wheelDelta > 0) && drawingSize < 200) { drawingSize += 8; }
        }
    } else {
        if (e.detail > 0 || e.wheelDelta < 0) { zoom(-1); } else if (e.detail < 0 || e.wheelDelta > 0) { zoom(1); }
    }
    var Cw = new Point(
        e.clientX - canvas.offsetLeft,
        e.clientY - canvas.offsetTop + window.pageYOffset
    ).normalizeToCanvas();
    if (!track.focalPoint) {
        track.camera.selfAdd(mousePos.cloneSub(Cw));
    }
}
canvas.addEventListener('DOMMouseScroll', onScroll, false);
canvas.addEventListener('mousewheel', onScroll, false);

var evts;

function rmEvts() {
    evts = {
        kd: doc.onkeydown,
        kp: doc.onkeypress,
        ku: doc.onkeyup
    };

    doc.onkeydown = doc.onkeypress = doc.onkeyup = function() {};
}

function addEvts() {
    if (evts) {
        doc.onkeydown = evts.kd;
        doc.onkeypress = evts.kp;
        doc.onkeyup = evts.ku;

        evts = false;
    }
}

function changeThumb(on) {
    track.changingThumb = on !== false;
}

function getTrack() { return track; }

export default {
    game: {
        'ride': canvas_ride,
        'watchGhost': watchGhost,
        'detach': rmEvts,
        'attach': addEvts,
        'changeThumb': changeThumb
    },
    track: getTrack,
    TRACK_MIN_SIZE: MIN_SIZE
};