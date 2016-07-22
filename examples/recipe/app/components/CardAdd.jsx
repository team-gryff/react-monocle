import React from 'react';

var CardAdd = React.createClass({
  render: function(){
    return <div className={"card " + (this.props.isAddMode ? "animated pulse" : "hidden")}>
      <h3>Add a Recipe</h3>
      <form>
        <label>
          Title:
          <input
            type="text"
            value={this.props.data.title}
            onChange={this.props.updateNextTitle}
            />
        </label>
        <label>
          <span className="textarea-label">Ingredients:</span>
          <input
            type="text"
            placeholder="add,comma,seperated, ingredients"
            value={this.props.data.ingredients.toString()}
            onChange={this.props.updateNextIngredients}
            />
        </label>
        <label>Image URL:
          <input
          type="text"
          value={this.props.data.imageUrl}
          onChange={this.props.updateNextImageUrl}
          />
        </label>
        <div className="button-group">
          <span className="button" onClick={this.props.saveClickHandler}><i className="fa fa-floppy-o"></i> Save</span>
          <span className="button" onClick={this.props.closeClickHandler}><i className="fa fa-times"></i> Cancel</span>
        </div>
      </form>
    </div>
  },
  closeHandler: function(){

    this.props.closeClickHandler();
  }
});

export default CardAdd;