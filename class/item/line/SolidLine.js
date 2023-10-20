import Part from "../../entity/Part.js";
import Vector from "../../numeric/Vector.js";
import Line from "./Line.js";

export default class SolidLine extends Line {
    onDelete() {
        this.grid.totalSolidLines.delete(this.id);
    }

    onAdd() {
        this.grid.totalSolidLines.set(this.id, this);
    }

    /**
     *
     * @param {Part} part
     */
    touch(part) {
        if (!this.touched) {
            this.touched = true;

            let vectorToPart = null;
            let posDistance = part.pos.sub(this.pos);
            let relativePosOnLine = posDistance.dot(this.vector) / this.len / this.len;
            let passedThrough = 1;

            // Is our part directly above or below the line
            if (relativePosOnLine >= 0 && relativePosOnLine <= 1) {
                let diffVel = posDistance.sub(part.velocity);
                let perpendicularPosCross = posDistance.x * this.vector.y - posDistance.y * this.vector.x;
                let perpendicularVelCross = diffVel.x * this.vector.y - diffVel.y * this.vector.x;
                // passedThrough is negative if the part has gone through the line during the last position update
                passedThrough = perpendicularPosCross * perpendicularVelCross < 0 ? -1 : 1;
                vectorToPart = posDistance.sub(this.vector.scale(relativePosOnLine));
            }

            // Is our part close enough to the edges
            else if (relativePosOnLine * this.len >= -part.size && relativePosOnLine * this.len <= this.len + part.size) {
                let edge = relativePosOnLine > 0 ? this.endPos : this.pos;
                vectorToPart = part.pos.sub(edge);
            }

            let distanceToPart = vectorToPart ? vectorToPart.getLength() : 0;
            // If we are currently colliding or have gone through the line, compute collision.
            // That way if we have a velocity that's big enough that we would go past a collision in 1 update,
            // we can still catch it. (if we are fast enough to cross multiple cells at once, it fails but eh)
            if ((distanceToPart < part.size || passedThrough < 0) && distanceToPart !== 0) {
                part.pos.selfAdd(vectorToPart.scale((part.size * passedThrough - distanceToPart) / distanceToPart));
                part.drive(new Vector(-vectorToPart.y / distanceToPart, vectorToPart.x / distanceToPart));
            }
        }
    }
}