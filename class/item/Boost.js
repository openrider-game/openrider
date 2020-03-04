import { DirectionalItem } from "./DirectionalItem.js";

export class Boost extends DirectionalItem {
    constructor(x, y, rotation, parent) {
        super(x, y, rotation, parent);
        this.$color = '#ff0';
        this.$name = 'B';
    }

    onTouch(part) {
        for (let p = part.bike.points, i = 0, l = p.length; i < l; i++) {
            p[i].pos.selfAdd(this.direction);
        }
    }
}