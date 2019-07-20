"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stateful = exports.StatefulComponent = void 0;

var _react = _interopRequireDefault(require("react"));

var _ObjectPaths = _interopRequireDefault(require("./ObjectPaths"));

var _v = _interopRequireDefault(require("uuid/v4"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * A react component with a state that it isn't afraid to use
 */
var StatefulComponent =
/*#__PURE__*/
function (_React$Component) {
  _inherits(StatefulComponent, _React$Component);

  /**
   * @param initialState The initial state of the this component
   * @param providers SharedStateProviders that will provide values for shared state. This is mostly used where you
   *          want to share state only between a set of components.
   * @param props The react props for this component
   */
  function StatefulComponent(initialState, providers, props) {
    var _this;

    _classCallCheck(this, StatefulComponent);

    if (!props && providers && !Array.isArray(providers)) {
      props = providers;
      providers = [];
    }

    _this = _possibleConstructorReturn(this, _getPrototypeOf(StatefulComponent).call(this, props));
    _this.state = initialState;
    _this.providers = providers;
    if (providers && !Array.isArray(providers)) _this.providers = [_this.providers];

    _this.providers.forEach(function (p) {
      if (_typeof(p) !== 'object') {
        throw 'You supplied a provider that is not an instance of an object. Make sure you did: new Provider()' + ' This came from the component with initial state: ' + JSON.stringify(initialState);
      }
    });

    _this.listenPaths = _ObjectPaths["default"].toPaths(initialState);
    return _this;
  }
  /**
   * If you override this, make sure you add a call to super or your state won't work anymore.
   *
   * Once the component is mounted we can get our state hooked up to the providers.
   */


  _createClass(StatefulComponent, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      this.listenerMutes = this.listenPaths.map(function (path) {
        var updateOn = function updateOn(val) {
          _ObjectPaths["default"].putPath(path, _this2.state, val);

          _this2.setState(_this2.state);
        };

        updateOn.bind(_this2);
        var localProvided = false;

        var mute = _this2.providers && _this2.providers.filter(function (provider) {
          return provider.canProvide(path);
        }).map(function (provider) {
          if (localProvided) throw 'Multiple local providers found for property ' + path + ' property is ambiguous';
          localProvided = true;
          return provider.listen(path, updateOn);
        });

        if (mute && mute[0]) {
          return mute[0];
        } else {
          return null;
        }
      }).filter(function (mute) {
        return !!mute;
      });
    }
    /**
     * Cleanup all of our listeners before we unmount to avoid memory leaks
     * Make sure and call super if you override this or you'll get nasty memory leaks!
     */

  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.listenerMutes.forEach(function (mute) {
        return mute();
      });
    }
  }]);

  return StatefulComponent;
}(_react["default"].Component);
/**
 * Create a functional component with a state.
 * @param initialState The initial state of the this component
 * @param providers SharedStateProviders that will provide values for shared state
 * @param render The render method to use when rendering. This is your regular functional component. (props)=>{}
 * @returns {function(*=)} The stateful functional component
 */


exports.StatefulComponent = StatefulComponent;

var stateful = function stateful(initialState, providers, _render) {
  if (!_render && typeof providers === 'function') {
    _render = providers;
    providers = [];
  }

  var funny =
  /*#__PURE__*/
  function (_StatefulComponent) {
    _inherits(funny, _StatefulComponent);

    function funny(props) {
      var _this3;

      _classCallCheck(this, funny);

      _this3 = _possibleConstructorReturn(this, _getPrototypeOf(funny).call(this, initialState, providers, props));

      var applyLocalState = function applyLocalState() {
        var _this4;

        return (_this4 = _this3).setState.apply(_this4, arguments);
      };

      _this3.applyLocalState = applyLocalState.bind(_assertThisInitialized(_this3));
      return _this3;
    }

    _createClass(funny, [{
      key: "render",
      value: function render() {
        return _render(Object.assign({}, this.props, {
          state: this.state,
          applyLocalState: this.applyLocalState
        }));
      }
    }]);

    return funny;
  }(StatefulComponent);

  return function (props) {
    return _react["default"].createElement(funny, Object.assign({}, props, {
      key: props && props.key || (0, _v["default"])()
    }));
  };
};

exports.stateful = stateful;