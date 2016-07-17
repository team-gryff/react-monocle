import React, { Component } from 'react';
import Counter from './Counter';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      counters: [],
    }
    this.handleAddCounter = this.handleAddCounter.bind(this);
  }

  handleAddCounter() {
    const counters = this.state.counters.slice();
    counters.push(0);
    this.setState({ counters });
  }

  handleDecrement(i) {
    const counters = this.state.counters.slice();
    counters[i]--;
    this.setState({ counters });
  }

  handleIncrement(i) {
    const counters = this.state.counters.slice();
    counters[i]++;
    this.setState({ counters });
  }

  render() {
    return (<div>
      <button 
        onClick={this.handleAddCounter}>
        Add Counter
      </button>
      {this.state.counters.map((count, i) => {
        return <Counter 
          header={i+1}
          key={i}
          count={count}
          onDecrement={this.handleDecrement.bind(this, i)}
          onIncrement={this.handleIncrement.bind(this, i)}
          />
      })}
    </div>);
  }
}