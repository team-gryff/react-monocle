module.exports = {
  singleMainApp: `class Main extends Component {}`,
  singleMainAppOutput: { 
    name: 'Main',
    props: [],
    state: [],
    children: [] 
  },
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
  nestedComponentsOutput: { 
    name: 'Main',
    props: [],
    state: [],
    children: [
      { name: 'SearchBar', 
        children: [],
        props: [],
        state: [] 
      }, 
      { name: 'SearchResults',
        props: [],
        state: [],
        children: [
          { name: 'Result', 
            children: [],
            props: [],
            state: [],
          }, 
          { name: 'Result', 
            children: [],
            props: [],
            state: [], 
          }
        ],
      }
    ],
  },
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
  componentWithPropsOutput: {
    name: 'Main',
    props: [],
    state: [],
    children: [
      { name: 'SearchBar' ,
        children: [],
        state: [],
        props: [
          { name: 'onChange' },
          { name: 'onSubmit' }
        ]
      }
    ],
  },
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
  componentWithStateOutput: {
    name: 'Main',
    props: [],
    state: [
      { name: 'number', value: 2 },
      { name: 'string', value: 'hello' },
      { name: 'boolean', value: true },
      { name: 'array', value: [1, 'hello', true] },
      { name: 'object', value: { 
        name: 'hello again',
        age: 27,
        engineer: true
      }}
    ],
    children: [],
  },
}