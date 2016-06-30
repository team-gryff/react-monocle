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
          search: '',
          ajaxData: [],
          number: 0,
          boolean: true,
          object: {
            address: '',
          },
        };
      },
      render: function () {
        return <div>Test</div>
      }
    });
  `,
}