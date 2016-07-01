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
      "children": [
        {
          "name":"BIG",
          "children":[],
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
      "children": [],
      "props": [
        {
          "name":"bar"
        }
      ]
    }
  ],
  "props":[]
}
