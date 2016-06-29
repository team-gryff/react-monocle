module.exports = {
  name: 'BigPoppa',
  state: {
    foo: true,
    bar: 'yo ima string'
  },
  props: [],
  children: [
    {
      name: 'Notorious',
      state: null,
      props: ['foo', 'bar', 'click'],
      children: [
        {
          name: 'BIG',
          state: null,
          props:['foo, click'],
          children: []
        }
      ]
    },
    {
      name: 'Biggie',
      state: null,
      props: ['bar'],
      children: []
    }
  ]
}