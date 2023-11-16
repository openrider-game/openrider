import { MODIFIERS } from "../../constant/ItemConstants.js";
import StatusItem from "../StatusItem.js";

export default class EngineOff extends StatusItem {
    static get itemName() { return 'EngineOff'; }
    static get color() { return '#f55'; }
    static get reachedColor() { return '#faa'; }
    static get code() { return 'E'; }

    onReach(part) {
        part.bike.engineValueScale = 0;

        part.bike.runner.modifiersMask |= MODIFIERS.ENGINE_OFF;
    }
}