export default class GameObject {
    /**
     * Frame-rate independant update for physics calculations
     */
    fixedUpdate() {
        throw new Error('Unimplemented method fixedUpdate()');
    }

    /**
     * Updates the game object every frame
     * @param {number} progress
     * @param {number} delta
     */
    update(progress, delta) {
        throw new Error('Unimplemented method update(progress, delta)');
    }

    /**
     * Renders the game object on a canvas
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
        throw new Error('Unimplemented method render(ctx)');
    }
}