import Tool from "./Tool.js";

export default class ToolCollection {
    constructor() {
        this.toolsByToolName = new Map();
        this.toolsByKeyLabel = new Map();
    }

    setTools(instances) {
        for (let tool in instances) {
            this.toolsByToolName.set(instances[tool].constructor.toolName, instances[tool]);
            this.toolsByKeyLabel.set(instances[tool].constructor.keyLabel, instances[tool]);
        }
    }

    getByToolName(toolName) {
        return this.toolsByToolName.get(toolName);
    }

    getByKeyLabel(keyLabel) {
        return this.toolsByKeyLabel.get(keyLabel);
    }
}