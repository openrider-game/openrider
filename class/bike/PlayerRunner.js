import Control from "../keyboard/Control.js";
import Keyboard from "../keyboard/Keyboard.js";
import * as KeyCode from "../keyboard/KeyCode.js";
import BikeRunner from "./BikeRunner.js";
import BikeRenderer from "./instance/renderer/BikeRenderer.js";

export default class PlayerRunner extends BikeRunner {
    constructor(track, bikeClass) {
        super(track, bikeClass);

        this.track.event.keyboard.registerControl('Up', new Control(KeyCode.DOM_VK_UP));
        this.track.event.keyboard.registerControl('Down', new Control(KeyCode.DOM_VK_DOWN));
        this.track.event.keyboard.registerControl('Left', new Control(KeyCode.DOM_VK_LEFT));
        this.track.event.keyboard.registerControl('Right', new Control(KeyCode.DOM_VK_RIGHT));
        this.track.event.keyboard.registerControl('Z', new Control(KeyCode.DOM_VK_Z, Keyboard.NONE, true));
    }

    startFrom(snapshot) {
        super.startFrom(snapshot);

        this.targetsReached.forEach((target, targetId) => {
            if (this.track.targets.has(targetId)) {
                this.track.targets.get(targetId).reached = true;
            }
        });

        this.reachablesReached.forEach((reachable, reachableId) => {
            if (this.track.reachables.has(reachableId)) {
                this.track.reachables.get(reachableId).reached = true;
            }
        });
    }

    onHitTarget() {
        if(this.targetsReached.size >= this.track.targets.size && this.track.isRace()) {
            this.done = true;
        }
    }

    onHitCheckpoint() {
        this.mustSave = true;
        this.track.ghostRunners.forEach((runner) => {
            runner.mustSave = true;
        });
    }

    updateControls() {
        let controls = new Map();
        controls.set('upPressed', this.track.event.keyboard.isDown('Up'));
        controls.set('downPressed', this.track.event.keyboard.isDown('Down'));
        controls.set('leftPressed', this.track.event.keyboard.isDown('Left'));
        controls.set('rightPressed', this.track.event.keyboard.isDown('Right'));
        controls.set('turnPressed', this.track.event.keyboard.isDown('Z'));

        controls.forEach((pressed, mapKey) => {
            // this[mapKey] refers to the this.xxxPressed properties of BikeRunner
            if (pressed !== this[mapKey]) {
                this.instance.keyLog.get(mapKey).push(this.track.time.toString());
                this[mapKey] = pressed;
            }
        });

        if ([...controls.values()].some(Boolean)) {
            this.track.focalPoint = this.instance.hitbox;
            this.track.toolManager.active = false;
        }
    }

    renderInstance(ctx) {
        BikeRenderer.render(ctx, this.instance, 1);
    }
}