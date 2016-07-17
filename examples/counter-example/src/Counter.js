import React from 'react';

const Counter = ({
  header,
  count,
  onDecrement,
  onIncrement,
}) => (
  <div>
    <h2>Counter {header}</h2>
    <p>Count: {count}</p>
    <button onClick={onDecrement}>-</button>
    <button onClick={onIncrement}>+</button>
  </div>
);

Counter.propTypes = {
  header: React.PropTypes.number.isRequired,
  count: React.PropTypes.number.isRequired
};

export default Counter;