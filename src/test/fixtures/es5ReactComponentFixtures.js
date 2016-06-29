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
}