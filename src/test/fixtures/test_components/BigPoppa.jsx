import React from 'react';
import Notorious from './Notorious.jsx';
import Biggie from './Biggie.jsx';


class BigPoppa extends React.Component {
  constructor() {
    super();
    this.state = {
      foo: true,
      bar: 'yo ima string'
    }
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    return this.setState({
      baz: 'im bazzing'
    })
  }

  render() {
    return(
      <div>
      <Notorious 
        foo={this.state.foo}
        bar={this.state.bar}
        click={this.handleClick}
      />
      <Biggie 
        bar={this.state.bar}
      />
      </div>
    )
  }
}


export default BigPoppa;