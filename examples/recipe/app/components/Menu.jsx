import React from 'react';
import MenuItem from './MenuItem';

var Menu = React.createClass({
  render: function(){
    var disabledStyle = {
      opacity: "0.5",
      cursor: "default"
    };

    var createMenuItems = function(item,i){
      return <MenuItem
        data={item}
        key={Date.now() + i}
        itemIdx={i}
        clickHandler={this.props.recipeClickHandler}
        activeCardIdx={this.props.activeCardIdx}
        isEditMode={this.props.isEditMode}
        isAddMode={this.props.isAddMode}
        />
    }.bind(this);

    return <div
      className="menu">
      <ul className="clearfix">
        {this.props.data.map(createMenuItems)}
        <li
          onClick={(!this.props.isAddMode && !this.props.isEditMode) ? this.handleClick : null}
          className={"animated tada" + (this.props.isAddMode ? " highlighted" : "")}
          style={this.props.isEditMode ? disabledStyle : null}
          >
          Add
        </li>
      </ul>

    </div>
  },
  handleClick: function(){
    this.props.addClickHandler();
  }
});

export default Menu;