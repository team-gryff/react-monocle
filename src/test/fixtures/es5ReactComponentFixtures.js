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
    children: [
      { 
        name: 'SearchBar', 
        props: [],
        state: [],
        children: [], 
      }, 
      { 
        name: 'SearchResults',
        props: [],
        state: [],
        children: [
          { 
            name: 'Result', 
            props: [],
            state: [],
            children: [], 
          }, 
          { 
            name: 'Result', 
            props: [],
            state: [],
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
    state: [
      { name: 'search', value: '' },
      { name: 'ajaxData', value: [] },
      { name: 'number', value: 0 },
      { name: 'boolean', value: true },
      { name: 'object', value: { address: ''} },
    ],
    children: [],
  },
  componentWithUserMethods: `
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
      handleSubmit: function(e) {  },
      handleReceiveData: function(e) {  },
      render: function() {
        return <div>Test</div>
      }
    });
  `,
  componentWithUserMethodsOutput: {
    name: 'Main',
    props: [],
    children: [],
    state: [],
    methods: ['handleSubmit', 'handleReceiveData'],
  }
}