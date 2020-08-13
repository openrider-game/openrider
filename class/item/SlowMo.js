import { Item } from "./Item.js";

export class SlowMo extends Item {
    constructor(x, y, parent) {
        super(x, y, parent);
        this.$color = '#eee';
        this.$name = 'S';
        this.$code = 's';
    }

    touch(part) {
        if (part.pos.distanceToSquared(this.pos) < 500) {
            part.bike.setSlow(true);
        }
    }
}