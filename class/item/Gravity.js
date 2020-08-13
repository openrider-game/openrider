import { DirectionalItem } from "./DirectionalItem.js";

export class Gravity extends DirectionalItem {
    constructor(x, y, rotation, parent) {
        super(x, y, rotation, parent);
        this.direction.selfScale(0.3);
        this.$color = '#0f0';
        this.$name = 'G';
    }

    onTouch(part) {
        part.bike.gravity.set(this.direction);
    }
}