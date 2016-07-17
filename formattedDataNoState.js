module.exports = {
  'App': {
    'name': 'App',
    'props': {},
    'state': {},
    'methods': [
      'handleClick',
      'deselect',
      'handleSubmit',
      'checkScore',
      'randomizer',
    ],
    'children': [
      {
        'name': 'Board',
        'children': [],
        'props': [
          {
            'name': 'diceInfo',
            'value': 'state.dice',
            'parent': 'App',
          },
          {
            'name': 'selectedInfo',
            'value': 'state.selected',
            'parent': 'App',
          },
          {
            'name': 'handleClick',
            'value': 'handleClick',
            'parent': 'App',
          },
        ],
        'state': {},
        'methods': [],
      },
      {
        'name': 'CurrentWord',
        'children': [],
        'props': [
          {
            'name': 'current',
            'value': 'state.current',
            'parent': 'App',
          },
          {
            'name': 'handleSubmit',
            'value': 'handleSubmit',
            'parent': 'App',
          },
        ],
        'state': {},
        'methods': [],
      },
      {
        'name': 'Table',
        'children': [],
        'props': [
          {
            'name': 'wordsPlayed',
            'value': 'state.wordsPlayed',
            'parent': 'App',
          },
          {
            'name': 'score',
            'value': 'state.score',
            'parent': 'App',
          },
        ],
        'state': {},
        'methods': [],
      },
    ],
  },
  'Board': {
    'name': 'Board',
    'props': {},
    'state': {},
    'methods': [],
    'children': [
      {
        'name': 'Dice',
        'children': [],
        'props': [
          {
            'name': 'id',
            'value': 'key',
            'parent': 'Board',
          },
          {
            'name': 'key',
            'value': 'key',
            'parent': 'Board',
          },
          {
            'name': 'letter',
            'value': 'props.diceInfo[key]',
            'parent': 'Board',
          },
          {
            'name': 'selected',
            'value': 'props.selectedInfo[key]',
            'parent': 'Board',
          },
          {
            'name': 'handleClick',
            'value': 'handleClick',
            'parent': 'Board',
          },
        ],
        'state': {},
        'methods': [],
        'iterated': 'forIn',
        'source': 'props.diceInfo',
      },
    ],
  },
  'Dice': {
    'name': 'Dice',
    'props': {},
    'state': {},
    'methods': [
      'isSelected',
    ],
    'children': [],
  },
  'Table': {
    'name': 'Table',
    'props': {},
    'state': {},
    'methods': [],
    'children': [
      {
        'name': 'WordScore',
        'children': [],
        'props': [
          {
            'name': 'word',
            'value': 'Total',
            'parent': 'Table',
          },
          {
            'name': 'score',
            'value': 'props.score',
            'parent': 'Table',
          },
          {
            'name': 'id',
            'value': 'total',
            'parent': 'Table',
          },
        ],
        'state': {},
        'methods': [],
      },
      {
        'name': 'WordScore',
        'children': [],
        'props': [
          {
            'name': 'word',
            'value': 'key',
            'parent': 'Table',
          },
          {
            'name': 'score',
            'value': 'props.wordsPlayed[key]',
            'parent': 'Table',
          },
        ],
        'state': {},
        'methods': [],
        'iterated': 'forIn',
        'source': 'props.wordsPlayed',
      },
    ],
  },
  'WordScore': {
    'name': 'WordScore',
    'props': {},
    'state': {},
    'methods': [],
    'children': [],
  },
  'monocleENTRY': 'App',
};
