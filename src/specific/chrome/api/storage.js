define('api/storage', function (require, exports) {

    /**
     * Set in local storage a pair key/value
     * @param key
     * @param value
     * @return Promise
     */
    exports.set = function (key, value) {
        console.debug('storage.set', key, '[value]');
        console.log('value =', value);
        var data = {};
        data[key] = value;
        return this.setMulti(data);
    };

    /**
     * Set in local storage several pairs key/value
     * @param data
     * @return Promise
     */
    exports.setMulti = function (data) {
        return new Promise(function (resolve, reject) {
            chrome.storage.local.set(data, storageCallback.bind(this, resolve, reject));
        });
    };

    /**
     * Get a value in local storage from the given key
     * @param key
     * @return Promise
     */
    exports.get = function (key) {
        return (new Promise(function (resolve, reject) {
            console.debug('storage.get', key);
            chrome.storage.local.get(key, storageCallback.bind(this, resolve, reject));
        }))
            .then(extractKey.bind(this, key))
    };

    /**
     * Check if storage has given key
     * @param key
     * @return Promise
     */
    exports.has = function (key) {
        return (new Promise(function (resolve, reject) {
            chrome.storage.local.get(key, storageCallback.bind(this, resolve, reject));
        }))
            .then(checkKey.bind(this, key));
    };


    /**
     * Remove a key/value pair from local storage
     * @param key
     * @returns {*}
     */
    exports.remove = function (key) {
        return new Promise(function (resolve, reject) {
            chrome.storage.local.remove(key, storageCallback.bind(this, resolve, reject))
        });
    };

    /**
     * Set in sync storage a pair key/value
     * @param key
     * @param value
     * @return Promise
     */
    exports.setSync = function (key, value) {
        var data = {};
        data[key] = value;
        return this.setSyncMulti(data);

    };

    /**
     * Set in sync storage several pairs key/value
     * @param data
     * @return Promise
     */
    exports.setSyncMulti = function (data) {
        return new Promise(function (resolve, reject) {
            chrome.storage.sync.set(data, storageCallback.bind(this, resolve, reject));
        });
    };

    /**
     * Get a value in sync storage from the given key
     * @param key
     * @return Promise
     */
    exports.getSync = function (key) {
        return (new Promise(function (resolve, reject) {
            chrome.storage.sync.get(key, storageCallback.bind(this, resolve, reject));
        }))
            .then(extractKey.bind(this, key));
    };

    /**
     * Check if storage has given key
     * @param key
     * @return Promise
     */
    exports.hasSync = function (key) {
        return (new Promise(function (resolve, reject) {
            chrome.storage.sync.get(key, storageCallback.bind(this, resolve, reject));
        }))
            .then(checkKey.bind(this, key));
    };

    /**
     * Remove a key/value pair from local storage
     * @param key
     * @returns {*}
     */
    exports.removeSync = function (key) {
        return new Promise(function (resolve, reject) {
            chrome.storage.sync.remove(key, storageCallback.bind(this, resolve, reject))
        });
    };

    /**
     * Extract key from object
     * @param key
     * @param data
     */
    function extractKey(key, data) {
        if (data[key]) {
            return Promise.resolve(data[key]);
        } else {
            return Promise.resolve(null);
        }
    }

    /**
     * Extract key from object
     * @param key
     * @param data
     */
    function checkKey(key, data) {
        if (data[key]) {
            return Promise.resolve(true);
        } else {
            return Promise.resolve(false);
        }
    }

    /**
     * Common callback used by this storage library
     * @param reject Reject callback
     * @param resolve Resolve callback
     * @param value Returned value if needed
     */
    function storageCallback(resolve, reject, value) {
        console.debug('storage::storageCallback', '[resolve]', '[reject]', '[value]');
        console.log('value = ', value);
        if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError)
        } else {
            if (value) {
                resolve(value);
            } else {
                resolve();
            }
        }
    }
});