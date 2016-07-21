import React from 'react';

export default class TodoForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {item: ''};
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <label>Add todo: </label>
        <input type='text' onChange={this.onChange.bind(this)} value={this.state.item} placeholder='Todo...' />
        <input type='submit' value='Do' />
      </form>
    );
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.onFormSubmit(this.state.item);
    this.setState({item: ''});
  }

  onChange(e) {
    this.setState({
      item: e.target.value
    });
  }

}
