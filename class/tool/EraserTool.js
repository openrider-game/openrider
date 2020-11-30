import Control from "../keyboard/Control.js";
import * as KeyCode from "../keyboard/KeyCode.js";
import Tool from "./Tool.js";

export default class EraserTool extends Tool {
    static get toolName() { return 'Eraser'; }
    static get keyLabel() { return 'E'; }
    static get key() { return new Control(KeyCode.DOM_VK_E); }
    static get icon() { return 'eraser'; }

    constructor(track) {
        super(track);

        this.size = 15;
        this.minSize = 5;
        this.maxSize = 40;

        this.restrict = new Map();
        this.restrict.set('foregroundLayer', new Map());
        this.restrict.get('foregroundLayer').set('line', true);
        this.restrict.get('foregroundLayer').set('scenery', true);
        this.restrict.get('foregroundLayer').set('object', false); // no objects in foreground
        this.restrict.set('mainLayer', new Map());
        this.restrict.get('mainLayer').set('line', true);
        this.restrict.get('mainLayer').set('scenery', true);
        this.restrict.get('mainLayer').set('object', true);
    }

    onMouseDown(e) {
        super.onMouseDown(e);
        this.onMouseMove(e);
    }

    onMouseMove(e) {
        super.onMouseMove(e);
        if (this.mouseDown) {
            let deleted = this.track.checkDelete(this.track.mousePos, this.size, this.restrict);
            if (deleted.length) {
                this.track.undoManager.push({
                    undo: () => deleted.forEach(e => e.addToTrack()),
                    redo: () => deleted.forEach(e => e.removeFromTrack())
                });
            }
        }
    }

    onScroll(e) {
        if (this.isHolding()) {
            this.size = Math.max(this.minSize, Math.min(this.maxSize, this.size + 5 * -Math.sign(e.deltaY)));
        } else {
            super.onScroll(e);
        }
    }

    openOptions() {
        let foregroundLineLabel = document.createElement('label');
        foregroundLineLabel.setAttribute('for', 'foregroundLineCheckbox');
        foregroundLineLabel.textContent = 'Foreground Line:';

        let foregroundLineCheckbox = document.createElement('input');
        foregroundLineCheckbox.id = 'foregroundLineCheckbox';
        foregroundLineCheckbox.type = 'checkbox';
        foregroundLineCheckbox.checked = this.restrict.get('foregroundLayer').get('line');

        let foregroundSceneryLabel = document.createElement('label');
        foregroundSceneryLabel.setAttribute('for', 'foregroundSceneryCheckbox');
        foregroundSceneryLabel.textContent = 'Foreground Scenery:';

        let foregroundSceneryCheckbox = document.createElement('input');
        foregroundSceneryCheckbox.id = 'foregroundSceneryCheckbox';
        foregroundSceneryCheckbox.type = 'checkbox';
        foregroundSceneryCheckbox.checked = this.restrict.get('foregroundLayer').get('scenery');

        let lineLabel = document.createElement('label');
        lineLabel.setAttribute('for', 'lineCheckbox');
        lineLabel.textContent = 'Line:';

        let lineCheckbox = document.createElement('input');
        lineCheckbox.id = 'lineCheckbox';
        lineCheckbox.type = 'checkbox';
        lineCheckbox.checked = this.restrict.get('mainLayer').get('line');

        let sceneryLabel = document.createElement('label');
        sceneryLabel.setAttribute('for', 'sceneryCheckbox');
        sceneryLabel.textContent = 'Scenery:';

        let sceneryCheckbox = document.createElement('input');
        sceneryCheckbox.id = 'sceneryCheckbox';
        sceneryCheckbox.type = 'checkbox';
        sceneryCheckbox.checked = this.restrict.get('mainLayer').get('scenery');

        let objectLabel = document.createElement('label');
        objectLabel.setAttribute('for', 'objectCheckbox');
        objectLabel.textContent = 'Object:';

        let objectCheckbox = document.createElement('input');
        objectCheckbox.id = 'objectCheckbox';
        objectCheckbox.type = 'checkbox';
        objectCheckbox.checked = this.restrict.get('mainLayer').get('object');

        let buttonOk = document.createElement('button');
        buttonOk.textContent = 'OK';
        buttonOk.addEventListener('click', () => this.hideOptions());

        let foregroundLineDiv = document.createElement('div');
        let foregroundSceneryDiv = document.createElement('div');
        let lineDiv = document.createElement('div');
        let sceneryDiv = document.createElement('div');
        let objectDiv = document.createElement('div');
        let buttonDiv = document.createElement('div');

        foregroundLineDiv.appendChild(foregroundLineLabel);
        foregroundLineDiv.appendChild(foregroundLineCheckbox);
        foregroundSceneryDiv.appendChild(foregroundSceneryLabel);
        foregroundSceneryDiv.appendChild(foregroundSceneryCheckbox);
        lineDiv.appendChild(lineLabel);
        lineDiv.appendChild(lineCheckbox);
        sceneryDiv.appendChild(sceneryLabel);
        sceneryDiv.appendChild(sceneryCheckbox);
        objectDiv.appendChild(objectLabel);
        objectDiv.appendChild(objectCheckbox);

        buttonDiv.appendChild(buttonOk);

        options.appendChild(foregroundLineDiv);
        options.appendChild(foregroundSceneryDiv);
        options.appendChild(lineDiv);
        options.appendChild(sceneryDiv);
        options.appendChild(objectDiv);
        options.appendChild(buttonDiv);
    }

    closeOptions() {
        this.restrict.get('foregroundLayer').set('line', foregroundLineCheckbox.checked);
        this.restrict.get('foregroundLayer').set('scenery', foregroundSceneryCheckbox.checked);
        this.restrict.get('mainLayer').set('line', lineCheckbox.checked);
        this.restrict.get('mainLayer').set('scenery', sceneryCheckbox.checked);
        this.restrict.get('mainLayer').set('object', objectCheckbox.checked);
    }

    render(ctx) {
        let pos = this.track.mousePos.toPixel(this.track);
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, this.size * this.track.zoomFactor, 0, 2 * Math.PI, true);
        ctx.fillStyle = "#ffb6c1";
        ctx.fill();
    }
}