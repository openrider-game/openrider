import GameObject from "../game/GameObject.js";
import Track from "../track/Track.js";
import GameState from "./GameState.js";

export default class StateManager extends GameObject {
    constructor(game, canvas, opt) {
        if (StateManager.instance) {
            return StateManager.instance;
        }

        super();

        this.game = game;
        this.track = new Track(canvas, opt);
        /** @type {GameState} */
        this.gameState = null;
        this.stateMap = new Map();

        StateManager.instance = this;
    }

    /**
     *
     * @param {GameState} gameState
     */
    setState(gameState) {
        if (this.gameState) {
            this.gameState.onLeave();
        }

        if (!this.stateMap.has(gameState)) {
            this.stateMap.set(gameState, new gameState(this));
        }
        this.gameState = this.stateMap.get(gameState);
        this.gameState.onEnter();
    }

    fixedUpdate() {
        if (this.gameState) {
            this.gameState.fixedUpdate();
        }
    }

    update(progress, delta) {
        if (this.gameState) {
            this.gameState.update(progress, delta);
        }
    }

    render(ctx) {
        if (this.gameState) {
            this.gameState.render(ctx);
        }
    }
}

StateManager.instance = null;