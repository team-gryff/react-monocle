module.exports = {
  bundledSetState:`
		var App = function (_React$Component) {
			(0, _inherits3['default'])(App, _React$Component);
		
			function App() {
				(0, _classCallCheck3['default'])(this, App);
		
				var _this = (0, _possibleConstructorReturn3['default'])(this, (0, _getPrototypeOf2['default'])(App).call(this));
		
				_this.state = {
					treeData: {}
				};
				return _this;
			}
		
			(0, _createClass3['default'])(App, [{
				key: 'componentWillMount',
				value: function () {
					function componentWillMount() {
						return this.setState({ treeData: d3Obj });
					}
		
					return componentWillMount;
				}()
			}])
		}
	`,
	modifiedBundle:`
		var App = function (_React$Component) {
			(0, _inherits3['default'])(App, _React$Component);
		
			function App() {
				(0, _classCallCheck3['default'])(this, App);
		
				var _this = (0, _possibleConstructorReturn3['default'])(this, (0, _getPrototypeOf2['default'])(App).call(this));
		
				_this.state = {
					treeData: {}
				};
				return _this;
			}
		
			(0, _createClass3['default'])(App, [{
				key: 'componentWillMount',
				value: function () {
					function componentWillMount() {
						return wrapper(this.setState)({ treeData: d3Obj }, 'App');
					}
		
					return componentWillMount;
				}()
			}])
		}
	`,
}