define('api/omnibox', function (require, exports) {

  exports.onInputStarted = function(callback) {
    console.trace('api/omnibox.onInputStarted');
    chrome.omnibox.onInputStarted.addListener(callback);
  };

  exports.onInputChanged = function (callback) {
    console.trace('api/omnibox.onInputChanged');
    chrome.omnibox.onInputChanged.addListener(function(text, suggest) {
      callback(text, suggest);
    });
  };

  exports.onInputEntered = function (callback) {
    console.trace('api/omnibox.onInputEntered');
    chrome.omnibox.onInputEntered.addListener(function(text, disposition) {
      console.trace('api/omnibox.onInputEnteredCallback', text, disposition);
      callback(text, disposition);
    });
  };

  exports.onInputCancelled = function (callback) {
    console.trace('api/omnibox.onInputCancelled');
    chrome.omnibox.onInputCancelled.addListener(callback);
  };

});