module.exports = {
  singleMainApp: `var Main = React.createClass({ })`,
  nestedComponents: `
    var Main = React.createClass({
      render: function() {
        return <div>
          <SearchBar />
          <div>Testing</div>
          <SearchResults>
            <Result />
            <Result />
          </SearchResults>
        </div>
      }
    });
  `,
  componentWithProps: `
    var Main = React.createClass({ 
      render: function () {
        return <div>
          <SearchBar 
            onChange={this.handleTextChange}
            onSubmit={this.handleSubmit} >
          </SearchBar>
        </div>
      }
    });
  `,
  componentWithState: `
    var Main = React.createClass({
      getInitialState: function () {
        return {
          number: 2,
          string: 'hello',
          boolean: true,
          array: [1, 'hello', true],
          object: {
            name: 'hello again',
            age: 27,
            engineer: true
          }
        };
      },
      render: function () {
        return <div>Test</div>
      }
    });
  `,
  componentWithMethods: `
    var Main = React.createClass({
      // React Component Lifecycle Methods
      componentDidMount: function() {  },
      componentWillMount: function() {  },
      componentWillReceiveProps: function() {  },
      shouldComponentUpdate: function() {  },
      componentWillUpdate: function() {  },
      componentDidUpdate: function() {  },
      componentWillUnmount: function() {  },
      
      // Custom Component-Level Methods
      handleSubmit: function(e) { 
        this.setState({

        });
      },
      handleReceiveData: function(e) {  },
      render: function() {
        return <div>Test</div>
      }
    });
  `,
}