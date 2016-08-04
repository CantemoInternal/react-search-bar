'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var Suggestions = (function (_React$Component) {
  _inherits(Suggestions, _React$Component);

  function Suggestions(props) {
    _classCallCheck(this, Suggestions);

    _get(Object.getPrototypeOf(Suggestions.prototype), 'constructor', this).call(this, props);
    this.state = {
      activeItem: -1
    };
  }

  _createClass(Suggestions, [{
    key: 'onTouchStart',
    value: function onTouchStart(index) {
      var _this = this;

      this.timer = setTimeout(function () {
        _this.setState({ activeItem: index });
      }, 200);
    }
  }, {
    key: 'onTouchMove',
    value: function onTouchMove() {
      clearTimeout(this.timer);
      this.touchedMoved = true;
      this.setState({ activeItem: -1 });
    }
  }, {
    key: 'onTouchEnd',
    value: function onTouchEnd(suggestion) {
      var _this2 = this;

      if (!this.touchedMoved) {
        setTimeout(function () {
          _this2.props.onSelection(suggestion);
        }, 220);
      }
      this.touchedMoved = false;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _props = this.props;
      var highlightedItem = _props.highlightedItem;
      var searchTerm = _props.searchTerm;
      var suggestions = _props.suggestions;
      var activeItem = this.state.activeItem;

      return _react2['default'].createElement(
        'ul',
        {
          className: 'search-bar-suggestions',
          onMouseLeave: function () {
            return _this3.setState({ activeItem: -1 });
          } },
        suggestions.map(function (suggestion, index) {
          return _react2['default'].createElement(
            'li',
            {
              className: (0, _classnames2['default'])({
                highlighted: highlightedItem === index || activeItem === index
              }),
              key: index,
              onClick: function () {
                return _this3.props.onSelection(suggestion);
              },
              onMouseEnter: function () {
                return _this3.setState({ activeItem: index });
              },
              onMouseDown: function (e) {
                return e.preventDefault();
              },
              onTouchStart: function () {
                return _this3.onTouchStart(index);
              },
              onTouchMove: function () {
                return _this3.onTouchMove();
              },
              onTouchEnd: function () {
                return _this3.onTouchEnd(suggestion);
              } },
            _react2['default'].createElement(
              'span',
              null,
              searchTerm,
              _react2['default'].createElement(
                'strong',
                null,
                suggestion.substr(searchTerm.length)
              )
            )
          );
        })
      );
    }
  }]);

  return Suggestions;
})(_react2['default'].Component);

Suggestions.propTypes = {
  highlightedItem: _react2['default'].PropTypes.number,
  searchTerm: _react2['default'].PropTypes.string.isRequired,
  suggestions: _react2['default'].PropTypes.array.isRequired
};

exports['default'] = Suggestions;
module.exports = exports['default'];