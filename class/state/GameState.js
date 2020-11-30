import GameObject from "../game/GameObject.js";
import Track from "../track/Track.js";

export default class GameState extends GameObject {
    constructor(manager) {
        super();
        this.manager = manager;
        /** @type {Track} */
        this.track = this.manager.track;
    }

    onEnter() {}
    onLeave() {}
}