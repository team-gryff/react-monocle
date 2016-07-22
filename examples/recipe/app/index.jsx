import React from 'react';
import { render } from 'react-dom';
import RecipeBox from './components/RecipeBox';

var App = React.createClass({
  render: function() {
    return (<div>
      <h1>Recipe Book</h1>
      <RecipeBox />
    </div>)
  }
});

render(<App />, document.getElementById('container'));