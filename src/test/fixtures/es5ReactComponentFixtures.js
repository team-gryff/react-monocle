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
  nestedComponentsOutput: { 
    name: 'Main',
    props: [],
    state: [],
    methods: [],
    children: [
      { 
        name: 'SearchBar', 
        props: [],
        state: [],
        methods: [],
        children: [], 
      }, 
      { 
        name: 'SearchResults',
        props: [],
        state: [],
        methods: [],
        children: [
          { 
            name: 'Result', 
            props: [],
            state: [],
            methods: [],
            children: [], 
          }, 
          { 
            name: 'Result', 
            props: [],
            state: [],
            methods: [],
            children: [],
          },
        ],
      }
    ],
  },
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
  componentWithStateOutput: {
    name: 'Main',
    props: [],
    methods: [],
    state: [
      { name: 'search', value: '' },
      { name: 'ajaxData', value: [] },
      { name: 'number', value: 0 },
      { name: 'boolean', value: true },
      { name: 'object', value: { address: ''} },
    ],
    children: [],
  },
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
  componentWithMethodsOutput: {
    name: 'Main',
    props: [],
    children: [],
    state: [],
    methods: ['handleSubmit', 'handleReceiveData'],
  }
}