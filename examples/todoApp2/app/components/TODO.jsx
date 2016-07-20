import React from 'react';
import TodoForm from './TodoForm';
import List from './List.jsx';


export default class TODO extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      items: [
      'Make splash page',
      'Run unit tests',
      'Deploy app',
    ]
  };
    this.addItem = this.addItem.bind(this);
    this.handleDelete = this.handleDelete.bind(this)
  }

  render() {
    return (
      <div>
        <List
        items={this.state.items}
        handleDelete={this.handleDelete}
        />
        <TodoForm
        onFormSubmit={this.addItem}
        />
      </div>
    );
  }

  addItem(item) {
    const items = this.state.items.slice();
    items.push(item);
    this.setState({ items });  
  }

 handleDelete(i) {
    const items = this.state.items.slice();
    items.splice(i, 1);
    console.log(i);
    this.setState({ items });
  }

}
