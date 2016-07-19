import React from 'react';
import ListItem from './ListItem'

export default class List extends React.Component {

  render() {
    return (
      <ul>
        {this.props.items.map((itemText, i) =>
          <ListItem
            key={i}
            text={itemText}
          />
        )}
      </ul>
    );
  }

}
