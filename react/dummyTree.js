module.exports = {
  "name": "BigPoppa",
  "props": [],
  "state": [
    {
      "name": "foo",
      "value": true
    },
    {
      "name": "bar",
      "value": "yo ima string"
    }
  ],
  "methods": [
    "handleClick"
  ],
  "children": [
    {
      "name": "Notorious",
      "children": [
        {
          "name": "BIG",
          "children": [
            {
              "name": "Cant",
              "children": [
                {
                  "name": "You",
                  "children": [
                    {
                      "name": "See",
                      "children": [],
                      "props": [],
                      "state": [],
                      "methods": []
                    }
                  ],
                  "props": [],
                  "state": [],
                  "methods": []
                }
              ],
              "props": [],
              "state": [],
              "methods": []
            }
          ],
          "props": [
            {
              "name": "foo",
              "value": "props.foo",
              "parent": "Notorious"
            },
            {
              "name": "click",
              "value": "props.click",
              "parent": "Notorious"
            }
          ],
          "state": [],
          "methods": []
        }
      ],
      "props": [
        {
          "name": "foo",
          "value": "state.foo",
          "parent": "BigPoppa"
        },
        {
          "name": "bar",
          "value": "state.bar",
          "parent": "BigPoppa"
        },
        {
          "name": "click",
          "value": "handleClick",
          "parent": "BigPoppa"
        }
      ],
      "state": [],
      "methods": []
    },
    {
      "name": "Biggie",
      "children": [],
      "props": [
        {
          "name": "bar",
          "value": "state.bar",
          "parent": "BigPoppa"
        }
      ],
      "state": [],
      "methods": []
    }
  ]
}
