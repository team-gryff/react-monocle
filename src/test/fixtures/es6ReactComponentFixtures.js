module.exports = {
  singleMainApp: `class Main extends Component {}`,
  singleMainAppOutput: { 
    name: 'Main',
    props: [],
    state: [],
    children: [],
    methods: [],
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
    methods: [],
    children: [
      { name: 'SearchBar', 
        children: [],
        props: [],
        state: [],
        methods: [],
      }, 
      { name: 'SearchResults',
        props: [],
        state: [],
        methods: [],
        children: [
          { name: 'Result', 
            children: [],
            props: [],
            state: [],
            methods: [],
          }, 
          { name: 'Result', 
            children: [],
            props: [],
            state: [], 
            methods: [],
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
    methods: [],
    children: [
      { name: 'SearchBar' ,
        children: [],
        state: [],
        methods: [],
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
    methods: [],
  },
  componentWithMethods: `
    class Main extends Component {
      // React Component Lifecycle Methods
      componentDidMount () {  }
      componentWillMount () {  }
      componentWillReceiveProps () {  }
      shouldComponentUpdate () {  }
      componentWillUpdate () {  }
      componentDidUpdate () {  }
      componentWillUnmount () {  }
      
      // Custom Component-Level Methods
      handleSubmit (e) {  }
      handleReceiveData (e) {  }
      render () {
        return <div>Test</div>
      }
    }
  `,
  componentWithMethodsOutput: {
    name: 'Main',
    props: [],
    children: [],
    state: [],
    methods: ['handleSubmit', 'handleReceiveData'],
  }
}