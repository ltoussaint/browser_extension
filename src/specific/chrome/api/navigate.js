define('api/navigate', function (require, exports) {

  exports.redirect = function(url) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.update(tabs[0].id, {url: url});
    });
  };

});

