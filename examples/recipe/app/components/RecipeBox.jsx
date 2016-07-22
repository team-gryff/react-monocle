import React from 'react';
import EditableCard from './EditableCard';
import CardAdd from './CardAdd';
import Menu from './Menu';

var helpers = {
//localStorage test helper from https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
  storageAvailable: function(type) {
  	try {
  		var storage = window[type],
  			x = '__storage_test__';
  		storage.setItem(x, x);
  		storage.removeItem(x);
  		return true;
  	}
  	catch(e) {
  		return false;
  	}
  }
};


var testData = [
  {
    title: 'Banana Bread',
    ingredients: ['140g softened butter','140g caster sugar','2 large eggs', '140g self-raising flour','1tsp baking powder', '2 very ripe banana', '50g icing powder'],
    imageUrl: 'http://cdn.wholelifestylenutrition.com/wp-content/uploads/Banana-Nut-Bread.jpg'
  },
  {
    title: 'Chilli Con Carne',
    ingredients: ['1tbsp olive oil','1 onion', '2 garlic cloves', '250g beef mince', '500ml beef stock', '1tsp chilli flakes', '400g tin tomatoes', '2 tins red kidney beans', '200g long grain rice'],
    imageUrl: 'http://www.bbcgoodfood.com/sites/default/files/recipe_images/recipe-image-legacy-id--1001451_6.jpg'
  },
  {
    title: 'Sausage & Bean Caserole',
    ingredients: ['12 pork sausages', '6 rashers streaky bacon', '2 onions', '400g can tomatoes', '300ml chicken stock', '400g mixed beans'],
    imageUrl: 'http://www.bbcgoodfood.com/sites/default/files/recipe_images/recipe-image-legacy-id--901576_11.jpg'
  },
  {
    title: 'Gravy',
    ingredients: ['meat juices', '2 tbsp liquid meat fat', '1 pint stock', '2tsp gravy browning'],
    imageUrl: 'http://40.media.tumblr.com/086f28f810a04d33cd6a685eabdb164d/tumblr_inline_nmjcqrBk7j1tr4e0j_1280.jpg'
  }
];


var RecipeBox = React.createClass({
  getInitialState: function(){
    return {
      editMode: false,
      addMode: false,
      activeCardIdx: 0,
      data: testData,
      nextItem: {
        title: '',
        ingredients: [],
        imageUrl: ''
      }
    };
  },
  componentWillMount: function(){
    var storageAvailable = helpers.storageAvailable;
    if (storageAvailable('localStorage')) {
      if (!localStorage.thepetedRecipes){
        localStorage.thepetedRecipes = JSON.stringify(this.state.data);
      } else {
        var obj = JSON.parse(localStorage.thepetedRecipes)
        this.setState({data: obj});
      }
    }
    else {
    return;
}
  },
  render: function(){
    var filterByActiveIndex = function(data,i){
      return i === this.state.activeCardIdx
    }.bind(this);

    var makeEditableCard = function(card,i){
      return <EditableCard
          key={Date.now() + i + 100}
          data={card}
          totalCards={this.state.data.length}
          saveTitle={this.updateRecipeTitle}
          saveIngredients={this.updateRecipeIngredients}
          saveImageUrl={this.updateImageUrl}
          editClickHandler={this.toggleEditMode}
          isAddMode={this.state.addMode}
          isEditMode={this.state.editMode}
          delete={this.removeRecipe}
         />
     }.bind(this);

     var disabledStyle = {
       opacity: "0.3",
       cursor: "default"
     };

    return (<div>
        <div className="row">
          <div className="card-area clearfix">
            <div className="col col-1">
              <i className="cycle fa fa-chevron-left fa-2x"
                 onClick={this.cycleLeft}
                 style={this.state.addMode || this.state.editMode ? disabledStyle : null}
                 >
              </i>
            </div>
            <div className="col col-2">
              {(this.state.data.length
              ? !this.state.addMode &&
                this.state.data.filter(filterByActiveIndex).map(makeEditableCard)
              : <span>No recipes!</span>)}
              <CardAdd
                isAddMode={this.state.addMode}
                closeClickHandler={this.toggleAddMode}
                saveClickHandler={this.addRecipe}
                data={this.state.nextItem}
                updateNextIngredients={this.updateNextIngredients}
                updateNextTitle={this.updateNextTitle}
                updateNextImageUrl={this.updateNextImageUrl}
                 />
             </div>
             <div className="col col-3">
               <i className="cycle fa fa-chevron-right fa-2x"
                 onClick={this.cycleRight}
                 style={this.state.addMode || this.state.editMode ? disabledStyle : null}
                 >
              </i>
             </div>
            </div>
          </div>


          <Menu
            data={this.state.data}
            recipeClickHandler={this.changeActiveCard}
            addClickHandler={this.toggleAddMode}
            isAddMode={this.state.addMode}
            isEditMode={this.state.editMode}
            activeCardIdx={this.state.activeCardIdx}
            />
    </div>)
  },
  changeActiveCard: function(idx){
    this.setState({
      activeCardIdx: idx,
      addMode: false
    })
  },
  cycleLeft: function(){
    var modifier;
    if (!this.state.addMode && !this.state.editMode) {
      if (this.state.activeCardIdx === 0) {
        modifier = this.state.data.length - 1;
      } else {
        modifier = -1;
      }
      this.setState({
        activeCardIdx: this.state.activeCardIdx + modifier
      })
    }
  },
  cycleRight: function(){
    var modifier;
    if (!this.state.addMode && !this.state.editMode) {
      if (this.state.activeCardIdx === this.state.data.length - 1) {
        modifier = 0;
      } else {
        modifier = this.state.activeCardIdx + 1;
      }
      this.setState({
        activeCardIdx: modifier
      })
    }
  },
  updateRecipeIngredients: function(ingredients){
    var idx = this.state.activeCardIdx;

    var obj = this.state.data;
    obj[idx].ingredients = ingredients;

    this.setState({
      data: obj
    },this.updateLocalStorage);
  },
  updateImageUrl: function(imageUrl){
    var idx = this.state.activeCardIdx;

    var obj = this.state.data;
    obj[idx].imageUrl = imageUrl;

    this.setState({
      data: obj
    },this.updateLocalStorage);
  },
  updateRecipeTitle: function(title){
    var idx = this.state.activeCardIdx;

    var obj = this.state.data;
    obj[idx].title = title;

    this.setState({
      data: obj
    },this.updateLocalStorage);
  },
  updateNextTitle: function(e){
    var obj = this.state.nextItem;
    obj.title = e.target.value;
    this.setState({
      nextItem: obj
    })
  },
  updateNextIngredients: function(e){
    var obj = this.state.nextItem;
    obj.ingredients = e.target.value.split(',');
    this.setState({
      nextItem: obj
    })
  },
  updateNextImageUrl: function(e){
    var obj = this.state.nextItem;
    obj.imageUrl = e.target.value;
    this.setState({
      nextItem: obj
    })
  },
  addRecipe: function(){
    var placeholder = 'http://www.jamesbeard.org/sites/default/files/styles/recipe_335x285/public/default_images/recipe_placeholder.jpg?itok=10fpzziS';
    var recipes = this.state.data;
    var nextRecipe = {
      title: this.state.nextItem.title || 'Untitled',
      ingredients:
      this.state.nextItem.ingredients.length
      ? this.state.nextItem.ingredients
      : ['No ingredients yet!'],
      imageUrl: this.state.nextItem.imageUrl || placeholder
    };

    recipes.push(nextRecipe);
    this.setState({
      addMode: false,
      data: recipes,
      nextItem: {
        title: '',
        ingredients: [],
        imageUrl: ''
      },
      activeCardIdx: this.state.data.length - 1
    },this.updateLocalStorage);
  },
  updateLocalStorage: function(){
    var storageAvailable = helpers.storageAvailable;
   if (storageAvailable('localStorage')) {
     localStorage.thepetedRecipes = JSON.stringify(this.state.data);
   }
   else {
   return;
}
 },
  removeRecipe: function(){
    var cpArray = this.state.data.slice(0);
    cpArray.splice(this.state.activeCardIdx, 1);
    this.setState({
      data: cpArray,
      activeCardIdx: Math.max(this.state.activeCardIdx - 1, 0)
    },this.updateLocalStorage);
  },
  toggleAddMode: function(title){
    this.setState({
      addMode: !this.state.addMode,
      nextItem: {
        title: '',
        ingredients: [],
        imageUrl: ''
      }
    })
  },
  toggleEditMode: function(){
    this.setState({
      editMode: !this.state.editMode
    })
  }
});

export default RecipeBox;

