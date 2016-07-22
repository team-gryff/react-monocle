import React from 'react';
import CardFront from './CardFront';
import CardBack from './CardBack';

var EditableCard = React.createClass({
  render: function(){
    return <div className="card-wrap">
      {(this.props.totalCards < 2) ? null : <div className="card card-stack1"></div>}
        <div className="card">
        <CardFront
          {...this.props}
          toggleEditMode={this.props.editClickHandler}
          isEditMode={this.props.isEditMode}
          />
        <CardBack
          {...this.props}
          toggleEditMode={this.props.editClickHandler}
          isEditMode={this.props.isEditMode}
          />
        </div>
        {(this.props.totalCards < 3) ? null : <div className="card card-stack2"></div>}
      </div>
  }

});

export default EditableCard;