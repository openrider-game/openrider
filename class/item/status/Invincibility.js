import { MODIFIERS } from "../../constant/ItemConstants.js";
import StatusItem from "../StatusItem.js";

export default class Invincibility extends StatusItem {
    static get itemName() { return 'Reset'; }
    static get color() { return '#f55'; }
    static get reachedColor() { return '#faa'; }
    static get code() { return 'I'; }

    onReach(part) {
        part.bike.runner.modifiersMask = MODIFIERS.INVINCIBILITY;
    }
}