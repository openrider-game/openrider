import Tool from "../tool/Tool.js";
import Track from "../track/Track.js";

export default class UI {
    static createEditorUI(state) {
        let importButton = document.createElement('button');
        let importLabel = document.createElement('label');
        importLabel.setAttribute('for', 'import');
        importLabel.innerHTML = 'Import';
        importButton.appendChild(importLabel);

        let importInput = document.createElement('input');
        importInput.type = 'file';
        importInput.id = 'import';
        importInput.style.display = 'none';
        importInput.addEventListener('change', () => {
            let file = importInput.files[0];

            if (file) {
                let reader = new FileReader();
                reader.onload = () => {
                    state.track.event.detach();
                    state.track = new Track(state.track.canvas, { trackCode: reader.result });
                    state.getTrackParser();
                    state.manager.pop();
                };

                reader.readAsText(file);
            }
        });

        let exportButton = document.createElement('button');
        exportButton.innerHTML = 'Export';
        exportButton.addEventListener('click', () => state.manager.push('generator'));

        let uploadButton = document.createElement('button');
        uploadButton.innerHTML = 'Upload';

        ui.appendChild(importButton);
        ui.appendChild(importInput);
        ui.appendChild(exportButton);
        ui.appendChild(uploadButton);
    }

    static createRaceUI(state) {

    }
}