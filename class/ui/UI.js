import Track from "../track/Track.js";
import GameState from "../state/GameState.js";

export default class UI {
    /**
     * 
     * @param {GameState} state 
     */
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
        importInput.addEventListener('change', () => UI.handleImport(state, importInput));

        let exportButton = document.createElement('button');
        exportButton.innerHTML = 'Export';
        exportButton.addEventListener('click', () => UI.handleExport(state));

        let uploadButton = document.createElement('button');
        uploadButton.innerHTML = 'Upload';
        uploadButton.addEventListener('click', () => UI.handleUpload(state));

        ui.appendChild(importButton);
        ui.appendChild(importInput);
        ui.appendChild(exportButton);
        ui.appendChild(uploadButton);
    }

    static createRaceUI(state) {

    }

    static createUploadUI() {

    }

    /**
     * 
     * @param {GameState} state 
     * @param {*} importInput 
     */
    static handleImport(state, importInput) {
        let file = importInput.files[0];

        if (file) {
            let reader = new FileReader();
            reader.onload = () => {
                UI.hideToolbars();
                state.track.canvas.style.cursor = 'none';
                state.track.event.detachAllEvt();
                state.track = new Track(state.track.canvas, { trackCode: reader.result });
                state.getTrackParser();
                state.manager.pop();
            };

            reader.readAsText(file);
        }
    }

    /**
     * 
     * @param {GameState} state 
     */
    static handleExport(state) {
        state.manager.push('generator');
    }

    /**
     * 
     * @param {GameState} state 
     */
    static handleUpload(state) {
        ui.style.display = 'none';
        state.manager.getState('generator').isTrackUpload = true;
        state.manager.push('generator');
    }

    static getToolbars() {
        return document.querySelectorAll('.toolbar');
    }

    static showToolbars() {
        UI.getToolbars().forEach(toolbar => toolbar.style.display = 'block');
    }

    static hideToolbars() {
        UI.getToolbars().forEach(toolbar => toolbar.style.display = 'none');
    }
}