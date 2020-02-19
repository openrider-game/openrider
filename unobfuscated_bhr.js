import { Point } from "./class/Point.js";
import { BodyPart } from "./class/bike/part/BodyPart.js";
import { Wheel } from "./class/bike/part/Wheel.js";
import { Joint } from "./class/Joint.js";
import { BMX } from "./class/bike/BMX.js";
import { MTB } from "./class/bike/MTB.js";
import { Harley } from "./class/bike/Harley.js";
import { Boost } from "./class/item/Boost.js";
import { Target } from "./class/item/Target.js";
import { Checkpoint } from "./class/item/Checkpoint.js";
import { Gravity } from "./class/item/Gravity.js";
import { Bomb } from "./class/item/Bomb.js";
import { SlowMo } from "./class/item/SlowMo.js";
import { SolidLine } from "./class/track/SolidLine.js";
import { SceneryLine } from "./class/track/SceneryLine.js";
import { GridBox } from "./class/track/GridBox.js";
import { beginPath, arc, moveTo, stroke, lineTo, fill, fillText, fillRect, strokeRect } from "./class/utils/DrawUtils.js";
import { PI2, cos, sin, floor, round, ceil, pow, toInt, rand } from "./class/utils/MathUtils.js";

// ==ClosureCompiler==
// @output_file_name v1.js
// @compilation_level ADVANCED_OPTIMIZATIONS
// ==/ClosureCompiler==

/**
 * @fileoverview
 * @suppress {globalThis}
 */

/**
 * @define {boolean}
 */
const COMPILED = false;
export const DEBUG = !COMPILED;

export const MIN_TIME = 0; // 5000;
const MIN_SIZE = 0;
export const SAVE_CHECKPOINT = 1;
export const SAVE_TARGET = 2;
const ABSTRACT_FN = function() { throw new Error('abstract method'); };
const doc = document;
const body = doc.body;
export const proto = 'prototype';

// Constants
const
    TRACKSTRING_OLD = 0,
    TRACKSTRING_NEW = 1,

    TOOL_CAMERA = 'camera',
    TOOL_LINE = 'line',
    TOOL_SLINE = 'scenery line',
    TOOL_BRUSH = 'brush',
    TOOL_SBRUSH = 'scenery brush',
    TOOL_GRAVITY = 'gravity',
    TOOL_BOOST = 'boost',
    TOOL_CHECKPOINT = 'checkpoint',
    TOOL_SLOWMO = 'slow-mo',
    TOOL_GOAL = 'goal',
    TOOL_BOMB = 'bomb',
    TOOL_ERASER = 'eraser',

    BIKE_BMX = 'BMX',
    BIKE_MTB = 'MTB',

    TRACK_DEFAULT = '-18 1i 18 1i##',

    GHOST_COLORS = {
        0: '#000',
        1: '#a00',
        2: '#0a0',
        3: '#00a',
        4: '#a0a',
        5: '#aa0',
        6: '#0aa',
        7: '#d70',
        8: '#70a',
        $length: 9
    };

function isFunction(obj) { return typeof obj === 'function'; }

function identity(x) { return x; }

export var $id = 0;

// super naive deferred impl.
function $defer() {
    var _value, _resolved, _cbs = [],
        def = {
            then: then,
            resolve: resolve,
            // for passing around functions more securely.
            p: { then: then },
            r: { resolve: resolve }
        };
    return def;

    function then(fn) {
        _cbs.push(fn);
        _resolved && (_value = fn(_value));
        return def.p;
    }

    function resolve(value) {
        _resolved = true;
        _value = value;
        var i = 0,
            l = _cbs.length;
        for (; i < l; i++) _cbs[i](value);
    }
}
$defer.all = function $all(defs) {
    var def = $defer(),
        i = 0,
        l = defs.length,
        toResolve = l,
        results = Array(l);
    for (; i < l; i++) {
        defs[i].then(next(i));
    }
    return def;

    function next(i) {
        return function(p) {
            results[i] = p;
            --toResolve > 0 || def.resolve(results);
            return p;
        };
    }
}


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

function mix(target, source) {
    for (var key in source)
        if (source.hasOwnProperty(key)) {
            target[key] = source[key];
        }
}

function _include(arr, n) {~arr.indexOf(n) || arr.push(n) }

function combine(arr, n) {
    for (var i = 0, l = n.length; i < l; i++) _include(arr, n[i]);
    return this;
}

// Ghost Bike
/** @constructor */
function GhostBike(ghostKeys, cp, parent) {
    this.ghostKeys = ghostKeys;
    this.name = ghostKeys[7] || 'Ghost';
    this.parnt = parent;
    this.targetsReached = cp[31] || 0;
    this.cap = 'hat';
    this.isGhost = true;
    this.currentTime =
        this.distance = 0;
    this.reached = {};
}
(function(p) {

    p.turn = function() {
        var self = this;
        self.direction *= -1;
        self.frontToBack.turn();
        var headToBack = self.joints[0].len;
        self.headToBack.len = self.joints[2].len;
        self.headToFront.len = headToBack;
    };

    p.proceed = function() {
        var self = this,
            bikeTime = self.parnt.currentTime,
            i = 0;
        if (bikeTime > self.time) {
            self.proceed = function() {};
        }
        if (self.ghostKeys[0][bikeTime]) {
            self.leftPressed = self.leftPressed ? 0 : 1;
        }
        if (self.ghostKeys[1][bikeTime]) {
            self.rightPressed = self.rightPressed ? 0 : 1;
        }
        if (self.ghostKeys[2][bikeTime]) {
            self.upPressed = self.upPressed ? 0 : 1;
        }
        if (self.ghostKeys[3][bikeTime]) {
            self.downPressed = self.downPressed ? 0 : 1;
        }
        if (self.ghostKeys[4][bikeTime]) {
            self.turn();
        }
        self.BS();
        for (i = self.joints.$length - 1; i >= 0; i--) {
            self.joints[i].proceed();
        }
        for (i = self.points.$length - 1; i >= 0; i--) {
            self.points[i].proceed();
        }
        if (self.backWheel.driving && self.frontWheel.driving) {
            self.slow = false;
        }
        if (!self.slow) {
            self.BS();
            for (i = self.joints.$length - 1; i >= 0; i--) {
                self.joints[i].proceed();
            }
            for (i = self.points.$length - 1; i >= 0; i--) {
                self.points[i].proceed();
            }
        }
        self.currentTime += 40;
    };

}(GhostBike[proto]));

/**
 * @constructor
 * @extends GhostBike
 */
function BMXGhost(parent, ghostKeys, last) {
    last = last || (console.log('fallback', last), enghosten([bmxConstants[0]])[0]);
    GhostBike.call(this, ghostKeys, last, parent);

    this.points = {
        0: new BodyPart(new Point(last[0], last[1]), this),
        1: new Wheel(new Point(last[6], last[7]), this),
        2: new Wheel(new Point(last[13], last[14]), this),
        $length: 3
    };
    this.points[0].oldPos = new Point(last[2], last[3]);
    this.points[0].velocity = new Point(last[4], last[5]);

    this.points[1].oldPos = new Point(last[8], last[9]);
    this.points[1].velocity = new Point(last[10], last[11]);
    this.points[1].speedValue = last[12];

    this.points[2].oldPos = new Point(last[15], last[16]);
    this.points[2].velocity = new Point(last[17], last[18]);
    this.points[2].speedValue = last[19];

    this.head = this.points[0];
    this.head.size = 14;
    this.head.drive = function() {};

    this.backWheel = this.points[1];
    this.backWheel.size = 11.7;
    this.frontWheel = this.points[2];
    this.frontWheel.size = 11.7;
    this.joints = {
        0: this.headToBack = new Joint(this.points[0], this.points[1], this),
        1: this.frontToBack = new Joint(this.points[1], this.points[2], this),
        2: this.headToFront = new Joint(this.points[2], this.points[0], this),
        $length: 3
    };

    this.headToBack.lengthTowards = 45;
    this.headToBack.len = last[20];
    this.headToBack.BC = 0.35;
    this.headToBack.BE = 0.3;

    this.frontToBack.lengthTowards = 42;
    this.frontToBack.len = last[21];
    this.frontToBack.BC = 0.35;
    this.frontToBack.BE = 0.3;

    this.headToFront.lengthTowards = 45;
    this.headToFront.len = last[22];
    this.headToFront.BC = 0.35;
    this.headToFront.BE = 0.3;

    this.direction = last[23];
    this.gravity = new Point(last[24], last[25]);
    this.slow = last[26];
    this.leftPressed = last[27];
    this.rightPressed = last[28];
    this.upPressed = last[29];
    this.downPressed = last[30];
    this.time = this.ghostKeys[5];
    this.color = last[32];
}
(function(p) {
    mix(p, GhostBike[proto]);

    p.BS = function() {
        this.backWheel.speedValue += (this.upPressed - this.points[1].speedValue) / 10;
        if (this.upPressed) {
            this.distance += this.backWheel.rotationSpeed / 5;
        }
        this.backWheel.downPressed = this.frontWheel.downPressed = this.downPressed;
        var rotate = this.leftPressed - this.rightPressed;
        this.headToBack.lean(rotate * 5 * this.direction, 5);
        this.headToFront.lean(-rotate * 5 * this.direction, 5);
        this.frontToBack.rotate(rotate / 6);
        if (!rotate && this.upPressed) {
            this.headToBack.lean(-7, 5);
            this.headToFront.lean(7, 5);
        }
    };

    p.draw = function() {
        var track = this.parnt,
            color = this.color,
            backWheel = this.backWheel.pos.toPixel(track),
            frontWheel = this.frontWheel.pos.toPixel(track),
            z = track.zoomFactor;
        // Wheels
        context[beginPath]();
        context.strokeStyle = color;
        context.globalAlpha = 0.6;
        context.lineWidth = 3.5 * z;
        // (front wheel)
        context[arc](backWheel.x, backWheel.y, 10 * z, 0, PI2, true);
        // (back wheel)
        context[moveTo](frontWheel.x + 10 * z, frontWheel.y);
        context[arc](frontWheel.x, frontWheel.y, 10 * z, 0, PI2, true);
        context[stroke]();

        var length = frontWheel.cloneSub(backWheel),
            AC = new Point((frontWheel.y - backWheel.y) * this.direction, (backWheel.x - frontWheel.x) * this.direction),
            crossFrameSaddle = backWheel.cloneAdd(length.cloneScale(0.3)).cloneAdd(AC.cloneScale(0.25)),
            shadowSteer = backWheel.cloneAdd(length.cloneScale(0.84)).cloneAdd(AC.cloneScale(0.42)),
            steer = backWheel.cloneAdd(length.cloneScale(0.84)).cloneAdd(AC.cloneScale(0.37)),
            pedalHinge = backWheel.cloneAdd(length.cloneScale(0.4)).cloneAdd(AC.cloneScale(0.05));

        // Frame
        context[beginPath]();
        context.lineWidth = 3 * z;
        context[moveTo](backWheel.x, backWheel.y);
        context[lineTo](crossFrameSaddle.x, crossFrameSaddle.y);
        context[lineTo](shadowSteer.x, shadowSteer.y);
        context[moveTo](steer.x, steer.y);
        context[lineTo](pedalHinge.x, pedalHinge.y);
        context[lineTo](backWheel.x, backWheel.y);

        var CY = new Point(6 * z * cos(this.distance), 6 * z * sin(this.distance)),
            pedal = pedalHinge.cloneAdd(CY),
            shadowPedal = pedalHinge.cloneSub(CY),
            saddle = backWheel.cloneAdd(length.cloneScale(0.17)).cloneAdd(AC.cloneScale(0.38)),
            Cg = backWheel.cloneAdd(length.cloneScale(0.3)).cloneAdd(AC.cloneScale(0.45)),
            Ci = backWheel.cloneAdd(length.cloneScale(0.25)).cloneAdd(AC.cloneScale(0.4));

        // Saddle
        context[moveTo](pedal.x, pedal.y);
        context[lineTo](shadowPedal.x, shadowPedal.y);
        context[moveTo](saddle.x, saddle.y);
        context[lineTo](Cg.x, Cg.y);
        context[moveTo](pedalHinge.x, pedalHinge.y);
        context[lineTo](Ci.x, Ci.y);
        var backWheelCenter = backWheel.cloneAdd(length.cloneScale(1)).cloneAdd(AC.cloneScale(0));
        var Cl = backWheel.cloneAdd(length.cloneScale(0.97)).cloneAdd(AC.cloneScale(0));
        var CO = backWheel.cloneAdd(length.cloneScale(0.8)).cloneAdd(AC.cloneScale(0.48));
        var CbackWheel = backWheel.cloneAdd(length.cloneScale(0.86)).cloneAdd(AC.cloneScale(0.5));
        var Ck = backWheel.cloneAdd(length.cloneScale(0.82)).cloneAdd(AC.cloneScale(0.65));
        var steerCenter = backWheel.cloneAdd(length.cloneScale(0.78)).cloneAdd(AC.cloneScale(0.67));

        // Steering Wheel
        context[moveTo](backWheelCenter.x, backWheelCenter.y);
        context[lineTo](Cl.x, Cl.y);
        context[lineTo](CO.x, CO.y);
        context[lineTo](CbackWheel.x, CbackWheel.y);
        context[lineTo](Ck.x, Ck.y);
        context[lineTo](steerCenter.x, steerCenter.y);
        context[stroke]();

        var h = this.head.pos.toPixel(track);
        AC = h.cloneSub(backWheel.cloneAdd(length.cloneScale(0.5)));
        var hip = crossFrameSaddle.cloneSub(length.cloneScale(0.1)).cloneAdd(AC.cloneScale(0.3));
        var Ar = pedal.cloneSub(hip);
        var BA = new Point(Ar.y * this.direction, -Ar.x * this.direction);
        BA = BA.cloneScale(z * z);
        var knee = hip.cloneAdd(Ar.cloneScale(0.5)).cloneAdd(BA.cloneScale(200 / Ar.lengthSquared()));
        Ar = shadowPedal.cloneSub(hip);
        BA = new Point(Ar.y * this.direction, -Ar.x * this.direction);
        BA = BA.cloneScale(z * z);
        var shadowKnee = hip.cloneAdd(Ar.cloneScale(0.5)).cloneAdd(BA.cloneScale(200 / Ar.lengthSquared()));

        // Shadow Leg
        context[beginPath]();
        context.lineWidth = 6 * z;
        context.globalAlpha = 0.3;
        context[moveTo](shadowPedal.x, shadowPedal.y);
        context[lineTo](shadowKnee.x, shadowKnee.y);
        context[lineTo](hip.x, hip.y);
        context[stroke]();

        // Leg
        context[beginPath]();
        context.globalAlpha = 0.6;
        context.lineWidth = 6 * z;
        context[moveTo](pedal.x, pedal.y);
        context[lineTo](knee.x, knee.y);
        context[lineTo](hip.x, hip.y);
        context[stroke]();

        // Body
        var head = crossFrameSaddle.cloneAdd(length.cloneScale(0.05)).cloneAdd(AC.cloneScale(0.9));
        context[beginPath]();
        context.lineWidth = 8 * z;
        context[moveTo](hip.x, hip.y);
        context[lineTo](head.x, head.y);
        context[stroke]();

        // Cap
        context[beginPath]();
        context.lineWidth = 2 * z;
        switch (this.cap) {
            case 'cap':
                var Ch = crossFrameSaddle.cloneAdd(length.cloneScale(0.4)).cloneAdd(AC.cloneScale(1.1)),
                    Cd = crossFrameSaddle.cloneAdd(length.cloneScale(0.05)).cloneAdd(AC.cloneScale(1.05));
                context[moveTo](Ch.x, Ch.y);
                context[lineTo](Cd.x, Cd.y);
                context[stroke]();
                break;
            case 'hat':
                var hatFrontBottom = crossFrameSaddle.cloneAdd(length.cloneScale(0.35)).cloneAdd(AC.cloneScale(1.15)),
                    hatBackBottom = crossFrameSaddle.cloneSub(length.cloneScale(0.05)).cloneAdd(AC.cloneScale(1.1)),
                    hatFront = crossFrameSaddle.cloneAdd(length.cloneScale(0.25)).cloneAdd(AC.cloneScale(1.13)),
                    hatBack = crossFrameSaddle.cloneAdd(length.cloneScale(0.05)).cloneAdd(AC.cloneScale(1.11)),
                    hatFrontTop = hatFrontBottom.cloneSub(length.cloneScale(0.1)).selfAdd(AC.cloneScale(0.2)),
                    //~ hatBackTop = hatBackBottom.cloneAdd(length.cloneScale(0.02)).selfAdd(AC.cloneScale(0.2));
                    hatBackTop = {
                        x: hatBackBottom.x + length.x * 0.02 + AC.x * 0.2,
                        y: hatBackBottom.y + length.y * 0.02 + AC.y * 0.2
                    };
                context[moveTo](hatFrontBottom.x, hatFrontBottom.y);
                context[lineTo](hatFront.x, hatFront.y);
                context[lineTo](hatFrontTop.x, hatFrontTop.y);
                context[lineTo](hatBackTop.x, hatBackTop.y);
                context[lineTo](hatBack.x, hatBack.y);
                context[lineTo](hatBackBottom.x, hatBackBottom.y);
                context.fillStyle = color;
                context[stroke]();
                context[fill]();
                break;
            case 'party':
                var capFront = {
                        x: crossFrameSaddle.x + length.x * 0.28 + AC.x * 1.15,
                        y: crossFrameSaddle.y + length.y * 0.28 + AC.y * 1.15
                    },
                    capBack = {
                        x: crossFrameSaddle.x + length.x * 0.0 + AC.x * 1.1,
                        y: crossFrameSaddle.y + length.y * 0.0 + AC.y * 1.1
                    },
                    capTop = {
                        x: capBack.x + length.x * 0.07 + AC.x * 0.33,
                        y: capBack.y + length.y * 0.07 + AC.y * 0.33
                    };
                context.fillStyle = '#3960ad';
                context
                    [moveTo](capFront.x, capFront.y)[lineTo](capTop.x, capTop.y)[lineTo](capBack.x, capBack.y)[fill]()
                    .strokeStyle = '#70d135';
                context.lineWidth = 4 * z;
                context[beginPath]()[moveTo](capFront.x, capFront.y)[lineTo](capBack.x, capBack.y)[stroke]()
                    .fillStyle = '#ffd600';
                context.lineWidth = 2 * z;
                context[beginPath]()[moveTo](capTop.x, capTop.y)[arc](capTop.x - length.x * 0.01 - AC.x * 0.03, capTop.y - length.y * 0.01 - AC.y * 0.03, 3 * z, 0, PI2)[fill]()
                    .fillStyle = context.strokeStyle = '#000';
                break;
        }
        length = head.cloneSub(steerCenter);
        //~ AC = new Point(length.y * this.direction, -length.x * this.direction);
        AC = { x: length.y * this.direction, y: -length.x * this.direction };
        //~ AC = AC.cloneScale(z * z);
        AC = { x: AC.x * z * z, y: AC.y * z * z };
        //~ var CV = steerCenter.cloneAdd(length.cloneScale(0.4)).cloneAdd(AC.cloneScale(130 / length.lengthSquared()));
        var factor = 130 / (length.x * length.x + length.y * length.y);
        var CV = {
            x: steerCenter.x + length.x * 0.4 + AC.x * factor,
            y: steerCenter.y + length.y * 0.4 + AC.y * factor
        };
        context[beginPath]();
        context.lineWidth = 5 * track.zoomFactor;
        context[moveTo](head.x, head.y);
        context[lineTo](CV.x, CV.y);
        context[lineTo](steerCenter.x, steerCenter.y);
        context[stroke]();
        context.strokeStyle = '#000';
        context.globalAlpha = 1;
    };

    p.toString = function() { return 'BMX' };

}(BMXGhost[proto]));

/**
 * @constructor
 * @extends GhostBike
 */
function MTBGhost(parent, ghostKeys, last) {
    var self = this;
    last = last || (console.log('fallback', last), enghosten([mtbConstants[0]])[0]);

    GhostBike.call(self, ghostKeys, last, parent);

    self.points = {
        0: self.head = new BodyPart(new Point(last[0], last[1]), self),
        1: self.backWheel = new Wheel(new Point(last[6], last[7]), self),
        2: self.frontWheel = new Wheel(new Point(last[13], last[14]), self),
        $length: 3
    };

    self.head.oldPos = new Point(last[2], last[3]);
    self.head.velocity = new Point(last[4], last[5]);

    self.backWheel.oldPos = new Point(last[8], last[9]);
    self.backWheel.velocity = new Point(last[10], last[11]);
    self.backWheel.speedValue = last[12];

    self.frontWheel.oldPos = new Point(last[15], last[16]);
    self.frontWheel.velocity = new Point(last[17], last[18]);
    self.frontWheel.speedValue = last[19];

    self.head.size = 14;
    self.head.drive = function() {};

    self.backWheel.size = 14;

    self.frontWheel.size = 14;
    self.joints = {
        0: self.headToBack = new Joint(self.head, self.backWheel, self),
        1: self.frontToBack = new Joint(self.backWheel, self.frontWheel, self),
        2: self.headToFront = new Joint(self.frontWheel, self.head, self),
        $length: 3
    };

    self.headToBack.lengthTowards = 47;
    self.headToBack.len = last[20];
    self.headToBack.BC = 0.2;
    self.headToBack.BE = 0.3;

    self.frontToBack.lengthTowards = 45;
    self.frontToBack.len = last[21];
    self.frontToBack.BC = 0.2;
    self.frontToBack.BE = 0.3;

    self.headToFront.lengthTowards = 45;
    self.headToFront.len = last[22];
    self.headToFront.BC = 0.2;
    self.headToFront.BE = 0.3;

    self.direction = last[23];
    self.gravity = new Point(last[24], last[25]);
    self.slow = last[26];
    self.leftPressed = last[27];
    self.rightPressed = last[28];
    self.upPressed = last[29];
    self.downPressed = last[30];
    self.time = ghostKeys[5];
    self.color = last[32];
}
(function(p) {
    mix(p, GhostBike[proto]);

    p.BS = function() {
        var self = this;
        self.backWheel.speedValue += (self.upPressed - self.points[1].speedValue) / 10;
        if (self.upPressed) {
            self.distance += self.backWheel.rotationSpeed / 5;
        }
        self.backWheel.downPressed = self.frontWheel.downPressed = self.downPressed;
        var rotate = self.leftPressed - self.rightPressed;
        self.headToBack.lean(rotate * 5 * self.direction, 5);
        self.headToFront.lean(-rotate * 5 * self.direction, 5);
        self.frontToBack.rotate(rotate / 8);
        if (!rotate && self.upPressed) {
            self.headToBack.lean(-7, 5);
            self.headToFront.lean(7, 5);
        }
    };

    p.draw = function() {
        var self = this,
            color = self.color,
            backWheel = self.backWheel.pos.toPixel(track);
        var pos = self.frontWheel.pos.toPixel(track);
        var head = self.head.pos.toPixel(track);
        var length = pos.cloneSub(backWheel);
        var AC = new Point((pos.y - backWheel.y) * self.direction, (backWheel.x - pos.x) * self.direction);
        var middle = head.cloneSub(backWheel.cloneAdd(length.cloneScale(0.5)));
        context.strokeStyle = color;
        context.globalAlpha = 0.6;
        context.lineWidth = 3.5 * track.zoomFactor;
        context
            [beginPath]()[arc](backWheel.x, backWheel.y, 12.5 * track.zoomFactor, 0, PI2, true)[moveTo](pos.x + 12.5 * track.zoomFactor, pos.y)[arc](pos.x, pos.y, 12.5 * track.zoomFactor, 0, PI2, true)[stroke]()[beginPath]()
            .fillStyle = color;
        context.globalAlpha = 0.3;
        context
            [moveTo](backWheel.x + 5 * track.zoomFactor, backWheel.y)[arc](backWheel.x, backWheel.y, 5 * track.zoomFactor, 0, PI2, true)[moveTo](pos.x + 4 * track.zoomFactor, pos.y)[arc](pos.x, pos.y, 4 * track.zoomFactor, 0, PI2, true)[fill]()[beginPath]()
            .lineWidth = 5 * track.zoomFactor;
        context
            [moveTo](backWheel.x, backWheel.y)[lineTo](backWheel.x + length.x * 0.4 + AC.x * 0.05, backWheel.y + length.y * 0.4 + AC.y * 0.05)[moveTo](backWheel.x + length.x * 0.72 + middle.x * 0.64, backWheel.y + length.y * 0.72 + middle.y * 0.64)[lineTo](backWheel.x + length.x * 0.46 + middle.x * 0.4, backWheel.y + length.y * 0.46 + middle.y * 0.4)[lineTo](backWheel.x + length.x * 0.4 + AC.x * 0.05, backWheel.y + length.y * 0.4 + AC.y * 0.05)[stroke]()[beginPath]()
            .lineWidth = 2 * track.zoomFactor;
        var Ap = new Point(6 * cos(self.distance) * track.zoomFactor, 6 * sin(self.distance) * track.zoomFactor);
        context
            [moveTo](backWheel.x + length.x * 0.72 + middle.x * 0.64, backWheel.y + length.y * 0.72 + middle.y * 0.64)[lineTo](backWheel.x + length.x * 0.43 + AC.x * 0.05, backWheel.y + length.y * 0.43 + AC.y * 0.05)[moveTo](backWheel.x + length.x * 0.45 + middle.x * 0.3, backWheel.y + length.y * 0.45 + middle.y * 0.3)[lineTo](backWheel.x + length.x * 0.3 + middle.x * 0.4, backWheel.y + length.y * 0.3 + middle.y * 0.4)[lineTo](backWheel.x + length.x * 0.25 + middle.x * 0.6, backWheel.y + length.y * 0.25 + middle.y * 0.6)[moveTo](backWheel.x + length.x * 0.17 + middle.x * 0.6, backWheel.y + length.y * 0.17 + middle.y * 0.6)[lineTo](backWheel.x + length.x * 0.3 + middle.x * 0.6, backWheel.y + length.y * 0.3 + middle.y * 0.6)[moveTo](backWheel.x + length.x * 0.43 + AC.x * 0.05 + Ap.x, backWheel.y + length.y * 0.43 + AC.y * 0.05 + Ap.y)[lineTo](backWheel.x + length.x * 0.43 + AC.x * 0.05 - Ap.x, backWheel.y + length.y * 0.43 + AC.y * 0.05 - Ap.y)[stroke]()[beginPath]()
            .lineWidth = track.zoomFactor;
        context
            [moveTo](backWheel.x + length.x * 0.46 + middle.x * 0.4, backWheel.y + length.y * 0.46 + middle.y * 0.4)[lineTo](backWheel.x + length.x * 0.28 + middle.x * 0.5, backWheel.y + length.y * 0.28 + middle.y * 0.5)[stroke]()[beginPath]()
            .lineWidth = 3 * track.zoomFactor;
        context
            [moveTo](pos.x, pos.y)[lineTo](backWheel.x + length.x * 0.71 + middle.x * 0.73, backWheel.y + length.y * 0.71 + middle.y * 0.73)[lineTo](backWheel.x + length.x * 0.73 + middle.x * 0.77, backWheel.y + length.y * 0.73 + middle.y * 0.77)[lineTo](backWheel.x + length.x * 0.7 + middle.x * 0.8, backWheel.y + length.y * 0.7 + middle.y * 0.8)[stroke]()
            .lineWidth = 6 * track.zoomFactor;
        AC = head.cloneSub(backWheel.cloneAdd(length.cloneScale(0.5)));
        var crossFrameSaddle = backWheel.cloneAdd(length.cloneScale(0.3)).cloneAdd(AC.cloneScale(0.25));
        var B2 = backWheel.cloneAdd(length.cloneScale(0.4)).cloneAdd(AC.cloneScale(0.05));
        var Bp = B2.cloneAdd(Ap);
        var A6 = B2.cloneSub(Ap);
        var A7 = backWheel.cloneAdd(length.cloneScale(0.67)).cloneAdd(AC.cloneScale(0.8));
        var AY = crossFrameSaddle.cloneAdd(length.cloneScale(-0.05)).cloneAdd(AC.cloneScale(0.42));
        var Aa = Bp.cloneSub(AY);
        middle = new Point(Aa.y * self.direction, -Aa.x * self.direction);
        middle = middle.cloneScale(track.zoomFactor * track.zoomFactor);
        var CZ = AY.cloneAdd(Aa.cloneScale(0.5)).cloneAdd(middle.cloneScale(200 / Aa.lengthSquared()));
        Aa = A6.cloneSub(AY);
        middle = new Point(Aa.y * self.direction, -Aa.x * self.direction);
        middle = middle.cloneScale(track.zoomFactor * track.zoomFactor);
        var CX = AY.cloneAdd(Aa.cloneScale(0.5)).cloneAdd(middle.cloneScale(200 / Aa.lengthSquared()));
        context.strokeStyle = color;
        context.globalAlpha = 0.3;
        context
            [beginPath]()[moveTo](A6.x, A6.y)[lineTo](CX.x, CX.y)[lineTo](AY.x, AY.y)[stroke]()[beginPath]()
            .strokeStyle = color;
        context.globalAlpha = 0.6;
        context
            [moveTo](Bp.x, Bp.y)[lineTo](CZ.x, CZ.y)[lineTo](AY.x, AY.y)[stroke]()[beginPath]()
            .lineWidth = 8 * track.zoomFactor;
        var BX = crossFrameSaddle.cloneAdd(length.cloneScale(0.1)).cloneAdd(AC.cloneScale(0.95));
        context
            [moveTo](AY.x, AY.y)[lineTo](BX.x, BX.y)[stroke]()[beginPath]()
            .lineWidth = 2 * track.zoomFactor;
        // Cap
        switch (self.cap) {
            case 'cap':
                var Ch = crossFrameSaddle.cloneAdd(length.cloneScale(0.4)).cloneAdd(AC.cloneScale(1.15)),
                    Cd = crossFrameSaddle.cloneAdd(length.cloneScale(0.1)).cloneAdd(AC.cloneScale(1.05));
                context
                    [moveTo](Ch.x, Ch.y)[lineTo](Cd.x, Cd.y)[stroke]();
                break;
            case 'hat':
                var hatFrontBottom = crossFrameSaddle.cloneAdd(length.cloneScale(0.37)).cloneAdd(AC.cloneScale(1.19)),
                    hatBackBottom = crossFrameSaddle.cloneSub(length.cloneScale(0.02)).cloneAdd(AC.cloneScale(1.14)),
                    hatFront = crossFrameSaddle.cloneAdd(length.cloneScale(0.28)).cloneAdd(AC.cloneScale(1.17)),
                    hatBack = crossFrameSaddle.cloneAdd(length.cloneScale(0.09)).cloneAdd(AC.cloneScale(1.15)),
                    hatFrontTop = hatFrontBottom.cloneSub(length.cloneScale(0.1)).selfAdd(AC.cloneScale(0.2)),
                    hatBackTop = hatBackBottom.cloneAdd(length.cloneScale(0.02)).selfAdd(AC.cloneScale(0.2));
                context
                    [moveTo](hatFrontBottom.x, hatFrontBottom.y)[lineTo](hatFront.x, hatFront.y)[lineTo](hatFrontTop.x, hatFrontTop.y)[lineTo](hatBackTop.x, hatBackTop.y)[lineTo](hatBack.x, hatBack.y)[lineTo](hatBackBottom.x, hatBackBottom.y)
                    .fillStyle = color;
                context.globalAlpha = 0.6;
                context
                    [stroke]()[fill]();
        }
        length = BX.cloneSub(A7);
        AC = new Point(length.y * self.direction, -length.x * self.direction);
        AC = AC.cloneScale(track.zoomFactor * track.zoomFactor);
        var CU = A7.cloneAdd(length.cloneScale(0.3)).cloneAdd(AC.cloneScale(80 / length.lengthSquared()));
        context
            [beginPath]()
            .lineWidth = 5 * track.zoomFactor;
        context
            [moveTo](BX.x, BX.y)[lineTo](CU.x, CU.y)[lineTo](A7.x, A7.y)[stroke]()
            .strokeStyle = '#000';
        context.globalAlpha = 1;
    };

    p.toString = function() { return 'MTB' }

}(MTBGhost[proto]));

// Split lines over grid helper
var spreadCache = {};

function gridSpread(_from, _to, q) {
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

// turns a standard checkpoints array into its ghost equivalent
function enghosten(arr) {
    return arr.map(function(cp) {
        cp = cp.concat();
        cp[28] = cp[29] = cp[30] = 0;
        return cp;
    });
}

// Undo Manager
/** @constructor */
function UndoManager() {
    this.undoStack = [];
    this.undoPosition = 0;
}
(function(p) {

    p.push = function(fn) {
        this.undoStack.length = Math.min(this.undoStack.length, this.undoPosition + 1);
        this.undoPosition = this.undoStack.push(fn) - 1;
        return this;
    };

    p.undo = function() {
        if (this.undoPosition >= 0) {
            var fn = this.undoStack[this.undoPosition--].undo;
            if (typeof fn === 'function') {
                fn(this);
            }
        }
        return this;
    };

    p.redo = function() {
        if (this.undoPosition < this.undoStack.length - 1) {
            var fn = this.undoStack[++this.undoPosition].redo;
            if (typeof fn === 'function') {
                fn(this);
            }
        }
        return this;
    };

}(UndoManager[proto]));

function CheckpointSave(track, bikeList, ghostLists) {
    this.track = track;
    this.bikeList = bikeList;
    this.ghostLists = ghostLists;
    this.currentTime = track.currentTime;
}

// Track
/**
 * @constructor
 * @param {number|string=} ID
 */
function Track(ID) {
    var rawTrack, i, j, k, l, m, n, line, x, y, I, rawLine;

    this.grid = {};
    this.gridSize = 100;
    this.ghost = [];
    this.ghostKeys = [];
    this.ghostInstances = [];
    this.checkpoints = [];
    /** @export */
    this.canvas = canvas;
    this.cache = {};
    this.zoomFactor = 0.6;
    this.currentTime = 0;
    this.id = ID;
    this.currentBike = BIKE_BMX;
    this.trackStringVersion = TRACKSTRING_NEW;
    this.undoManager = new UndoManager();
    this.paused = false;
    /** @export */
    this.watchGhost = this._watchGhost;
    context[fillText]('Loading track... Please wait.', 36, 16);
    this.camera = new Point(0, 0);
    if (!this.id) {
        rawTrack = TRACK_DEFAULT;
        toolbar2.style.display = 'block';
        currentTool = TOOL_LINE;
    } else if (this.id.length > 7) {
        rawTrack = this.id;
        this.id = undefined;
        toolbar2.style.display = 'block';
        currentTool = TOOL_LINE;
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

    /** @expose */
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
                    this.addLine({ x: toInt(rawLine[k], 32), y: toInt(rawLine[k + 1], 32) }, { x: toInt(rawLine[k + 2], 32), y: toInt(rawLine[k + 3], 32) },
                        true
                    );
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
(function(p) {

    p.save = function() {
        var track = this,
            bike = track.bike,
            ghosts = track.ghostInstances,
            i = 0,
            l = track.objects.length,
            ghost,
            reached = { length: l },
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
    };

    p.restart = function() {
        this.unreachEverything();
        this.paused = false;
        this.ghostInstances = [];
        this.runningGhosts = [];
        var cp = this.checkpoints[this.checkpoints.length - 1],
            bike = this.bike = new({ BMX: BMX, MTB: MTB, HAR: Harley }[this.currentBike] || BMX)(this, cp && cp.bikeList),
            l = this.ghost.length,
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
    };

    p.reset = function() {
        this.checkpoints = [];
        if (this.ghost.length) {
            ghostConstants = enghosten(this.ghostKeys[0][6] === 'BMX' ? bmxConstants : mtbConstants);
        }
        this.restart();
    };

    p.unreachEverything = function() {
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
    };

    p._watchGhost = function(g) {
        if (g = typeof g === 'string' && g.charAt(0) === 'g' ? toInt(g.substr(1), 10) : this.ghosts[toInt(g, 10) - 1]) {
            watchGhost(g, this);
        }
        return this;
    };

    p.touch = function(part) {
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
    };

    p.proceed = function() {
        var l = this.ghostInstances.length,
            i = 0;
        if (!this.paused) {
            this.bike && this.bike.proceed();
            //~ this.ghost && this.ghost.proceed();
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
    };

    p.draw = function() {
        var bike = this.bike,
            ghost,
            time = this.currentTime,
            z = this.zoomFactor,
            gs = this.gridSize,
            mousePx = mousePos.toPixel(this),
            grid = this.grid;
        if (this.focalPoint) {
            this.camera.selfAdd(this.focalPoint.pos.cloneSub(this.camera).cloneScale(1 / 5));
        }
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.lineWidth = Math.max(2 * z, 0.5);
        if (snapFromPrevLine && !secretlyErasing && (currentTool === TOOL_LINE || currentTool === TOOL_SLINE ||
                currentTool === TOOL_BRUSH || currentTool === TOOL_SBRUSH)) {
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
            context
                [beginPath]()[moveTo](lastClick.toPixel(this).x, lastClick.toPixel(this).y)[lineTo](mousePx.x, mousePx.y)[stroke]();
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
                        context.drawImage(
                            this.cache[key],
                            floor(canvas.width / 2 - this.camera.x * z + x * gs * z),
                            floor(canvas.height / 2 - this.camera.y * z + y * gs * z)
                        );
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
            context
                [beginPath]()[arc](mousePx.x, mousePx.y, (eraserSize - 1) * z, 0, PI2, true)[fill]();
        }
        if (secretlyErasing) {
            eraser();
        } else if (currentTool !== TOOL_CAMERA && !this.focalPoint) {
            switch (currentTool) {
                case 'line':
                case 'scenery line':
                case 'brush':
                case 'scenery brush':
                    context.lineWidth = 1;
                    context.strokeStyle = '#000';
                    x = mousePx.x;
                    y = mousePx.y;
                    context
                        [beginPath]()[moveTo](x - 10, y)[lineTo](x + 10, y)[moveTo](x, y + 10)[lineTo](x, y - 10)[stroke]();
                    break;
                case 'eraser':
                    eraser();
                    break;
                case 'goal':
                case 'checkpoint':
                case 'bomb':
                case 'slow-mo':
                    context.fillStyle = currentTool === TOOL_GOAL ? '#ff0' : currentTool === 'checkpoint' ? '#00f' : currentTool === 'bomb' ? '#f00' : '#eee';
                    context
                        [beginPath]()[arc](mousePx.x, mousePx.y, 7 * z, 0, PI2, true)[fill]()[stroke]();
                    break;
                case 'boost':
                case 'gravity':
                    context
                        [beginPath]()
                        .fillStyle = currentTool === 'boost' ? '#ff0' : '#0f0';
                    context.save();
                    if (!snapFromPrevLine) {
                        context.translate(mousePx.x, mousePx.y);
                    } else {
                        context.translate(lastClick.toPixel(track).x, lastClick.toPixel(track).y);
                        context.rotate(Math.atan2(-(mousePos.x - lastClick.x), mousePos.y - lastClick.y));
                    }
                    context
                        [moveTo](-7 * z, -10 * z)[lineTo](0, 10 * z)[lineTo](7 * z, -10 * z)[lineTo](-7 * z, -10 * z)[fill]()[stroke]()
                        .restore();
                    break;
                default:
                    ;
            }
        }
        context[beginPath]();
        context.fillStyle = '#ff0';
        context.lineWidth = 1;
        context
            [arc](40, 12, 3.5, 0, PI2, true)[fill]()[stroke]()[beginPath]();
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
            if (gridDetail === 10 && (currentTool === 'line' || currentTool === 'scenery line' || currentTool === 'brush' || currentTool === 'scenery brush')) {
                text += ' - Grid ';
            }
            text += ' - ' + currentTool;
            if (currentTool === 'brush' || currentTool === 'scenery brush') {
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
            context
                [fillRect](0, 0, canvas.width, y0)[fillRect](0, y1, canvas.width, y0)[fillRect](0, y0, x0, 150)[fillRect](x1, y0, x0, 150)[strokeRect](x0, y0, 250, 150);
            //context.fillRect(x0, y1, canvas.width - x1, canvas.height - y1);
            //context.fillRect(x1, y0, canvas.width - x1, 150);
        }

        return this;
    };

    p.checkDelete = function(eraserPoint) {
        var x = floor(eraserPoint.x / this.gridSize - 0.5),
            y = floor(eraserPoint.y / this.gridSize - 0.5),
            Ix = this.grid[x],
            Ix1 = this.grid[x + 1],
            Ixy, Ixy1, Ix1y, Ix1y1,
            i, l, deleted = [];

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
            Ix1y1 = Ix1[y + 1]
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
    };

    p.addLine = function(a, b, scenery) {
        var L = scenery ? SceneryLine : SolidLine,
            line = new L(a.x, a.y, b.x, b.y, this);
        if (line.len >= 2 && line.len < 100000) {
            this.addLineInternal(line);
            if (currentTool === 'brush' || currentTool === 'line' ||
                currentTool === 'scenery brush' || currentTool === 'scenery line') {
                if (currentTool === 'brush' || currentTool === 'line') {
                    lastForeground.copy(mousePos);
                } else {
                    lastScenery.copy(mousePos);
                }
                lastClick.copy(mousePos);
            }
        }

        return line;
    };

    p.addLineInternal = function(line) {
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
    };

    p.addObject = function(item) {
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
    };

    p.selfAdd = function(arr, known) {
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
    };

    p.remove = function(Av, BZ) {
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
    };

    p.pushUndo = function(undo, redo) {
        this.undoManager.push({ undo: undo, redo: redo });
        return this;
    };
    p.undo = function() {
        this.undoManager.undo();
        return this;
    };
    p.redo = function() {
        this.undoManager.redo();
        return this;
    };

    p.shortenLastLineSet = function() {
        if (currentTool === 'scenery line' || currentTool === 'scenery brush') {
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
    };

    p.all = function() {
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
    };

    p.toString = function() {
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
    };

}(Track[proto]));

// Survival
/** @constructor */
function SurvivalTrack() {
    var rawTrack, i, j, k, l, m, n, line, x, y, I, rawLine;

    this.grid = {};
    this.gridSize = 100;
    this.cache = {};
    this.zoomFactor = 0.6;
    this.currentTime = 0;
    this.id = 'SURVIVAL';
    this.currentBike = 'BMX';
    this.paused = false;
    //~ this.currentBike = 'HAR';
    context.fillText('Building track... Please wait.', 36, 16);
    this.camera = new Point(0, 0);
    this.lines = [];
    this.objects = [];
    this.difficulty = 0.5;
}
(function(p) {

    p.restart = function() {
        this.unreachEverything();
        this.paused = false;
        var bike = this.bike = this.currentBike === 'BMX' ? new BMX(this) : this.currentBike === 'HAR' ? new Harley(this) : new MTB(this);
        this.focalPoint = bike.head;
        if (this.ghost) {
            var ghost = this.ghost = this.ghostKeys[6] === 'BMX' ? new BMXGhost(this.ghostKeys, this) : new MTBGhost(this.ghostKeys, this);
            if (bike.$consts.length === 1 && !up) {
                this.focalPoint = ghost.head;
            }
        }
        /** HACK */
        this.currentTime = bike.$consts[bike.$consts.length - 1][29];
        /** /HACK */
        this.camera = bike.head.pos.clone();
    };

    p.reset = function() {
        this.checkpoints = [];
        bmxConstants = [
            [
                0, -1, 0, -1, 0, 0, -21, 38, -21, 38, 0, 0, 0, 21, 38, 21, 38, 0, 0, 0, 45, 42, 45, 1, 0, 0.3, false, 0, [], 0
            ]
        ];
        mtbConstants = [
            [
                2, -3, 2, -3, 0, 0, -23, 35, -23, 35, 0, 0, 0, 23, 35, 23, 35, 0, 0, 0, 47, 45, 45, 1, 0, 0.3, false, 0, [], 0
            ]
        ];
        if (this.ghost) {
            ghostConstants = enghosten(this.ghostKeys[6] === 'BMX' ? bmxConstants : mtbConstants);
        }
        this.restart();
    };

    p._watchGhost = function(g) {
        if (g = typeof g === 'string' && g.charAt(0) === 'g' ? toInt(g.substr(1), 10) : this.ghosts[toInt(g, 10) - 1]) {
            watchGhost(g, this);
        }
        return this;
    };

    p.touch = function(part) {
        var x = floor(part.pos.x / this.gridSize - 0.5),
            y = floor(part.pos.y / this.gridSize - 0.5);
        if (this.grid[x] !== undefined) {
            if (this.grid[x][y] !== undefined) {
                this.grid[x][y].untouch();
            }
            if (this.grid[x][y + 1] !== undefined) {
                this.grid[x][y + 1].untouch();
            }
        }
        if (this.grid[x + 1] !== undefined) {
            if (this.grid[x + 1][y] !== undefined) {
                this.grid[x + 1][y].untouch();
            }
            if (this.grid[x + 1][y + 1] !== undefined) {
                this.grid[x + 1][y + 1].untouch();
            }
        }
        if (this.grid[x] !== undefined && this.grid[x][y] !== undefined) {
            this.grid[x][y].touch(part);
        }
        if (this.grid[x + 1] !== undefined) {
            if (this.grid[x + 1][y] !== undefined) {
                this.grid[x + 1][y].touch(part);
            }
            if (this.grid[x + 1][y + 1] !== undefined) {
                this.grid[x + 1][y + 1].touch(part);
            }
        }
        if (this.grid[x] !== undefined && this.grid[x][y + 1] !== undefined) {
            this.grid[x][y + 1].touch(part);
        }
        return this;
    };

    p.proceed = function() {
        if (!this.paused) {
            this.ghost && this.ghost.proceed();
            this.bike && this.bike.proceed();

            this.currentTime += 40;
        }

        var p, line = this.lines[this.lines.length - 1];
        //~ while (this.bike.frontWheel.pos.distanceTo(p = line ? line.b : { x: -50, y: 50 }) < 2000) {
        p = line ? line.b : new Point(-50, 50);
        if (!this.bike.dead && p.distanceTo(this.bike.frontWheel.pos) < 2000) {
            this.addLine(p, Point[proto].cloneAdd.call(p, { x: floor(rand() * 100 / this.difficulty), y: floor((rand() - 0.5) * 20 * this.difficulty) }));
            //~ line = this.lines[this.lines.length - 1];
            this.difficulty += 0.001;
        }
        //~ }

        this.draw();
        this.ghost && this.ghost.draw();
        this.bike && this.bike.draw();

        return this;
    };

    p.draw = function() {
        var bike = this.bike,
            time = this.currentTime;
        if (this.focalPoint) {
            this.camera.selfAdd(this.focalPoint.pos.cloneSub(this.camera).cloneScale(1 / 5));
        }
        context.clearRect(0, 0, canvas.width, canvas.height);
        var center = new Point(0, 0).normalizeToCanvas(),
            border = new Point(canvas.width, canvas.height).normalizeToCanvas();
        center.x = floor(center.x / this.gridSize);
        center.y = floor(center.y / this.gridSize);
        border.x = floor(border.x / this.gridSize);
        border.y = floor(border.y / this.gridSize);
        var DI = [],
            i, l, x, y;
        for (x = center.x; x <= border.x; x++) {
            for (y = center.y; y <= border.y; y++) {
                if (this.grid[x] !== undefined && this.grid[x][y] !== undefined) {
                    if (this.grid[x][y].lines.length > 0) {
                        DI[x + '_' + y] = 1;
                        if (this.cache[x + '_' + y] === undefined) {
                            var el = this.cache[x + '_' + y] = doc.createElement('canvas');
                            el.width = this.gridSize * this.zoomFactor;
                            el.height = this.gridSize * this.zoomFactor;
                            var graphic = el.getContext('2d');
                            graphic.lineCap = 'round';
                            graphic.lineWidth = Math.max(2 * this.zoomFactor, 0.5);
                            graphic.strokeStyle = '#000';
                            for (i = 0, l = this.grid[x][y].lines.length; i < l; i++) {
                                this.grid[x][y].lines[i].draw(this.cache[x + '_' + y].getContext('2d'), x * this.gridSize * this.zoomFactor, y * this.gridSize * this.zoomFactor);
                            }
                        }
                        context.drawImage(
                            this.cache[x + '_' + y],
                            floor(canvas.width / 2 - this.camera.x * this.zoomFactor + x * this.gridSize * this.zoomFactor),
                            floor(canvas.height / 2 - this.camera.y * this.zoomFactor + y * this.gridSize * this.zoomFactor)
                        );
                    }
                    context.strokeStyle = '#000';
                    //~ for (i = 0, l = this.grid[x][y].objects.length; i < l; i++) {
                    //~ this.grid[x][y].objects[i].draw();
                    //~ }
                }
            }
        }
        for (var Ay in this.cache) {
            if (DI[Ay] === undefined) {
                delete this.cache[Ay];
            }
        }
        mix(context[beginPath](), {
            lineWidth: 10,
            strokeStyle: '#fff',
            fillStyle: '#000'
        });

        if (!this.bike.dead && this.bike.frontWheel.pos.x > this.farthestDistance) {
            this.farthestDistance = this.bike.frontWheel.pos.x;
        }
        var text,
            d = floor((this.bike.dead ? this.bike.deathPoint : this.bike).frontWheel.pos.x / 10) / 10,
            v = Math.max(0, floor((this.bike.dead ? this.bike.bike : this.bike).frontWheel.velocity.x * 2.5 * 3.6) / 10);
        if (d % 1 === 0) {
            d += '.0';
        }
        if (v % 1 === 0) {
            v += '.0';
        }
        context.strokeText(text =
            'Distance: ' + d + ' meters' +
            '; Speed: ' + v + ' km/h' + (bike.dead ? ' - Press ENTER to retry' : ''), 28, 16);
        context.fillText(text, 28, 16);
        if (this.ghost) {
            context.fillStyle = '#aaa';
            context.textAlign = 'right';
            context.strokeText(text = (this.ghost.name || 'Ghost') + floor(this.ghost.frontWheel.pos.x / 10) / 10, canvas.width - 7, 16);
            context.fillText(text, canvas.width - 7, 16);
            context.textAlign = 'left';
            context.fillStyle = '#000';
        }

        this.bike.draw();
        return this;
    };

    p.addLine = function(a, b, scenery) {
        var L = scenery ? SceneryLine : SolidLine,
            line = new L(a.x, a.y, b.x, b.y, this);

        this.addLineInternal(line);

        return line;
    };

    p.addLineInternal = function(line) {
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
            this.grid[x][y].lines.push(line);
            this.lines.push(line);
            delete this.cache[x + '_' + y];
        }
    };

    p.addObject = function(item) {
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
    };

    p.selfAdd = function(arr) {
        for (var i = 0, l = arr.length; i < l; i++) {
            if (arr[i].isItem) {
                this.addObject(arr[i]);
            } else {
                this.addLine(arr[i].a, arr[i].b, arr[i].isScenery);
            }
        }
    };

    p.unreachEverything =
        p.checkDelete =
        p.remove =
        p.pushUndo =
        p.undo =
        p.redo =
        p.shortenLastLineSet = function() { return this; };

    p.toString = function() {
        return 'v1,SURVIVAL#' + this.currentBike;
    };

}(SurvivalTrack[proto]));


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
    // Default values
    currentBike = 'BMX',
    // Default checkpoint arrays
    bmxConstants = [
        [
            0, -1, 0, -1, 0, 0, -21, 38, -21, 38, 0, 0, 0, 21, 38, 21, 38, 0, 0, 0, 45, 42, 45, 1, 0, 0.3, false, 0, [], 0
        ]
    ],
    mtbConstants = [
        [
            2, -3, 2, -3, 0, 0, -23, 35, -23, 35, 0, 0, 0, 23, 35, 23, 35, 0, 0, 0, 47, 45, 45, 1, 0, 0.3, false, 0, [], 0
        ]
    ],
    harConstants = [
        [-5, 4.5, -5, 4.5, 0, 0, -23, 35, -23, 35, 0, 0, 0, 23, 35, 23, 35, 0, 0, 0, 35, 45, 45, 1, 0, 0.3, false, 0, [], 0]
    ],
    ghostConstants,
    // Keystring builder
    keys = [{}, {}, {}, {}, {}],
    // Pressed keys
    left = 0,
    right = 0,
    up = 0,
    down = 0,
    turn = 0,
    // Something strange
    Ct = true,
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
    currentTool = 'camera',
    lastTool = 'camera',
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

var DVORAK = false;

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

var GhostString = {
    parse: function(ghostStr) {
        var parts = ghostStr.split(','),
            arr = [{}, {}, {}, {}, {}];
        if (parts.length > 5) {
            arr = arr.concat(parts.slice(5));
        }
        for (var i = 0, j, k, key; i < 5; i++) {
            key = parts[i].split(' ');
            for (j = 0, k = key.length - 1; j < k; j++) {
                arr[i][key[j]] = 1;
            }
        }
        return arr;
    },
    generate: function(ghostArr) {
        var ghostStr = '';
        for (var q, i = 0, l = ghostArr.length; i < l; i++) {
            for (q in ghostArr[i]) {
                if (!isNaN(q)) {
                    ghostStr += q + ' ';
                }
            }
            ghostStr += ",";
        }
        return ghostStr;
    }
};

/*var TrackParts;

var TrackString = {
  parse: function (str) {
    return TrackString.Legacy.parse(str);
  },
  Legacy: {
    parseLines: function (str, acc) {
      var lines = str.split(','), line, i, l, k, m;
      for (i = 0, l = lines.length; i < l; i++) {
        line = lines[i].split(' ');
        if (line.length > 3) for (k = 0, m = line.length - 2; k < m; k += 2) {
          acc.push({
            a: { x: toInt(line[k], 32), y: toInt(line[k + 1], 32) },
            b: { x: toInt(line[k + 2], 32), y: toInt(line[k + 3], 32) }
          });
        }
      }
    },

    parse: function (str) {
      var split = str.split('#'),
        line, i, l, k, m, item, x, y,
        box = { lines: [], scenery: [], objects: [], bike: split[3] || 'BMX' };
      if (split.length > 0) {
        TrackString.Legacy.parseLines(split[0], box.lines);
      }
      if (split.length > 1) {
        TrackString.Legacy.parseLines(split[1], box.scenery);
      }
      if (split.length > 2) {
        var objects = split[2] ? split[2].split(',') : [], coords;
        for (i = 0, l = objects.length; i < l; i++) {
          coords = objects[i].split(' ');
          if (coords.length > 2) {
            x = toInt(coords[1], 32);
            y = toInt(coords[2], 32);
            switch (coords[0]) {
              case 'T': box.objects.push({ type: Target,     x: x, y: y }); break;
              case 'C': box.objects.push({ type: Checkpoint, x: x, y: y }); break;
              case 'B': box.objects.push({ type: Boost,      x: x, y: y, dir: toInt(coords[3], 32) + 180 }); break;
              case 'G': box.objects.push({ type: Gravity,    x: x, y: y, dir: toInt(coords[3], 32) + 180 }); break;
              case 'O': box.objects.push({ type: Bomb,       x: x, y: y }); break;
              case 'S': box.objects.push({ type: SlowMo,     x: x, y: y }); break;
              default: // not much
            }
          }
        }
      }

      return box;
    },
    generate: function (box) {
      var lines = [], scenery = [], objects = [], bike = box.bike || 'BMX', i, l;
      for (i = 0, l = box.lines.length; i < l; i++) {
        box.lines[i].stringGot || lines.push(box.lines[i].toString());
      }
      for (i = 0, l = box.scenery.length; i < l; i++) {
        box.scenery[i].stringGot || scenery.push(box.scenery[i].toString());
      }
      for (i = 0, l = box.objects.length; i < l; i++) {
        objects.push(box.objects[i].toString());
      }
      for (i = 0, l = Math.max(box.lines.length, box.scenery.length); i < l; i++) {
        box.lines[i] && (box.lines[i].stringGot = false);
        box.scenery[i] && (box.scenery[i].stringGot = false);
      }

      return lines + '#' + scenery + '#' + objects + '#' + bike;
    }
  }
};
*/
var parseGhostString = GhostString.parse;
export var generateGhostString = GhostString.generate;

export var Server = {
    get: function(url, data) {
        var request = new XMLHttpRequest(),
            defer = $defer();
        request.onload = function() {
            defer.resolve(request.responseText);
        };
        request.open('POST', url.charAt(0) === '/' ? url : '/' + url, true);
        request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        request.send(data);

        return defer;
    }
};
Server.post = Server.get;

function watchGhost(ID, t) {
    t = t || track;
    if (t.ghost.contains(ID)) {
        return;
    }
    Server.post('ghost/load', 'id=' + ID).then(function(ghostStr) {
        var ghostArr = GhostString.parse(ghostStr);
        // t.ghostKeys = ghostArr;
        // t.ghost = ghostArr[5];
        t.ghostKeys.push(ghostArr);
        ghostArr.color = GHOST_COLORS[t.ghost.length % GHOST_COLORS.$length];
        t.ghost.push(ID);
        t.reset();
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
                } else if (Ct) {
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
                if (currentTool !== 'brush') {
                    currentTool = 'brush';
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
                if (currentTool !== 'scenery brush') {
                    currentTool = 'scenery brush';
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
                if (currentTool !== 'line') {
                    currentTool = 'line';
                    body.style.cursor = 'none';
                } else if (!snapFromPrevLine) {
                    snapFromPrevLine = true;
                    lastClick.copy(lastForeground);
                    shift = true;
                }
                break;
            case 87:
                // W
                if (currentTool !== 'scenery line') {
                    currentTool = 'scenery line';
                    body.style.cursor = 'none';
                } else if (!snapFromPrevLine) {
                    snapFromPrevLine = true;
                    lastClick.copy(lastScenery);
                    shift = true;
                }
                break;
            case 69:
                // E
                currentTool = 'eraser';
                body.style.cursor = 'none';
                shift = true;
                break;
            case 82:
                // R
                if (currentTool !== 'camera') {
                    lastTool = currentTool;
                    currentTool = 'camera';
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
            track.bike.doSave = DVORAK;
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
            Ct = true;
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
                currentTool = lastTool;
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
            if (track.ghost.length) {
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
        if (currentTool === TOOL_SLINE || currentTool === TOOL_SBRUSH) {
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
    if (track.id !== undefined) return false;
    track.focalPoint = false;
    switch (floor((event.clientY - toolbar1.offsetTop + window.pageYOffset) / 25) + 1) {
        case 1:
            currentTool = TOOL_BRUSH;
            break;
        case 2:
            currentTool = TOOL_SBRUSH;
            break;
        case 3:
            currentTool = TOOL_LINE;
            break;
        case 4:
            currentTool = TOOL_SLINE;
            break;
        case 5:
            currentTool = TOOL_ERASER;
            break;
        case 6:
            currentTool = TOOL_CAMERA;
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
            currentTool = TOOL_GOAL;
            break;
        case 10:
            currentTool = TOOL_CHECKPOINT;
            break;
        case 11:
            currentTool = TOOL_BOOST;
            break;
        case 12:
            currentTool = TOOL_GRAVITY;
            break;
        case 13:
            currentTool = TOOL_BOMB;
            break;
        case 14:
            currentTool = TOOL_SLOWMO;
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
    body.style.cursor = currentTool === TOOL_CAMERA ? 'move' : 'none';
};
canvas.onmousedown = function(event) {
    event.preventDefault();
    snapFromPrevLine = true;
    track.focalPoint = false;

    if (event.button === 2 && currentTool !== TOOL_CAMERA) {
        erase();
        secretlyErasing = true;
        return;
    }
    var item;
    if (!shift) {
        lastClick.copy(mousePos);
    }
    switch (currentTool) {
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
                track.addLine(lastClick, mousePos, currentTool !== TOOL_BRUSH);
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
    if (currentTool !== TOOL_CAMERA) {
        track.focalPoint = false;
    }
    mousePos = new Point(
        event.clientX - canvas.offsetLeft,
        event.clientY - canvas.offsetTop + window.pageYOffset
    ).normalizeToCanvas();
    if (currentTool !== TOOL_ERASER && event.button !== 2) {
        mousePos.x = round(mousePos.x / gridDetail) * gridDetail;
        mousePos.y = round(mousePos.y / gridDetail) * gridDetail;
    }
    if (snapFromPrevLine) {
        if (currentTool === TOOL_CAMERA) {
            track.camera.selfAdd(lastClick.cloneSub(mousePos));
            mousePos.copy(lastClick);
        } else if (currentTool === TOOL_ERASER || event.button === 2) {
            erase();
        } else if (!shift && (currentTool === TOOL_BRUSH || currentTool === TOOL_SBRUSH) && lastClick.distanceTo(mousePos) >= drawingSize) {
            var line = track.addLine(lastClick, mousePos, currentTool !== TOOL_BRUSH);
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
        if (currentTool === TOOL_LINE || currentTool === TOOL_SLINE ||
            currentTool === TOOL_BRUSH || currentTool === TOOL_SBRUSH) {
            var line = track.addLine(lastClick, mousePos, currentTool !== TOOL_LINE && currentTool !== TOOL_BRUSH);
            track.pushUndo(function() {
                line.remove();
            }, function() {
                line.reAdd();
            });
        } else if (currentTool === TOOL_BOOST || currentTool === TOOL_GRAVITY) {
            body.style.cursor = 'none';
            direction = round(Math.atan2(-(mousePos.x - lastClick.x), mousePos.y - lastClick.y) * 180 / Math.PI);
            item = currentTool === TOOL_BOOST ? new Boost(lastClick.x, lastClick.y, direction, track) :
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
        currentTool = TOOL_CAMERA;
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

        // load usernames & add Tagify
        if (!COMPILED) {
            var defReq = $defer(),
                defTag = $defer(),
                all = $defer.all([defReq, defTag]),
                map = {};
            new Request.JSON({ url: '/call/all-usernames', onSuccess: defReq.resolve }).send();
            require(['/js/lib/mootagify.js?' + String.uniqueID()], defTag.resolve);
            all.then(function(a) {
                var users = a[0],
                    Tagify = a[1];
                tagif = new Tagify(optCollab.removeClass('hide'), null, {
                    tagEls: 'b.tagif-tag',
                    closeEls: 'span.remove-tag',
                    minItemLength: 1,
                    maxItemLength: Infinity,
                    autoSuggest: true,
                    target: optCollabTarget,
                    availableOptions: users.map(function(u) { map[u.username.toLowerCase()] = u.id; return u.username }).erase(BH.get('user.name'))
                });
            });
        }

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
        if (currentTool === TOOL_ERASER) {
            if ((e.detail > 0 || e.wheelDelta < 0) && eraserSize > 5) { eraserSize -= 5; } else if ((e.detail < 0 || e.wheelDelta > 0) && eraserSize < 40) { eraserSize += 5; }
        } else if (currentTool === TOOL_BRUSH || currentTool === TOOL_SBRUSH) {
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