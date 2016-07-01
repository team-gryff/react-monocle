module.exports = {
  "name":"BigPoppa",
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
      "children": [
        {
          "name":"BIG",
          "children":[],
          "state":[],
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
      "props": [
        {
          "name":"bar"
        }
      ]
    }
  ],
  "props":[]
}
