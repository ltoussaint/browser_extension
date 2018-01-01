define('api/messaging', function (require, exports, module) {

  var callbackByLabel = {};
  var callbackResponseList = {};

  function Messaging() {

    this.sendMessage = function (label, data) {
      return new Promise((function(resolve) {
        var callbackResponseId = label + '_' + (new Date()).getTime() + '_' + Math.round((Math.random() * 1000));
        var messageBag = {
          _label: label,
          _data: data || {},
          _responseId: callbackResponseId,
          _isResponse: false
        };

        callbackResponseList[callbackResponseId] = resolve;

        this.onMessage('_' + label + '_response', function (responseMessageBag) {
          console.debug('Get message response', responseMessageBag);
          callbackResponseList[responseMessageBag._responseId](responseMessageBag._data);
          delete callbackResponseList[responseMessageBag._responseId];
        });

        console.debug('Send message (label, messageBag) : ', label, messageBag);
        chrome.runtime.sendMessage(messageBag);
      }).bind(this));
    };

    this.onMessage = function (label, callback) {
      callbackByLabel[label] = callback;
    };

    __construct.call(this);

    return this;

    function __construct () {
      console.debug('messaging::__construct');
      chrome.runtime.onMessage.addListener(function (messageBag, sender) {
        console.debug('On message listener (messageBag, sender) : ', messageBag, sender);
        if (messageBag._isResponse) {
          if (callbackResponseList[messageBag._responseId]) {
            callbackResponseList[messageBag._responseId](messageBag._data);
            delete callbackResponseList[messageBag._responseId];
          }
        } else {
          if (messageBag._label && callbackByLabel[messageBag._label]) {
            onMessageCallback(messageBag._label, sender, callbackByLabel[messageBag._label], messageBag);
          }
        }
      });
    };

    function onMessageCallback(label, sender, callback, messageBag) {
      callback(messageBag._data, onMessageResponse.bind(this, label, sender, messageBag._responseId), sender);
    }

    function onMessageResponse(label, sender, responseId, data) {
      var messageResponseBag = {
        _label: '_' + label + '_response',
        _data: data,
        _responseId: responseId,
        _isResponse: true
      };
      chrome.tabs.sendMessage(sender.tab.id, messageResponseBag);
    }
  }

  var messaging = new Messaging();
  exports.sendMessage = messaging.sendMessage.bind(messaging);
  exports.onMessage = messaging.onMessage.bind(messaging);
});

