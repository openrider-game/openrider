import Color from "../numeric/Color.js";
import GhostParser from "../parser/GhostParser.js";
import BikeRunner from "./BikeRunner.js";
import BikeRenderer from "./instance/renderer/BikeRenderer.js";

export default class GhostRunner extends BikeRunner {
    constructor(track, ghostString) {
        let ghostMap = GhostParser.parse(ghostString);

        super(track, ghostMap.get('bike'));

        /** @type {Map<string, Array<number>>} */
        this.keys = ghostMap.get('keys');
        this.finalTime = ghostMap.get('time');
        this.ghostName = ghostMap.get('name');
    }

    assignColor() {
        this.instance.color = Color.generateRandomDark();
    }

    onHitTarget() {
        if (this.targetsReached.size >= this.track.targets.size) {
            this.done = true;
        }
    }

    updateControls() {
        this.keys.forEach((keyArray, mapKey) => {
            if (keyArray.includes(this.track.time.toString())) {
                // this[mapKey] refers to the this.xxxPressed properties of BikeRunner
                this[mapKey] = !this[mapKey];
            }
        });
    }

    /**
     *
     * @param {CanvasRenderingContext2D} ctx
     */
    renderInstance(ctx) {
        BikeRenderer.render(ctx, this.instance, 0.6);

        let bikePos = this.instance.backWheel.displayPos
            .add(this.instance.frontWheel.displayPos)
            .add(this.instance.hitbox.displayPos)
            .scale(1 / 3)
            .toPixel(this.track);

        ctx.save();
        ctx.font = `bold ${Math.min(25 * this.track.zoomFactor, 15)}px Ubuntu`;

        let ghostNameMetrics = ctx.measureText(this.ghostName);
        let ghostNameWidth = ghostNameMetrics.width;
        ctx.fillStyle = this.instance.color;

        let nameX = bikePos.x - ghostNameWidth / 2;
        let nameY = bikePos.y - this.instance.hitbox.size * 4 * this.track.zoomFactor;

        ctx.fillText(this.ghostName, nameX, nameY);
        ctx.restore();
    }
}