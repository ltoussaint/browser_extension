define('api/http', function (require, exports) {

    // http://www.w3.org/TR/2006/WD-XMLHttpRequest-20060405/#dfn-readystate
    var STATUS_UNINITIALIZED = 0,
        STATUS_OPEN = 1,
        STATUS_SENT = 2,
        STATUS_RECEIVING = 3,
        STATUS_LOADED = 4;

    exports.get = function (url, params) {
        params = params || {};

        if (-1 == url.indexOf('?')) {
            url += '?'
        }

        for (var i in params) {
            if (params.hasOwnProperty(i)) {
                if (Array.isArray(params[i])) {
                    for (var j = 0, l = params[i].length; j < l; j++) {
                        url += i + '[]=' + encodeURIComponent(params[i][j]) + '&';
                    }
                } else if ('object' == typeof params[i]) {
                    for (var j in params[i]) {
                        if (params[i].hasOwnProperty(j)) {
                            url += i + '[' + j + ']=' + encodeURIComponent(params[i][j]) + '&';
                        }
                    }
                } else {
                    url += i + '=' + encodeURIComponent(params[i]) + '&';
                }
            }
        }

        return new Promise(function (resolve, reject) {
            var req = new XMLHttpRequest();
            req.open('GET', url, true);
            req.onreadystatechange = function (event) {
                if (req.readyState == STATUS_LOADED) {
                    if (req.status == 200) {
                        try {
                            resolve(req.responseText);
                        } catch (error) {
                            reject(error);
                        }
                    } else {
                        reject(new Error('Bad API http code : ' + req.status));
                    }
                }
            };
            req.send(null);
        });

    };
});