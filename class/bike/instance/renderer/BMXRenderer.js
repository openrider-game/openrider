import { MODIFIERS } from "../../../constant/ItemConstants.js";
import LinePath from "../../../numeric/LinePath.js";
import Transform from "../../../numeric/Transform.js";
import Vector from "../../../numeric/Vector.js";
import Bike from "../Bike.js";

export default class BMXRenderer {
    /**
     *
     * @param {CanvasRenderingContext2D} ctx
     * @param {Bike} bike
     * @param {number} opacityFactor
     */
    static render(ctx, bike, opacityFactor) {
        let backWheel = bike.backWheel.displayPos.toPixel(bike.track);
        let frontWheel = bike.frontWheel.displayPos.toPixel(bike.track);
        let hitbox = bike.hitbox.displayPos.toPixel(bike.track);

        // x axis goes left to right, y axis goes top to bottom
        // i'm naming variables according to this image:
        // https://previews.123rf.com/images/normaals/normaals2002/normaals200200014/139539943-bike-parts-labeled-vector-illustration-diagram-bicycle-equipment-elements-scheme-with-seat-post-dera.jpg
        let wheelsDistance = frontWheel.sub(backWheel);
        let wheelsDistance90deg = new Vector((frontWheel.y - backWheel.y) * bike.direction, (backWheel.x - frontWheel.x) * bike.direction);

        let bikeTransform = new Transform(backWheel, wheelsDistance, wheelsDistance90deg);

        let wheelLineWidth = 3.5;
        let wheelRadius = (bike.backWheel.size - wheelLineWidth / 2) * bike.track.zoomFactor;

        let seatStay = bikeTransform.scale(0.3, 0.25);
        let topTube = bikeTransform.scale(0.84, 0.42);
        let steer = bikeTransform.scale(0.84, 0.37);
        let downTube = bikeTransform.scale(0.4, 0.05);

        let pedalRelativePos = new Vector(6 * bike.track.zoomFactor * Math.cos(bike.distance), 6 * bike.track.zoomFactor * Math.sin(bike.distance));
        let pedalA = downTube.add(pedalRelativePos);
        let pedalB = downTube.sub(pedalRelativePos);
        let saddleA = bikeTransform.scale(0.17, 0.38);
        let saddleB = bikeTransform.scale(0.3, 0.45);
        let seatTube = bikeTransform.scale(0.25, 0.4);

        let brake = bikeTransform.scale(0.97, 0);
        let frontFork = bikeTransform.scale(0.8, 0.48);
        let headset = bikeTransform.scale(0.86, 0.5);
        let handlebarStem = bikeTransform.scale(0.82, 0.65);
        let handlebarGrips = bikeTransform.scale(0.78, 0.67);

        ctx.save();

        ctx.strokeStyle = bike.color;
        ctx.globalAlpha = opacityFactor;
        ctx.lineWidth = wheelLineWidth * bike.track.zoomFactor;

        // ---------- wheels
        ctx.beginPath();

        if(bike.runner.modifiersMask & MODIFIERS.SLIPPERY) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = "#5bf";
        }

        // back wheel
        ctx.arc(backWheel.x, backWheel.y, wheelRadius, 0, 2 * Math.PI, true);
        // front wheel
        ctx.moveTo(frontWheel.x + wheelRadius, frontWheel.y);
        ctx.arc(frontWheel.x, frontWheel.y, wheelRadius, 0, 2 * Math.PI, true);
        ctx.stroke();

        ctx.shadowBlur = 0;
        ctx.shadowColor = "#000";

        // ---------- bike parts
        ctx.lineWidth = 3 * bike.track.zoomFactor;
        LinePath.render(ctx, [
            // main structure
            [backWheel, seatStay, topTube],
            [steer, downTube, backWheel],
            // pedals
            [pedalA, pedalB],
            // saddle
            [saddleA, saddleB],
            // seat tube
            [downTube, seatTube],
            // front tube and handlebar
            [frontWheel, brake, frontFork, headset, handlebarStem, handlebarGrips]
        ]);

        if (bike.runner.dead) {
            return;
        }

        if(bike.runner.modifiersMask & MODIFIERS.INVINCIBILITY) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = "#000";
        }

        let hitboxToWheelsMedianDistance = hitbox.sub(backWheel.add(wheelsDistance.scale(0.5)));

        let playerTransform = new Transform(seatStay, wheelsDistance, hitboxToWheelsMedianDistance);

        let hip = playerTransform.scale(-0.1, 0.3);
        let body = playerTransform.scale(0.05, 0.9);
        let headCenter = playerTransform.scale(0.15, 1.05);

        let legPartLength = 10 * bike.track.zoomFactor;
        let sumOfLegPartsLengthsSquared = 2 * legPartLength ** 2; // thigh & calves so 2 parts

        let hipToFootDistanceA = pedalA.sub(hip);
        let hipToFootDistanceA90deg = new Vector(hipToFootDistanceA.y * bike.direction, -hipToFootDistanceA.x * bike.direction);
        let legLengthRatioA = sumOfLegPartsLengthsSquared / hipToFootDistanceA.lengthSquared();
        let knee = hip.add(hipToFootDistanceA.scale(0.5)).add(hipToFootDistanceA90deg.scale(legLengthRatioA));

        let hipToFootDistanceB = pedalB.sub(hip);
        let hipToFootDistanceB90deg = new Vector(hipToFootDistanceB.y * bike.direction, -hipToFootDistanceB.x * bike.direction);
        let legLengthRatioB = sumOfLegPartsLengthsSquared / hipToFootDistanceB.lengthSquared();
        let shadowKnee = hip.add(hipToFootDistanceB.scale(0.5)).add(hipToFootDistanceB90deg.scale(legLengthRatioB));

        let headRadius = 5 * bike.track.zoomFactor;

        let armLength = 9 * bike.track.zoomFactor;
        let forearmLength = 7 * bike.track.zoomFactor;
        let sumOfArmPartsLengthsSquared = armLength ** 2 + forearmLength ** 2;

        let bodyToHandDistance = body.sub(handlebarGrips);
        let bodyToHandDistance90deg = new Vector(bodyToHandDistance.y * bike.direction, -bodyToHandDistance.x * bike.direction);
        let armLengthRatio = sumOfArmPartsLengthsSquared / bodyToHandDistance.lengthSquared();
        let elbow = handlebarGrips.add(bodyToHandDistance.scale(0.4)).add(bodyToHandDistance90deg.scale(armLengthRatio));

        ctx.lineCap = 'round';
        ctx.lineWidth = 6 * bike.track.zoomFactor;
        ctx.globalAlpha = 0.5 * opacityFactor;

        // ---------- player
        // shadow leg
        LinePath.render(ctx, [
            [pedalB, shadowKnee, hip]
        ]);
        // leg
        ctx.globalAlpha = opacityFactor;
        LinePath.render(ctx, [
            [pedalA, knee, hip]
        ]);
        // body
        ctx.lineWidth = 8 * bike.track.zoomFactor;
        LinePath.render(ctx, [
            [hip, body]
        ]);
        // head
        ctx.lineWidth = 2 * bike.track.zoomFactor;
        ctx.beginPath();
        ctx.moveTo(headCenter.x + headRadius, headCenter.y)
        ctx.arc(headCenter.x, headCenter.y, headRadius, 0, 2 * Math.PI, true);
        ctx.stroke();
        // head gear
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
        // arm
        ctx.lineWidth = 5 * bike.track.zoomFactor;
        LinePath.render(ctx, [
            [body, elbow, handlebarGrips]
        ]);

        ctx.restore();
    }
}