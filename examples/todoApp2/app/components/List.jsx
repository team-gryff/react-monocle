import React from 'react';
import ListItem from './ListItem'

export default class List extends React.Component {


  render() {
    const itemsArr = this.props.items.map((item, i) => {
      return <ListItem 
        key={i}
        id={i}
        text={item}
        onDelete={this.props.handleDelete.bind(this, i)}
      />
    });
    return (
      <div>
        {itemsArr}
      </div>
    );
  }

}
