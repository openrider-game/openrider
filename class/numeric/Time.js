export default class Time {
    static format(millisFull) {
        let minutes = Math.floor(millisFull / 60000);
        let seconds = Math.floor(millisFull % 60000 / 1000);
        let millis = Math.floor((millisFull - minutes * 60000 - seconds * 1000) / 100);

        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${millis}`;
    }
}