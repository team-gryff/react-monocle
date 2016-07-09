module.exports = {
  bundledSetState:`
		key: 'handleDelete',
		value: function handleDelete(index) {
			this.setState({ items: this.state.items.filter(function (item, i) {
					return i !== index;
				}) });
			}`,
	
	bundledGetElement:`
		(0, _reactDom.render)(_react2.default.createElement(
	  Frame,
	  null,
	  _react2.default.createElement(App, null)
		), document.getElementById('app'));`,
	
	wrappedFunction:`
		key: 'handleDelete',
		value: function handleDelete(index) {
			wrapper(this.setState)({ items: this.state.items.filter(function (item, i) {
					return i !== index;
				}) });
			}`,
	
	newMount:`
		(0, _reactDom.render)(_react2.default.createElement(
	  Frame,
	  null,
	  _react2.default.createElement(App, null)
		), document.getElementById("preview"));`
}