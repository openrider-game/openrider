import { Item } from "./Item.js";
import { Explosion } from "../effect/Explosion.js";

export class Bomb extends Item {
    constructor(x, y, parent) {
        super(x, y, parent);
        this.$color = '#f00';
        this.$name = 'O';
        this.$code = 'e';
    }

    onTouch(part) {
        this.track.bike = new Explosion(this.pos, part.bike.gravity, part.bike.time, this.track);
    }
}