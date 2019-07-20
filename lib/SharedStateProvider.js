"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ObjectPaths = _interopRequireDefault(require("./ObjectPaths"));

var _v = _interopRequireDefault(require("uuid/v4"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * A SharedStatProvider provides the values of a shared state to the listening components.
 */
var SharedStateProvider =
/*#__PURE__*/
function () {
  /**
   * The state this provider provides. This is also the initial state for this provider.
   * If any values on the initial state have a "then" function, we will assume it's a promise,
   * execute the promise, and update the initial state to the resolved value.
   * @param provides The initial state
   */
  function SharedStateProvider(provides) {
    var _this = this;

    _classCallCheck(this, SharedStateProvider);

    this.initialPaths = _ObjectPaths["default"].toPaths(provides, function (obj) {
      return !(obj && obj.then && typeof obj.then === 'function');
    }).reduce(function (paths, path) {
      paths[path] = true;
      return paths;
    }, {});
    this.state = Object.assign({}, provides);
    this.listeners = {};
    this.load();
    /**
     * This works Object.assign from the old state to the new state
     * @param newState
     */

    var applySharedState = function applySharedState(newState) {
      Object.keys(_this.initialPaths).forEach(function (p) {
        if (_ObjectPaths["default"].hasPath(p, newState)) {
          var value = _ObjectPaths["default"].getPath(p, newState);

          if (value && typeof value.then === 'function') {
            var doUpdate = function doUpdate(val) {
              _ObjectPaths["default"].putPath(p, _this.state, value);

              _this.notify(p, val);
            };

            value.then(doUpdate.bind(_this));
          } else {
            _ObjectPaths["default"].putPath(p, _this.state, value);

            _this.notify(p, value);
          }
        }
      });
    };

    this.applySharedState = applySharedState.bind(this);
  }
  /**
   * Listen for changes to the specified path
   * @param path The path to listen to changes for
   * @param listener A function that will be executed to inform the caller of the new value. (newValue)=>{}
   * @returns {*} A function to call to stop listening for changes
   */


  _createClass(SharedStateProvider, [{
    key: "listen",
    value: function listen(path, listener) {
      var _this2 = this;

      if (!this.listeners[path]) this.listeners[path] = {};
      var listenerKey = (0, _v["default"])();
      this.listeners[path][listenerKey] = listener;

      var currentValue = _ObjectPaths["default"].getPath(path, this.state);

      if (currentValue) listener(currentValue);

      var mute = function mute() {
        if (_this2.listeners[path]) delete _this2.listeners[path][listenerKey];
      };

      mute.bind(this);
      return mute;
    }
    /**
     * Determine if this provider can provide the given state path
     */

  }, {
    key: "canProvide",
    value: function canProvide(path) {
      return !!this.initialPaths[path];
    }
    /**
     * Notify the listeners of a new value at the given path
     */

  }, {
    key: "notify",
    value: function notify(path, value) {
      var _this3 = this;

      this.listeners[path] && Object.keys(this.listeners[path]).forEach(function (listener) {
        _this3.listeners[path][listener](value);
      });
    }
    /**
     * Load any state promises and notify the listeners
     */

  }, {
    key: "load",
    value: function load() {
      var _this4 = this;

      var _loop = function _loop(p) {
        var value = _ObjectPaths["default"].getPath(p, _this4.state);

        var setState = function setState(val) {
          _ObjectPaths["default"].putPath(p, _this4.state, val);

          _this4.notify(p, val);
        };

        setState.bind(_this4);

        if (value && typeof value.then === 'function') {
          _ObjectPaths["default"].putPath(p, _this4.state, null);

          value.then(setState);
        } else {
          setState(value);
        }
      };

      for (var p in this.initialPaths) {
        _loop(p);
      }
    }
  }]);

  return SharedStateProvider;
}();

exports["default"] = SharedStateProvider;