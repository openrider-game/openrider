import Bike from "../Bike.js";
import BMX from "../BMX.js";
import BMXRenderer from "./BMXRenderer.js";

export default class BikeRenderer {
    /**
     *
     * @param {CanvasRenderingContext2D} ctx
     * @param {Bike} bike
     * @param {number} opacityFactor
     */
    static render(ctx, bike, opacityFactor) {
        let renderer = null;
        if (bike instanceof BMX) {
            renderer = BMXRenderer;
        }
        renderer.render(ctx, bike, opacityFactor);
    }
}