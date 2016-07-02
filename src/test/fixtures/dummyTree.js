module.exports = {
  "name":"BigPoppa",
  "methods": [ 'handleClick' ],
  "state":[
    {
      "name":"foo",
      "value":true
    },
    {
      "name":"bar",
      "value":"yo ima string"
    }
  ],
  "children": [
    {
      "name":"Notorious",
      "state":[],
      "methods":[],
      "children": [
        {
          "name":"BIG",
          "children":[],
          "state":[],
          "methods":[],
          "props": [
            {"name":"foo"},
            {"name":"click"}
          ]
        }
      ],
      "props": [
        {"name":"foo"},
        {"name":"bar"},
        {"name":"click"}
      ]
    },
    {
      "name":"Biggie",
      "children":[],
      "state":[],
      "methods":[],
      "props": [
        {
          "name":"bar"
        }
      ]
    }
  ],
  "props":[]
}
