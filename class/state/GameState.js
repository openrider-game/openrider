import GameObject from "../game/GameObject.js";
import Track from "../track/Track.js";
import StateManager from "./StateManager.js";

export default class GameState extends GameObject {
    constructor(manager) {
        super();

        /** @type {StateManager} */
        this.manager = manager;
        /** @type {Track} */
        this.track = manager.track;
    }

    onEnter() {}
    onLeave() {}
}