import Search from './modules/SearchModule';
import Recipe from './modules/Recipe';
import List from './modules/List';
import Likes from './modules/Likes';
import * as searchView from './views/SearchView';
import * as recipeView from './views/RecipeView';
import * as listView from './views/ListView';
import * as likesView from './views/LikesView';
import { elements, renderLoader, clearLoader } from './views/base';

//** global state
//* - Search object
//* - Current recipe object
//* - Shipping list object
//* = Liked recipes
const state = {};
window.state = state;


//** Search controller */
const ctrlSearch = async () => {
    // Get the guery from the view;
    const query = searchView.getInput();

    if (query) {
        // Create new Search object if query is not empty and add it to state
        state.search = new Search(query);

        // Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        // Search for recipes
        await state.search.getResult();

        // Render results on the UI
        clearLoader();
        searchView.renderResults(state.search.result);
    }

}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    ctrlSearch();
})

elements.searchResPages.addEventListener('click', event => {
    const button = event.target.closest('.btn-inline');
    if (button) {
        const goToPage = parseInt(button.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
})

//** Recipe controller */
const ctrlRecipe = async () => {
    //get id from the url
    const id = window.location.hash.replace('#', '');
    if (id) {
        // prepare the UI for the changes
        recipeView.clearRecipe();
        renderLoader(elements.recipeResult);

        //Highlight selected item
        if (state.search) searchView.highlightSelected(id);

        // Create new Recipe object
        state.recipe = new Recipe(id);

        try {
            // Get the recipe data
            await state.recipe.getRecipe();
            // Calculate time, servings and parse ingredients
            state.recipe.calcServings();
            state.recipe.calcTime();
            state.recipe.parseIngredients();

            // Render the recipe data to UI
            clearLoader();
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
            //console.log(state.recipe);

        } catch (error) {
            console.log(error);
            alert('error processing the recipe');
        }
    }
}

//** List controller */
const ctrlList = () => {
    // Create new list if there is none;
    if (!state.list) state.list = new List();

    // add ingredients to the List;
    state.recipe.ingredients.forEach(element => {
        const addedItem = state.list.addItem(element.count, element.unit, element.ingredient);
        // render List
        listView.renderItem(addedItem);
    });
}

//** Like controller */
const ctrlLikes = () => {
    if (!state.likes) state.likes = new Likes();
    const currentId = state.recipe.id;
    if (state.likes.isLiked(currentId)) {
        //If user liked
        //Remove like to the state
        state.likes.deleteLike(currentId);
        //Toggle like button
        likesView.toggleLikeButton(true);
        //Remove like from UI
        likesView.removeLike(currentId);

    } else {
        //If user didn't liked
        //Add like to the state
        const newLike = state.likes.addLike(currentId, state.recipe.title, state.recipe.author, state.recipe.img);
        //Toggle like button
        likesView.toggleLikeButton(false);
        //ADd like to UI
        likesView.renderLikes(newLike);
    }
    likesView.toggleLikeMenu(state.likes.getNumOfLikes());
}

// Handle delete and update list
elements.shoppingList.addEventListener('click', event => {
    const id = event.target.closest('.shopping__item').dataset.itemid;

    if (event.target.matches('.shopping__delete, .shopping__delete *')) {
        //delete from state
        state.list.deleteItem(id);
        //remove from UI
        listView.deleteItem(id);
    } else if (event.target.matches('.shopping__count-value')) {
        const val = event.target.value;
        state.list.updateCount(id, val);
    }

});

['hashchange', 'load'].forEach(event => window.addEventListener(event, ctrlRecipe));

//Restore recipes on page load
window.addEventListener('load', () => {
    //Testing
    if (!state.likes) state.likes = new Likes();
    state.likes.loadData();
    likesView.toggleLikeMenu(state.likes.getNumOfLikes());

    //Render likes
    state.likes.likes.forEach(element => likesView.renderLikes(element));
})

//Handling recipe button clicks
elements.recipeResult.addEventListener('click', (event) => {
    if (event.target.matches('.btn-decrease, .btn-decrease *')) {
        //Decrease
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingIngredients(state.recipe);
        }

    }
    if (event.target.matches('.btn-increase, .btn-increase *')) {
        //Increase
        state.recipe.updateServings('inc');
        recipeView.updateServingIngredients(state.recipe);
    }

    if (event.target.matches('.recipe__btn-add, .recipe__btn-add *')) {
        ctrlList();
    }

    if (event.target.matches('.recipe__love, .recipe__love *')) {
        //Like controller
        ctrlLikes();
    }
});

