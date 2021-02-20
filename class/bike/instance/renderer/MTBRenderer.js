import LinePath from "../../../numeric/LinePath.js";
import Transform from "../../../numeric/Transform.js";
import Vector from "../../../numeric/Vector.js";
import Bike from "../Bike.js";

export default class MTBRenderer {
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

        let wheelsDistance = frontWheel.sub(backWheel);
        let wheelsDistance90deg = new Vector((frontWheel.y - backWheel.y) * bike.direction, (backWheel.x - frontWheel.x) * bike.direction);
        let hitBoxDistance = hitbox.sub(backWheel.add(wheelsDistance.scale(0.5)));

        let bikeTransform = new Transform(backWheel, wheelsDistance, wheelsDistance90deg);
        let hitboxTransform = new Transform(backWheel, wheelsDistance, hitBoxDistance);

        let wheelLineWidth = 3.5;
        let wheelRadius = (bike.backWheel.size - wheelLineWidth / 2) * bike.track.zoomFactor;

        let chainStay = bikeTransform.scale(0.4, 0.05);
        let seatTube = hitboxTransform.scale(0.46, 0.4);
        let topTube = hitboxTransform.scale(0.72, 0.64);

        let downTube = bikeTransform.scale(0.43, 0.05);

        let seatPostA = hitboxTransform.scale(0.45, 0.3);
        let seatPostB = hitboxTransform.scale(0.3, 0.4);

        let steer = hitboxTransform.scale(0.46, 0.4);
        let steerConnector = hitboxTransform.scale(0.28, 0.5);

        let saddle = hitboxTransform.scale(0.25, 0.6);
        let saddleA = hitboxTransform.scale(0.17, 0.6);
        let saddleB = hitboxTransform.scale(0.3, 0.6);

        let pedalRelativePos = new Vector(6 * bike.track.zoomFactor * Math.cos(bike.distance), 6 * bike.track.zoomFactor * Math.sin(bike.distance));
        let pedalA = chainStay.add(pedalRelativePos);
        let pedalB = chainStay.sub(pedalRelativePos);

        let frontFork = hitboxTransform.scale(0.71, 0.73);
        let headset = hitboxTransform.scale(0.73, 0.77);
        let handlebarGrips = hitboxTransform.scale(0.7, 0.8);

        ctx.strokeStyle = bike.color;
        ctx.globalAlpha = opacityFactor;
        ctx.lineWidth = wheelLineWidth * bike.track.zoomFactor;

        // ---------- wheels
        ctx.beginPath();
        // back wheel
        ctx.arc(backWheel.x, backWheel.y, wheelRadius, 0, 2 * Math.PI, true);
        // front wheel
        ctx.moveTo(frontWheel.x + wheelRadius, frontWheel.y);
        ctx.arc(frontWheel.x, frontWheel.y, wheelRadius, 0, 2 * Math.PI, true);
        ctx.stroke();
        // ---------- wheels axes
        ctx.fillStyle = bike.color;
        ctx.globalAlpha = 0.5 * opacityFactor;
        ctx.beginPath();
        // back wheel
        ctx.arc(backWheel.x, backWheel.y, wheelRadius * 0.5, 0, 2 * Math.PI, true);
        // front wheel
        ctx.moveTo(frontWheel.x + wheelRadius, frontWheel.y);
        ctx.arc(frontWheel.x, frontWheel.y, wheelRadius * 0.4, 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.globalAlpha = opacityFactor;
        // ---------- bike parts
        ctx.lineWidth = 5 * bike.track.zoomFactor;
        LinePath.render(ctx, [
            // main structure
            [backWheel, chainStay],
            [topTube, seatTube, chainStay]
        ]);

        ctx.lineWidth = 2 * bike.track.zoomFactor;
        LinePath.render(ctx, [
            [topTube, downTube],
            [seatPostA, seatPostB, saddle],
            [saddleA, saddleB],
            [pedalA, pedalB]
        ]);

        ctx.lineWidth = bike.track.zoomFactor;
        LinePath.render(ctx, [
            [steer, steerConnector]
        ]);

        ctx.lineWidth = 3 * bike.track.zoomFactor;
        LinePath.render(ctx, [
            [frontWheel, frontFork, headset, handlebarGrips]
        ]);

        if (bike.runner.dead) {
            return;
        }

        let crossFrameSaddle = hitboxTransform.scale(0.3, 0.25);
        let playerTransform = new Transform(crossFrameSaddle, wheelsDistance, hitBoxDistance);

        let hip = playerTransform.scale(-0.05, 0.42);
        let body = playerTransform.scale(0.1, 0.93);
        let headCenter = playerTransform.scale(0.2, 1.09);

        let footMedianDistance = hitboxTransform.scale(0.4, 0.05);
        let hand = hitboxTransform.scale(0.67, 0.8);
        let legPartLength = 10 * bike.track.zoomFactor;
        let sumOfLegPartsLengthsSquared = 2 * legPartLength ** 2; // thigh & calves so 2 parts

        let hipToFootDistanceA = footMedianDistance.sub(hip);
        let hipToFootDistanceA90deg = new Vector(hipToFootDistanceA.y * bike.direction, -hipToFootDistanceA.x * bike.direction);
        let legLengthRatioA = sumOfLegPartsLengthsSquared / hipToFootDistanceA.lengthSquared();
        let knee = hip.add(hipToFootDistanceA.scale(0.5)).add(hipToFootDistanceA90deg.scale(legLengthRatioA));

        let hipToFootDistanceB = footMedianDistance.sub(hip);
        let hipToFootDistanceB90deg = new Vector(hipToFootDistanceB.y * bike.direction, -hipToFootDistanceB.x * bike.direction);
        let legLengthRatioB = sumOfLegPartsLengthsSquared / hipToFootDistanceB.lengthSquared();
        let shadowKnee = hip.add(hipToFootDistanceB.scale(0.5)).add(hipToFootDistanceB90deg.scale(legLengthRatioB));

        let headRadius = 5 * bike.track.zoomFactor;

        let armLength = 8 * bike.track.zoomFactor;
        let forearmLength = 4 * bike.track.zoomFactor;
        let sumOfArmPartsLengthsSquared = armLength ** 2 + forearmLength ** 2;

        let bodyToHandDistance = body.sub(hand);
        let bodyToHandDistance90deg = new Vector(bodyToHandDistance.y * bike.direction, -bodyToHandDistance.x * bike.direction);
        let armLengthRatio = sumOfArmPartsLengthsSquared / bodyToHandDistance.lengthSquared();
        let elbow = hand.add(bodyToHandDistance.scale(0.3)).add(bodyToHandDistance90deg.scale(armLengthRatio));

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
        ctx.lineWidth = 2 * bike.track.zoomFactor;
        ctx.beginPath();
        ctx.moveTo(headCenter.x + headRadius, headCenter.y)
        ctx.arc(headCenter.x, headCenter.y, headRadius, 0, 2 * Math.PI, true);
        ctx.stroke();
        // head gear
        let hatFrontBottom = playerTransform.scale(0.37, 1.19);
        let hatBackBottom = playerTransform.scale(0.02, 1.14);
        let hatFront = playerTransform.scale(0.28, 1.17);
        let hatBack = playerTransform.scale(0.09, 1.15);
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
            [body, elbow, hand]
        ]);

        ctx.strokeStyle = '#000';
        ctx.globalAlpha = 1;
    }
}