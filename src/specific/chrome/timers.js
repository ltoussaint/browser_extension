'use strict';

define('api/timers', function(require, exports) {
  exports.setTimeout = window.setTimeout.bind(window);
  exports.clearTimeout = window.clearTimeout.bind(window);
  exports.setInterval = window.setInterval.bind(window);
  exports.clearInterval = window.clearInterval.bind(window);
});

