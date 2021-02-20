import { LEFT_TOOLBAR_EDITING, LEFT_TOOLBAR_VIEWING, RIGHT_TOOLBAR } from "../constant/ToolbarConstants.js";
import CameraTool from "./CameraTool.js";
import PauseTool from "./PauseTool.js";
import Tool from "./Tool.js";

export default class Toolbar {
    /**
     *
     * @param {Tool} tools
     * @param {Tool} instances
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

        track.pauseTool = leftToolbar.instances[PauseTool.toolName];
        track.toolManager.setTool(leftToolbar.instances[CameraTool.toolName]);
    }
}