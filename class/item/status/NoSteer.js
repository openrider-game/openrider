import { MODIFIERS } from "../../constant/ItemConstants.js";
import StatusItem from "../StatusItem.js";

export default class NoSteer extends StatusItem {
    static get itemName() { return 'No Steer'; }
    static get color() { return '#ff5'; }
    static get reachedColor() { return '#ffa'; }
    static get code() { return 'N'; }

    onReach(part) {
        part.bike.steerValueScale = 0;

        part.bike.runner.modifiersMask |= MODIFIERS.NO_STEER;
    }
}