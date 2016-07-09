module.exports = {
  "name": "App",
  "props": [],
  "state": [
    {
      "name": "dice",
      "value": {}
    },
    {
      "name": "selected",
      "value": {}
    },
    {
      "name": "selectionHistory",
      "value": []
    },
    {
      "name": "current",
      "value": ""
    },
    {
      "name": "currBlock",
      "value": null
    },
    {
      "name": "wordsPlayed",
      "value": {}
    },
    {
      "name": "score",
      "value": 0
    }
  ],
  "methods": [
    "handleClick",
    "deselect",
    "handleSubmit",
    "checkScore",
    "randomizer"
  ],
  "children": [
    {
      "name": "Board",
      "children": [
        {
          "name": "Dice",
          "children": [],
          "props": [
            {
              "name": "id",
              "value": "key",
              "parent": "Board"
            },
            {
              "name": "key",
              "value": "key",
              "parent": "Board"
            },
            {
              "name": "letter",
              "value": "diceInfo.key",
              "parent": "Board"
            },
            {
              "name": "selected",
              "value": "selectedInfo.key",
              "parent": "Board"
            },
            {
              "name": "handleClick",
              "value": "handleClick",
              "parent": "Board"
            }
          ],
          "state": [],
          "methods": []
        }
      ],
      "props": [
        {
          "name": "diceInfo",
          "value": "state.dice",
          "parent": "App"
        },
        {
          "name": "selectedInfo",
          "value": "state.selected",
          "parent": "App"
        },
        {
          "name": "handleClick",
          "value": "handleClick",
          "parent": "App"
        }
      ],
      "state": [],
      "methods": []
    },
    {
      "name": "CurrentWord",
      "children": [],
      "props": [
        {
          "name": "current",
          "value": "state.current",
          "parent": "App"
        },
        {
          "name": "handleSubmit",
          "value": "handleSubmit",
          "parent": "App"
        }
      ],
      "state": [],
      "methods": []
    },
    {
      "name": "Table",
      "children": [
        {
          "name": "WordScore",
          "children": [],
          "props": [
            {
              "name": "word",
              "value": "Total",
              "parent": "Table"
            },
            {
              "name": "score",
              "value": "props.score",
              "parent": "Table"
            },
            {
              "name": "id",
              "value": "total",
              "parent": "Table"
            }
          ],
          "state": [],
          "methods": []
        },
        {
          "name": "WordScore",
          "children": [],
          "props": [
            {
              "name": "word",
              "value": "key",
              "parent": "Table"
            },
            {
              "name": "score",
              "value": "wordsPlayed.key",
              "parent": "Table"
            }
          ],
          "state": [],
          "methods": []
        }
      ],
      "props": [
        {
          "name": "wordsPlayed",
          "value": "state.wordsPlayed",
          "parent": "App"
        },
        {
          "name": "score",
          "value": "state.score",
          "parent": "App"
        }
      ],
      "state": [],
      "methods": []
    }
  ]
};