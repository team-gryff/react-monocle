import React from 'react';

var MenuItem = React.createClass({
  render: function(){

    var disabledStyle = {
      opacity: "0.5",
      cursor: "default"
    };

    var isActiveItem = (this.props.itemIdx === this.props.activeCardIdx) && this.props.isEditMode;    
    var isDisabled = this.props.isAddMode || this.props.isEditMode;
    return (<li
      onClick={this.handleClick}
      className={this.props.itemIdx === this.props.activeCardIdx && !this.props.isAddMode ? "highlighted" : ""}
      style={(isDisabled && !isActiveItem) ? disabledStyle : null}
      >
      {this.props.data.title}
    </li>)
  },
  handleClick: function(){
    var isDisabled = this.props.isAddMode || this.props.isEditMode;
    if (!isDisabled){
      this.props.clickHandler(this.props.itemIdx)
      }
    }
});

export default MenuItem;