import { RENDERER_MAP } from "../../../constant/BikeConstants.js";
import Bike from "../Bike.js";

export default class BikeRenderer {
    /**
     *
     * @param {CanvasRenderingContext2D} ctx
     * @param {Bike} bike
     * @param {number} opacityFactor
     */
    static render(ctx, bike, opacityFactor) {
        let renderer = RENDERER_MAP[bike.constructor.name];

        if (renderer != null) {
            renderer.render(ctx, bike, opacityFactor);
        }
    }
}