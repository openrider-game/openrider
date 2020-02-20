export class GhostBike {
    constructor(ghostKeys, cp, parent) {
        this.ghostKeys = ghostKeys;
        this.name = ghostKeys[7] || 'Ghost';
        this.parnt = parent;
        this.targetsReached = cp[31] || 0;
        this.cap = 'hat';
        this.isGhost = true;
        this.currentTime =
            this.distance = 0;
        this.reached = {};
    }

    turn() {
        var self = this;
        self.direction *= -1;
        self.frontToBack.turn();
        var headToBack = self.joints[0].len;
        self.headToBack.len = self.joints[2].len;
        self.headToFront.len = headToBack;
    }

    proceed() {
        var self = this,
            bikeTime = self.parnt.currentTime,
            i = 0;
        if (bikeTime > self.time) {
            self.proceed = () => {};
        }
        if (self.ghostKeys[0][bikeTime]) {
            self.leftPressed = self.leftPressed ? 0 : 1;
        }
        if (self.ghostKeys[1][bikeTime]) {
            self.rightPressed = self.rightPressed ? 0 : 1;
        }
        if (self.ghostKeys[2][bikeTime]) {
            self.upPressed = self.upPressed ? 0 : 1;
        }
        if (self.ghostKeys[3][bikeTime]) {
            self.downPressed = self.downPressed ? 0 : 1;
        }
        if (self.ghostKeys[4][bikeTime]) {
            self.turn();
        }
        self.BS();
        for (i = self.joints.$length - 1; i >= 0; i--) {
            self.joints[i].proceed();
        }
        for (i = self.points.$length - 1; i >= 0; i--) {
            self.points[i].proceed();
        }
        if (self.backWheel.driving && self.frontWheel.driving) {
            self.slow = false;
        }
        if (!self.slow) {
            self.BS();
            for (i = self.joints.$length - 1; i >= 0; i--) {
                self.joints[i].proceed();
            }
            for (i = self.points.$length - 1; i >= 0; i--) {
                self.points[i].proceed();
            }
        }
        self.currentTime += 40;
    }

    enghosten(arr) {
        return arr.map(function(cp) {
            cp = cp.concat();
            cp[28] = cp[29] = cp[30] = 0;
            return cp;
        });
    }
}