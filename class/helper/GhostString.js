export class GhostString {
    static parse(ghostStr) {
        var parts = ghostStr.split(','),
            arr = [{}, {}, {}, {}, {}];
        if (parts.length > 5) {
            arr = arr.concat(parts.slice(5));
        }
        for (var i = 0, j, k, key; i < 5; i++) {
            key = parts[i].split(' ');
            for (j = 0, k = key.length - 1; j < k; j++) {
                arr[i][key[j]] = 1;
            }
        }
        return arr;
    }
    static generate(ghostArr) {
        var ghostStr = '';
        for (var q, i = 0, l = ghostArr.length; i < l; i++) {
            for (q in ghostArr[i]) {
                if (!isNaN(q)) {
                    ghostStr += q + ' ';
                }
            }
            ghostStr += ",";
        }
        return ghostStr;
    }
}