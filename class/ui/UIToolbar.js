import UICollection from "./base/UICollection.js";

export default class UIToolbar extends UICollection {
    constructor(uiManager, track, itemsClasses, align) {
        super(uiManager, track);
        this.addItems(itemsClasses, align);
    }

    addItems(itemClasses, align) {
        let instances = new Array();

        for (let idx in itemClasses) {
            let item = new itemClasses[idx](this.track);

            item.registerControls();

            this.items.push(item.getUI(this.uiManager, idx, align));
            instances.push(item);
        }

        this.track.toolCollection.setTools(instances);
    }
}