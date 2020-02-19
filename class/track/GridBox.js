export class GridBox {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.lines = [];
        this.scenery = [];
        this.objects = [];
    }

    touch(part) {
        for (var i = this.lines.length - 1; i >= 0; i--) {
            this.lines[i].touch(part);
        }
        if (!part.parnt.dead) {
            for (i = this.objects.length - 1; i >= 0; i--) {
                this.objects[i].touch(part);
            }
        }
        return this;
    }

    untouch() {
        for (var i = 0, l = this.lines.length; i < l; i++) {
            this.lines[i].touched = false;
        }
        return this;
    }

    remove() {
        var deleted = [];
        for (var i = 0, l = this.lines.length; i < l; i++) {
            if (this.lines[i] && this.lines[i].doRemove) {
                deleted.push(this.lines.splice(i--, 1)[0]);
            }
        }
        for (i = 0, l = this.scenery.length; i < l; i++) {
            if (this.scenery[i] && this.scenery[i].doRemove) {
                deleted.push(this.scenery.splice(i--, 1)[0]);
            }
        }
        for (i = 0, l = this.objects.length; i < l; i++) {
            if (this.objects[i] && this.objects[i].doRemove) {
                deleted.push(this.objects.splice(i--, 1)[0]);
            }
        }
        return deleted;
    }

    search(point, type) {
        var i = 0,
            l, line, lines = type === 'sline' ? this.scenery : this.lines;
        for (l = lines.length; i < l; i++) {
            line = lines[i];
            if (line &&
                line.a.x === point.x &&
                line.a.y === point.y &&
                !line.stringGot) {
                return line;
            }
        }
    }
}