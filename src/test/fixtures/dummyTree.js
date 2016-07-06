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
            {
              "name":"foo", 
              "parent": "Notorious", 
              "value": "props.foo"
            },
            {
              "name":"click", 
              "parent": "Notorious", 
              "value": "props.click"
            }
          ]
        }
      ],
      "props": [
        {
          "name":"foo", 
          "parent": "BigPoppa", 
          "value": "state.foo"
        },
        {
          "name":"bar",  
          "parent": "BigPoppa", 
          "value": "state.bar"
        },
        {
          "name":"click",  
          "parent": "BigPoppa", 
          "value": "handleClick"
        }
      ]
    },
    {
      "name":"Biggie",
      "children":[],
      "state":[],
      "methods":[],
      "props": [
        {
          "name":"bar", 
          "parent": "BigPoppa",
          "value": "state.bar"
        }
      ]
    }
  ],
  "props":[]
}
