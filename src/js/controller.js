import * as model from './model.js'
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js'; 
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// if(module.hot) {
//     module.hot.accept();
// }

const controlRecipes = async () => {
    try {
        const id = window.location.hash.slice(1);

        if(!id)     return;
        recipeView.renderSpinner();    // loading spinner 

        // update results view to mark selected search result
        resultsView.update(model.getSearchResultsPage());
        
        // update bookmarks view recipes to mark selected bookmarked recipe
        bookmarksView.update(model.state.bookmarks);

        // loading recipe
        await model.loadRecipe(id);        

        // render recipe
        recipeView.render(model.state.recipe);
    } catch (err) {
        recipeView.renderError();
        console.error(err);
    }
};

const controlSearchResults = async () =>{
    try {
        resultsView.renderSpinner();
        // get search query
        const query = searchView.getQuery();
        if(!query) return;

        // load search results
        await model.loadSearchResults(query);

        // render initial results
        // resultsView.render(model.state.search.results);
        resultsView.render(model.getSearchResultsPage());
        
        // render initial pagination btn
        paginationView.render(model.state.search);
    } catch(err) {
        console.log(err);
    }
};

const controlPagination = (goToPage) => {
    // render new results
    resultsView.render(model.getSearchResultsPage(goToPage));
    
    // render new pagination btn
    paginationView.render(model.state.search);
};

const controlServings = (newServings) => {
    // update the recipe servings
    model.updateServings(newServings);

    // update the recipe view
    // recipeView.render(model.state.recipe);
    recipeView.update(model.state.recipe);
};

const controlAddBookmark = () => {
    // add/remove bookmark
    if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
    else model.deleteBookmark(model.state.recipe.id);
    
    // update bookmarks 
    recipeView.update(model.state.recipe);

    // render bookmarks
    bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = () => {
    bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async (newRecipe) => {
    try {

        addRecipeView.renderSpinner(); // loading spinner 

        // upload the new recipe data
        await model.uploadRecipe(newRecipe);
        console.log(model.state.recipe);

        // render recipe
        recipeView.render(model.state.recipe);

        // success message
        addRecipeView.renderMsg();

        // render bookmark view
        bookmarksView.render(model.state.bookmarks);

        // change ID in the url
        window.history.pushState(null, '', `#${ model.state.recipe.id }`);

        // close form window
        setTimeout(() => {
            // addRecipeView.toggleWindow()
        }, MODAL_CLOSE_SEC * 1000);
    } catch(err) {
        console.error('💥💥', err);
        addRecipeView.renderError(err.message); 
    }
};

const init = () => {
    bookmarksView.addHandlerRender(controlBookmarks);
    recipeView.addHandlerRecipe(controlRecipes);
    recipeView.addHandlerUpdateServings(controlServings);
    recipeView.addHandlerAddBookmark(controlAddBookmark);
    searchView.addHandlerSearch(controlSearchResults);
    paginationView.addHandlerCLick(controlPagination);
    addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();





