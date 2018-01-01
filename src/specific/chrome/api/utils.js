define('api/utils', function(require, exports) {

  exports.localFile = function(filePath) {
    return chrome.extension.getURL(filePath);
  };

});

