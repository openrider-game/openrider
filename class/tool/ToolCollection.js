import Tool from "./Tool.js";

export default class ToolCollection {
    constructor() {
        this.toolsByToolName = new Map();
        this.toolsByKeyLabel = new Map();
    }

    setTools(tools) {
        for (let tool of tools) {
            this.toolsByToolName.set(tool.constructor.toolName, tool);
            this.toolsByKeyLabel.set(tool.constructor.keyLabel, tool);
        }
    }

    getByToolName(toolName) {
        return this.toolsByToolName.get(toolName);
    }

    getByKeyLabel(keyLabel) {
        return this.toolsByKeyLabel.get(keyLabel);
    }
}