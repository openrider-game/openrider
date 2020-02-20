export class CheckpointSave {
    constructor(track, bikeList, ghostLists) {
        this.track = track;
        this.bikeList = bikeList;
        this.ghostLists = ghostLists;
        this.currentTime = track.currentTime;
    }
}