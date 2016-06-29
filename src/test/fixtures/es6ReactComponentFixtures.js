module.exports = {
  singleMainApp: `class Main extends Component {}`,
  nestedComponents: `
    class Main extends Component {
      render () {
        return <div>
          <SearchBar />
          <div>Testing</div>
          <SearchResults>
            <Result />
            <Result />
          </SearchResults>
        </div>
      }
    }
  `,
  componentWithProps: `
    class Main extends Component { 
      render () {
        return <div>
          <SearchBar 
            onChange={this.handleTextChange}
            onSubmit={this.handleSubmit} >
          </SearchBar>
        </div>
      }
    };
  `,
}