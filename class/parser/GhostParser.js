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

        ghostMap.set('time', parts[5] || 0);
        ghostMap.set('bike', BIKE_MAP[parts[6]] || BMX);
        ghostMap.set('name', parts[7] || 'Ghost');

        return ghostMap;
    }

    /**
     *
     * @param {Map<string, Array<number>} ghostKeys
     */
    static generate(ghostKeys) {
        let ghostString = new Array();

        ghostKeys.forEach((keyArray) => {
            ghostString.push(keyArray.join(' '));
        });

        return ghostString.join(',');
    }
}