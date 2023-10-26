import StatusItem from "../StatusItem.js";

export default class Reset extends StatusItem {
    static get itemName() { return 'Reset'; }
    static get color() { return '#5f5'; }
    static get reachedColor() { return '#afa'; }
    static get code() { return 'R'; }

    onReach(part) {
        part.bike.runner.modifiersMask = 0;
    }
}