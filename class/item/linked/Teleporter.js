import LinkedItem from "../LinkedItem.js";

export default class Teleporter extends LinkedItem {
    static get itemName() { return 'Teleporter'; }
    static get color() { return '#f0f'; }
    static get reachedColor() { return '#faf'; }
    static get code() { return 'W'; }

    onReach(part) {
        if (this.linkedItem) {
            let distance = this.pos.sub(this.linkedItem.pos);
            part.bike.points.forEach(point => {
                point.pos.selfAdd(distance);
                point.oldPos.selfAdd(distance);
                this.track.camera.set(this.track.focalPoint.pos);
            });
        }

        super.onReach(part);
    }
}