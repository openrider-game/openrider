import GameObject from "../game/GameObject.js";;
import StateManager from "./StateManager.js";

export default class GameState extends GameObject {
    constructor(manager) {
        super();

        /** @type {StateManager} */
        this.manager = manager;
    }

    get track() { return this.manager.track; }
    set track(track) { this.manager.track = track; }

    onEnter() {}
    onLeave() {}
}