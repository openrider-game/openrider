import StatusItem from "../StatusItem.js";

export default class Reset extends StatusItem {
    static get itemName() { return 'Reset'; }
    static get color() { return '#5f5'; }
    static get reachedColor() { return '#afa'; }
    static get code() { return 'R'; }

    onReach(part) {
        part.bike.friction = 0.99;
        part.bike.backWheel.motor = 0.3;
        part.bike.frontWheel.motor = 0.3;

        part.bike.engineValueScale = 1;
        part.bike.speedValueScale = 1;
        part.bike.steerValueScale = 1;

        part.bike.runner.modifiersMask = 0;
    }
}