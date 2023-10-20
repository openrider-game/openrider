export default class Requests {
    static getPostRequest(url, params) {
        let paramStrings = new Array();
        for (let key in params) {
            let value = params[key];
            paramStrings.push([key, encodeURIComponent(value)].join('='));
        }

        let request = new XMLHttpRequest();
        request.open('POST', url, false);
        request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        request.send(paramStrings.join('&'));

        return request;
    }
}