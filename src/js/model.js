import { async } from "regenerator-runtime";
import { API_URL, RES_PER_PAGE, KEY } from "./config";
// import { getJSON, sendJSON } from "./helpers";
import { AJAX } from "./helpers";

export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        page: 1,
        resultsPerpage: RES_PER_PAGE,
    },
    bookmarks: [],
};

const creatRecipeObject = (data) => {
    const { recipe } = data.data;
    return {
        id: recipe.id,
        title: recipe.title,
        cookingTime: recipe.cooking_time,
        image: recipe.image_url,
        ingredients: recipe.ingredients,
        publisher: recipe.publisher,
        servings: recipe.servings,
        sourceUrl: recipe.source_url,
        ...(recipe.key && { key: recipe.key }),
    };
};

export const loadRecipe = async (id) => {
    try{
        const data = await AJAX(`${API_URL}${id}?key=${ KEY }`);
        state.recipe = creatRecipeObject(data);
        
        if(state.bookmarks.some(bookmark => bookmark.id === id)) {
            state.recipe.bookmarked = true;
        } else {
            state.recipe.bookmarked = false;
        }
        
        console.log(state.recipe);
    } catch (err) {
        console.error(`${err} 💥💥💥💥`) ;
        throw err;
    }
};

export const loadSearchResults = async (query) => {
    try {   
        state.search.query = query;
        const data = await AJAX(`${ API_URL }?search=${ query }&key=${ KEY }`);

        state.search.results = data.data.recipes.map(recipe => {
            return {
                id: recipe.id,
                image: recipe.image_url,
                publisher: recipe.publisher,
                title: recipe.title,
                ...(recipe.key && { key: recipe.key }),
            };
        });
        state.search.page = 1;
    } catch(err) {
        console.error(`${err} 💥💥💥💥`) ;
        throw err;
    }
};

export const getSearchResultsPage = (page = state.search.page) => {
    state.search.page = page;

    const start = (page - 1) * state.search.resultsPerpage;  // 0, 10, ...; 
    const end = page * state.search.resultsPerpage;  // 9, 20, ...;
    return state.search.results.slice(start, end);
};

export const updateServings = (newServings) => {
    state.recipe.ingredients.forEach((ing) => {
        ing.quantity = ing.quantity * (newServings / state.recipe.servings);
        // newQt = oldQt * (newServings / oldServings) 
    });

    state.recipe.servings = newServings;
};

const persistBookmarks = () => {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = (recipe) => {
    // add bookmark
    state.bookmarks.push(recipe);

    // mark curr recipe as bookmarked
    if(recipe.id === state.recipe.id) state.recipe.bookmarked = true;

    persistBookmarks();
};

export const deleteBookmark = (id) => {
    // find the bookmark index i.e. to be not bookmarked and delete that bookmark using splice
    const idx = state.bookmarks.findIndex((el) => el.id === id);
    state.bookmarks.splice(idx, 1);

    // mark curr recipe as not bookmarked
    if(id === state.recipe.id) state.recipe.bookmarked = false;

    persistBookmarks();
};

const init = () => {
    const storage = localStorage.getItem('bookmarks');
    if(storage) state.bookmarks = JSON.parse(storage);
};
init();

const clearBookmarks = () => {
    localStorage.clear('bookmarks');
}
// clearBookmarks();

export const uploadRecipe = async (newRecipe) => {
    try{
        const ingredients = Object.entries(newRecipe)
            .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
            .map((ing) => {
                const ingArr = ing[1].split(',').map(ele => ele.trim());
                if(ingArr.length !== 3) throw new Error('Wrong ingredient format! Please use the correct format ;)');
                
                const [ quantity, unit, description ] = ingArr;
                    
                return { quantity: (quantity) ? +quantity : null, unit, description };
            });

            const recipe = {
                title: newRecipe.title,
                source_url: newRecipe.sourceUrl,
                image_url: newRecipe.image,
                publisher: newRecipe.publisher,
                cooking_time: +newRecipe.cookingTime,
                servings: +newRecipe.servings,
                ingredients,
            };

        const data = await AJAX(`${ API_URL }?key=${ KEY }`, recipe);
        state.recipe = creatRecipeObject(data);
        addBookmark(state.recipe);
    } catch (err) {
        throw err;
    }
};