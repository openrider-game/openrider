import { MODIFIERS } from "../../constant/ItemConstants.js";
import StatusItem from "../StatusItem.js";

export default class Slippery extends StatusItem {
    static get itemName() { return 'Slippery'; }
    static get color() { return '#999'; }
    static get reachedColor() { return '#aaa'; }
    static get code() { return 'H'; }

    onReach(part) {
        part.bike.friction = 1;
        part.bike.backWheel.motor = 0.05;
        part.bike.frontWheel.motor = 0.05;
        part.bike.speedValueScale = 0.5;

        part.bike.runner.modifiersMask |= MODIFIERS.SLIPPERY;
    }
}