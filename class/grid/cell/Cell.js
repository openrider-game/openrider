import SceneryLine from "../../item/line/SceneryLine.js";
import Item from "../../item/Item.js";
import SolidLine from "../../item/line/SolidLine.js";

export default class Cell {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;

        this.scenery = new Array();
        this.lines = new Array();
        this.objects = new Array();
    }

    push(item) {
        if (item instanceof SceneryLine) {
            this.scenery.push(item);
        } else if (item instanceof SolidLine) {
            this.lines.push(item);
        } else if (item instanceof Item) {
            this.objects.push(item);
        }

        this.clear();
    }

    remove(item) {
        if (item instanceof SceneryLine) {
            this.scenery = this.scenery.filter(obj => obj !== item);
        } else if (item instanceof SolidLine) {
            this.lines = this.lines.filter(obj => obj !== item);
        } else if (item instanceof Item) {
            this.objects = this.objects.filter(obj => obj !== item);
        }

        this.clear();
    }

    clear() {}
}