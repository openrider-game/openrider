import BMX from "../bike/instance/BMX.js";
import { BIKE_MAP } from "../constant/BikeConstants.js";

export default class GhostParser {
    /**
     *
     * @param {string} ghostString
     */
    static parse(ghostString) {
        let parts = ghostString.split(',');
        let ghostMap = new Map();

        ghostMap.set('keys', new Map());
        ghostMap.get('keys').set('upPressed', new Array());
        ghostMap.get('keys').set('downPressed', new Array());
        ghostMap.get('keys').set('leftPressed', new Array());
        ghostMap.get('keys').set('rightPressed', new Array());
        ghostMap.get('keys').set('turnPressed', new Array());

        ghostMap.get('keys').forEach((keyArray) => {
            keyArray.push(...parts.shift().split(' '));
        });

        ghostMap.set('time', parts[0] || 0);
        ghostMap.set('bike', BIKE_MAP[parts[1]] || BMX);
        ghostMap.set('name', parts[2] || 'Ghost');

        return ghostMap;
    }

    static generate(bikeRunner) {
        let ghostKeys = new Array();

        bikeRunner.instance.keyLog.forEach((keyArray) => {
            ghostKeys.push(keyArray.join(' '));
        });

        ghostKeys.push(bikeRunner.track.time, bikeRunner.bikeClass.name);

        return ghostKeys.join(',');
    }
}