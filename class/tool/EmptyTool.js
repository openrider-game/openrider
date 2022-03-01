import UIElement from "../ui/base/UIElement.js";
import Tool from "./Tool.js";

export default class EmptyTool extends Tool {
    getUI(pos) {
        return new UIElement(null, this.track);
    }

    run() {}
}