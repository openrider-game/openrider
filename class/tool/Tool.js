import Track from "../track/Track.js";
import GameObject from "../game/GameObject.js";

export default class Tool extends GameObject {
    static get toolName() { return 'Tool'; }
    static get keyLabel() { return null; }
    static get key() { return null; }
    static get icon() { return null; }

    /**
     *
     * @param {Track} track
     */
    constructor(track) {
        super();
        this.track = track;
        this.mouseDown = false;
        this.alwaysRender = false;
    }

    registerControls() {
        if (this.constructor.keyLabel != null && this.constructor.key != null) {
            this.track.event.keyboard.registerControl(this.constructor.keyLabel, this.constructor.key);
            document.addEventListener('keyboarddown', (e) => {
                if (e.detail === this.constructor.keyLabel) {
                    this.run();
                }
            });
        }
    }

    getDOM() {
        let el = document.createElement('div');
        el.classList.add('tool');
        el.title = `${this.constructor.toolName} (${this.constructor.keyLabel})`;

        if (this.constructor.icon) {
            this.domIcon = document.createElement('img');

            if (this.constructor.icon.type === 'b64') {
                this.domIcon.setAttribute('src', this.constructor.icon.data);
            } else {
                this.domIcon.setAttribute('src', `./media/icon/${this.constructor.icon}.svg`);
            }

            el.appendChild(this.domIcon);
        }

        el.addEventListener('click', () => this.run());
        el.addEventListener('contextmenu', (e) => this.showOptions(e));

        this.dom = el;
        return el;
    }

    isHolding() {
        return this.track.event.keyboard.isDown(this.constructor.keyLabel);
    }

    run() {
        this.track.toolManager.setTool(this);
    }

    showOptions(e) {
        e.preventDefault();
        if (!this.track.toolManager.optionsOpened && this.track.toolManager.tool === this) {
            this.track.toolManager.optionsOpened = true;
            this.openOptions();
        }
    }

    hideOptions() {
        if (this.track.toolManager.optionsOpened) {
            this.track.toolManager.optionsOpened = false;
            this.closeOptions();
            options.innerHTML = null;
            this.run();
        }
    }

    openOptions() {
        this.hideOptions();
    }

    closeOptions() {}

    activate() {
        this.track.canvas.style.cursor = 'none';
    }

    deactivate() {
        this.hideOptions();
        this.mouseDown = false;
    }

    onMouseDown(e) {
        if (e.button !== 2) {
            this.mouseDown = true;
        }
    }

    onMouseUp(e) {
        this.mouseDown = false;
    }

    onMouseMove(e) {
        this.track.focalPoint = null;
    }

    onScroll(e) {
        let pos = this.track.mousePos;
        if (this.track.focalPoint) {
            pos = this.track.focalPoint.displayPos;
        }
        this.track.zoom(pos, -Math.sign(e.deltaY));
    }

    fixedUpdate() {}
    update(progress, delta) {}
    render(ctx) {}
}