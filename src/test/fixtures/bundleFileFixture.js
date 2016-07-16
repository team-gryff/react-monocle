module.exports = {
  bundledSetState:`
		key: 'handleDelete',
		value: function handleDelete(index) {
			this.setState({ items: this.state.items.filter(function (item, i) {
					return i !== index;
				}) });
			},
		(0, _reactDom.render)(_react2.default.createElement(
	  Frame,
	  null,
	  _react2.default.createElement(App, null)
		), document.getElementById('app'));`,
	
	modifiedBundle:`
		key: 'handleDelete',
		value: function handleDelete(index) {
			wrapper(this.setState)({ items: this.state.items.filter(function (item, i) {
					return i !== index;
				}) });
			},
		(0, _reactDom.render)(_react2.default.createElement(
	  Frame,
	  null,
	  _react2.default.createElement(App, null)
		), document.getElementById("preview"));`,

bundledES5InitialState:`var Game = _react2.default.createClass({
	  displayName: 'Game',
	
	  getInitialState: function getInitialState() {
	    var boardArr = [];
	    for (var i = 0; i < 25; i++) {
	      boardArr.push(this.randomLetterGenerator(DICE));
	    }
	    var buttonStateArr = [];
	    for (var i = 0; i < 25; i++) {
	      buttonStateArr.push('inactive');
	    }
	    return {
	      boardArr: boardArr,
	      currentWord: '',
	      buttonStateArr: buttonStateArr,
	      score: 0,
	      clickedArr: []
	    };
	  },`,

	ES5InitialStateOutput:``,

	ES6InitialStateOutput:``,

	bundledES6InitialState:`var TODO = function (_React$Component) {
	  _inherits(TODO, _React$Component);

	  function TODO(props) {
	    _classCallCheck(this, TODO);

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TODO).call(this, props));

	    _this.state = { items: ['Learn React', 'Make React App'], another: 'one' };
	    return _this;
	  }`,

};