import { MODIFIERS } from "../../constant/ItemConstants.js";
import StatusItem from "../StatusItem.js";

export default class Invincibility extends StatusItem {
    static get itemName() { return 'Invincibility'; }
    static get color() { return '#55f'; }
    static get reachedColor() { return '#aaf'; }
    static get code() { return 'I'; }

    onReach(part) {
        part.bike.runner.modifiersMask |= MODIFIERS.INVINCIBILITY;
    }
}