import Vector from "./Vector.js";

export default class LinePath {
    /**
     *
     * @param {CanvasRenderingContext2D} ctx
     * @param {Array<Array<Vector>>} steps
     */
    static render(ctx, steps) {
        ctx.beginPath();
        for (let step of steps) {
            let firstStep = step.shift();
            ctx.moveTo(firstStep.x, firstStep.y);
            for (let pos of step) {
                ctx.lineTo(pos.x, pos.y);
            }
        }
        ctx.stroke();
    }
}