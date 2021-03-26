import { LEFT_TOOLBAR_EDITING, LEFT_TOOLBAR_VIEWING, RIGHT_TOOLBAR } from "../constant/ToolbarConstants.js";
import Track from "../track/Track.js";
import CameraTool from "./CameraTool.js";
import PauseTool from "./PauseTool.js";
import StartPositionTool from "./StartPositionTool.js";
import Tool from "./Tool.js";

export default class Toolbar {
    /**
     *
     * @param {Tool[]} tools
     * @param {Tool[]} instances
     */
    constructor(tools, instances) {
        this.tools = tools;
        this.instances = instances;
    }

    registerControls() {
        for (let tool in this.instances) {
            this.instances[tool].registerControls();
        }
    }

    /** @param {Track} track */
    attachToTrack(track) {
        for (let tool in this.instances) {
            track.tools.set(tool, this.instances[tool]);
        }
    }

    /**
     * @returns {Element}
     */
    getDOM() {
        let el = document.createElement('div');
        el.classList.add('toolbar');

        for (let tool in this.tools) {
            el.appendChild(this.instances[this.tools[tool].toolName].getDOM());
        }

        return el;
    }

    /** @param {Track} track */
    static makeToolbars(track) {
        const makeToolbar = (track, tools) => {
            return new Toolbar(tools, tools.reduce((toolMap, toolClass) => {
                return {...toolMap, [toolClass.toolName]: new toolClass(track) };
            }, {}));
        }

        let rightToolbarEl = null;

        if (track.id === null) {
            let rightToolbar = makeToolbar(track, RIGHT_TOOLBAR);
            rightToolbarEl = rightToolbar.getDOM();
            rightToolbar.registerControls();
            rightToolbarEl.classList.add('right');
            track.canvas.parentNode.insertBefore(rightToolbarEl, track.canvas);

            rightToolbar.attachToTrack(track);
        }

        let leftToolbar = null;

        if (track.id !== null) {
            leftToolbar = makeToolbar(track, LEFT_TOOLBAR_VIEWING);
        } else {
            leftToolbar = makeToolbar(track, LEFT_TOOLBAR_EDITING);
        }

        let leftToolbarEl = leftToolbar.getDOM();
        leftToolbar.registerControls();
        leftToolbarEl.classList.add('left');
        track.canvas.parentNode.insertBefore(leftToolbarEl, track.canvas);

        leftToolbar.attachToTrack(track);

        track.toolManager.setTool(leftToolbar.instances[CameraTool.toolName]);
    }
}