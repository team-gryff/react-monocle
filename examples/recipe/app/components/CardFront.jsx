import React from 'react';

var CardFront = React.createClass({
  render: function(){
   
    var cardImageStyle = {
      background: 'url(' + this.props.data.imageUrl + ') center center no-repeat',
      backgroundSize: 'cover'
    };

    var createIngredients = function(item, i){
      return <li key={Date.now() + i}>
        {item}
      </li>
    };
    return <div className={this.props.isEditMode ? "hidden" : ""}>
        <div style={cardImageStyle} className="image"></div>
        <div className="content">
          <div className="recipe-content">
            <h3>{this.props.data.title}</h3>
            <ul>
              {this.props.data.ingredients.map(createIngredients)}
            </ul>
          </div>
          <div className="button-group">
            <span className="button" onClick={this.props.toggleEditMode}><i className="fa fa-pencil"></i> Edit</span>
            <span className="button" onClick={this.props.delete}><i className="fa fa-trash"></i> Delete</span>
          </div>
      </div>
    </div>
  }
});

export default CardFront;