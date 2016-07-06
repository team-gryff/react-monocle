module.exports = {
  singleMainAppOutput: { 
    name: 'Main',
    props: [],
    state: [],
    children: [],
    methods: [],
  },
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
          { 
            name: 'onChange',
            parent: "Main",
            value: "handleTextChange" 
          },
          { 
            name: 'onSubmit',
            parent: "Main",
            value: "handleSubmit" 
          }
        ]
      }
    ],
  },
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
  componentWithMethodsOutput: {
    name: 'Main',
    props: [],
    children: [],
    state: [],
    methods: ['handleSubmit', 'handleReceiveData'],
  },
  nestedComponentCompositionOutput: {
    name: 'Main',
    props: [],
    children: [
      {
        name: 'ListItem',
        props: [
          { 
            name: 'onChange', 
            parent: 'Main',
            value: 'handleChange' 
          },
          { 
            name: 'onSubmit',
            parent: 'Main',
            value: 'handleSubmit' 
          }
        ],
        children: [],
        state: [],
        methods: [],
      }
    ],
    state: [],
    methods: [],
  }
}