import React from 'react';
import TodoForm from './TodoForm';
import List from './List.jsx';


export default class TODO extends React.Component {

  constructor(props) {
    super(props);
    this.state = {items: [
      'Build splash page',
      'Deploy app',
    ]};
  }

  render() {
    return (
      <div>
        <List
        items={this.state.items}
        />
        <TodoForm
        onFormSubmit={this.addItem.bind(this)}
        />
      </div>
    );
  }

  addItem(item) {
    this.setState({items: this.state.items.concat([item])});
  }

}
