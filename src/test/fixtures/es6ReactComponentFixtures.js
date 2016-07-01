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
    }
  `,
  componentWithState: `
    class Main extends Component {
      constructor () {
        this.state = {
          number: 2,
          string: 'hello',
          boolean: true,
          array: [1, 'hello', true],
          object: {
            name: 'hello again',
            age: 27,
            engineer: true
          }
        }
      }
      render () {
        <div>Test</div>
      }
    }
  `,
}