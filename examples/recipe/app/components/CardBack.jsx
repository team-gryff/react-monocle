import React from 'react';

var CardBack = React.createClass({
  getInitialState: function(){
    return {
      title: this.props.data.title,
      ingredients: this.props.data.ingredients,
      imageUrl: this.props.data.imageUrl
    }
  },
  render: function(){
    return <div className={this.props.isEditMode ? "" : "hidden"}>
      <h3>Edit Recipe</h3>
      <form>
        <label>Title:
          <input
          onChange={this.handleTitleChange}
          type="text"
          value={this.state.title}
          />
        <br/>
        </label>
        <label><span className="textarea-label">Ingredients:</span>
          <input
          onChange={this.handleIngredientsChange}
          type="text"
          value={this.state.ingredients.toString()}
          />
        </label>
        <label>Image URL:
          <input
          onChange={this.handleImageUrlChange}
          type="text"
          value={this.state.imageUrl}
          />
        </label>
        <div className="button-group">
          <span className="button" onClick={this.handleSave}><i className="fa fa-floppy-o"></i> Save</span>
          <span className="button" onClick={this.handleUndo}><i className="fa fa-undo"></i> Undo</span>
        </div>
       </form>
    </div>
    },
    //change this so that the next
  handleTitleChange: function(e){
    this.setState({title: e.target.value})
  },
  handleIngredientsChange: function(e){
    this.setState({ingredients: e.target.value.split(',')})
  },
  handleImageUrlChange: function(e){
    this.setState({imageUrl: e.target.value})
  },
  handleSave: function(){
    this.props.saveTitle(this.state.title);
    this.props.saveIngredients(this.state.ingredients);
    this.props.saveImageUrl(this.state.imageUrl);
    this.props.toggleEditMode();
  },
  handleUndo: function(){
    this.setState({
      title: this.props.data.title,
      ingredients: this.props.data.ingredients
    });
  }
});

export default CardBack;