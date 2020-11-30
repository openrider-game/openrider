import LinePath from "../../../../numeric/LinePath.js";
import Transform from "../../../../numeric/Transform.js";
import Bike from "../../Bike.js";

export default class HeadGearRenderer {
    /**
     *
     * @param {CanvasRenderingContext2D} ctx
     * @param {Bike} bike
     * @param {Transform} playerTransform
     */
    static render(ctx, bike, playerTransform) {
        switch (bike.headGear) {
            case 'cap':
                let capFront = playerTransform.scale(0.4, 1.1);
                let capBack = playerTransform.scale(0.05, 1.05);

                LinePath.render(ctx, [
                    [capBack, capFront]
                ]);
                break;
            case 'hat':
                let hatFrontBottom = playerTransform.scale(0.35, 1.15);
                let hatBackBottom = playerTransform.scale(-0.05, 1.1);
                let hatFront = playerTransform.scale(0.25, 1.13);
                let hatBack = playerTransform.scale(0.05, 1.11);
                let hatFrontTop = hatFrontBottom.sub(playerTransform.x.scale(0.1)).selfAdd(playerTransform.y.scale(0.2));
                let hatBackTop = hatBackBottom.add(playerTransform.x.scale(0.02)).selfAdd(playerTransform.y.scale(0.2));

                ctx.fillStyle = bike.color;
                LinePath.render(ctx, [
                    [hatFrontBottom, hatFront, hatFrontTop, hatBackTop, hatBack, hatBackBottom]
                ]);
                ctx.fill();
                break;
            case 'party':
                let partyHatFront = playerTransform.scale(0.28, 1.15);
                let partyHatBack = playerTransform.scale(0, 1.1);
                let partyHatTop = partyHatBack.add(playerTransform.x.scale(0.07)).add(playerTransform.y.scale(0.33));
                let pompom = partyHatTop.sub(playerTransform.x.scale(0.01)).sub(playerTransform.y.scale(0.03));
                let pompomRadius = 3 * bike.track.zoomFactor;

                ctx.fillStyle = '#3960ad';
                LinePath.render(ctx, [
                    [partyHatFront, partyHatTop, partyHatBack]
                ]);
                ctx.fill();

                ctx.strokeStyle = '#70d135';
                ctx.lineWidth = 4 * bike.track.zoomFactor;
                LinePath.render(ctx, [
                    [partyHatFront, partyHatBack]
                ]);

                ctx.fillStyle = '#ffd600';
                ctx.lineWidth = 2 * bike.track.zoomFactor;

                ctx.beginPath();
                ctx.moveTo(partyHatTop.x, partyHatTop.y);
                ctx.arc(pompom.x, pompom.y, pompomRadius, 0, 2 * Math.PI);
                ctx.fill();

                ctx.fillStyle = bike.color;
                ctx.strokeStyle = bike.color;
                break;
            case 'ninja':
                let headBandFront = playerTransform.scale(0.26, 1.1);
                let headBandBack = playerTransform.scale(0.05, 1.05);
                let headbandKnotA = headBandBack.sub(playerTransform.x.scale(0.20)).add(playerTransform.y.scale(0.05));
                let headbandKnotB = headBandBack.sub(playerTransform.x.scale(0.20)).sub(playerTransform.y.scale(0.05));

                ctx.lineWidth = 5 * bike.track.zoomFactor;
                LinePath.render(ctx, [
                    [headBandFront, headBandBack]
                ])

                ctx.lineWidth = 2 * bike.track.zoomFactor;
                LinePath.render(ctx, [
                    [headBandBack, headbandKnotA],
                    [headBandBack, headbandKnotB]
                ]);
        }
    }
}