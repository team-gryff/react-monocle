module.exports = {
  bundledSetState:`
		key: 'handleDelete',
		value: function handleDelete(index) {
			this.setState({ items: this.state.items.filter(function (item, i) {
					return i !== index;
				}) });
			}`,
	wrappedFunction:`
		key: 'handleDelete',
		value: function handleDelete(index) {
			wrapper(this.setState)({ items: this.state.items.filter(function (item, i) {
					return i !== index;
				}) });
			}`
}