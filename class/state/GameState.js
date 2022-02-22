import GameObject from "../game/GameObject.js";
import UIManager from "../ui/manager/UIManager.js";
import StateManager from "./StateManager.js";

export default class GameState extends GameObject {
    constructor(manager) {
        super();

        this.isTrackUpload = false;
        /** @type {StateManager} */
        this.manager = manager;
        this.ui = new UIManager(this.track);
    }

    get track() { return this.manager.track; }
    set track(track) { this.manager.track = track; }

    onEnter() {}
    onLeave() {}

    onMouseDown(e) {}
    onMouseUp(e) {}
    onMouseMove(e) {}
    onScroll(e) {}
    onContextMenu(e) {}
    onKeyboardDown(e) {}
    onVisibilityChange() {}
}