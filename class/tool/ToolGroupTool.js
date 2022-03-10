import Tool from "./Tool.js";

export default class ToolGroupTool extends Tool {
    /**
     *
     * @param {Track} track
     */
    constructor(track, classList) {
        super(track);

        this.instances = new Array();
        for (let toolClass of classList) {
            this.instances.push(new toolClass(track));
        }
    }

    getUI(uiManager, pos, align) {
        super.getUI(uiManager, pos, align);

        this.instancesUI = new Array();
        for (let instance of this.instances) {
            instance.registerControls();
            let instanceUI = instance.getUI(uiManager, 0, align);
            instanceUI.originalX = 30;
            instanceUI.y = this.ui.y + 26 * this.instancesUI.length;
            let run = instance.run;
            instance.run = () => {
                this.ui.icon = instanceUI.icon;
                run.bind(instance)();
            };

            this.instancesUI.push(instanceUI);
        }

        this.track.toolCollection.setTools(this.instances);

        return this.ui;
    }

    run() {
        this.track.toolManager.setTool(this, false);
        this.closeOptions();
        this.openOptions();
    }

    createOptionsUI() {
        this.ui.optionsUI.items.push(...this.instancesUI);
    }
}