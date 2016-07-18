module.exports = {
  singleMainAppOutput: { 
    name: 'Main',
    props: {},
    state: {},
    children: [],
    methods: [],
  },
  nestedComponentsOutput: { 
    name: 'Main',
    props: {},
    state: {},
    methods: [],
    children: [
      { 
        name: 'SearchBar', 
        props: {},
        state: {},
        methods: [],
        children: [], 
      }, 
      { 
        name: 'SearchResults',
        props: {},
        state: {},
        methods: [],
        children: [
          { 
            name: 'Result', 
            props: {},
            state: {},
            methods: [],
            children: [], 
          }, 
          { 
            name: 'Result', 
            props: {},
            state: {},
            methods: [],
            children: [],
          },
        ],
      }
    ],
  },
  componentWithPropsOutput: {
    name: 'Main',
    props: {},
    state: {},
    methods: [],
    children: [
      { name: 'SearchBar' ,
        children: [],
        state: {},
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
    props: {},
    state: {},
    children: [],
    methods: [],
  },
  componentWithMethodsOutput: {
    name: 'Main',
    props: {},
    children: [],
    state: {},
    methods: ['handleSubmit', 'handleReceiveData'],
  },
  nestedForLoopOutput: {
    name: 'Main',
    props: {},
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
        state: {},
        methods: [],
        iterated: 'forLoop',
        source: 'props.test',
      }
    ],
    state: {},
    methods: [],
  },
  nestedHigherOrderOutput: {
    name: 'Main',
    props: {},
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
        state: {},
        methods: [],
        iterated: 'higherOrder',
        source: 'props.test',
      }
    ],
    state: {},
    methods: [],
  },
}