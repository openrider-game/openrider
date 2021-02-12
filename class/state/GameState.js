import GameObject from "../game/GameObject.js";
import Track from "../track/Track.js";

export default class GameState extends GameObject {
    constructor(track) {
        super();
        /** @type {Track} */
        this.track = track;
    }

    onEnter() {}
    onLeave() {}
}