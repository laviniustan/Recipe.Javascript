import Search from './models/Search';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import {elements, renderLoader, clearLoader} from './views/base';
import Recipe from './models/Recipe';
import InfoRecipe from './models/InfoRecipe';
import List from './models/List';
import Likes from './models/Likes';

// global state search object current recipe obj shopping list obj liked recipes

const state = {};

// Search Controler

const controlSearch = async () => {
    //  get query from view
    const query = searchView.getInput();
    // const query=' '; console.log(query)

    if (query) {
        // new search obj and add to state
        state.search = new Search(query)

        // clear/show loading img
        searchView.clearInput()
        searchView.clearResult()
        renderLoader(elements.searchRes)
        try{
             // search for recipes

            await state.search.getResults()

             // render result to ui
            clearLoader()
            searchView.renderResult(state.search.result)

        } catch(error){
            alert('Something wrong with the search...');
            clearLoader();
            console.log(error)
        }
       
    }
}

// infoReteta

const infoReteta=async()=>{
    const id = window
    .location
    .hash
    .replace('#', '')

    if(id){
        await state.info.getInfoRecipe();

    }
}


elements
    .searchForm
    .addEventListener('submit', e => {
        e.preventDefault();
        controlSearch();

    })

// testing window.addEventListener('load',e=>{     e.preventDefault();
// controlSearch(); })

elements
    .searchResPages
    .addEventListener('click', e => {
        const btn = e
            .target
            .closest('.btn-inline');
        if (btn) {
            const goToPage = parseInt(btn.dataset.goto, 10); //access to data
            searchView.clearResult()
            searchView.renderResult(state.search.result, goToPage)
        }
    })

    const r = new InfoRecipe(492560) 
    r.getInfoRecipe() 
    console.log('r')
    console.log(r)
// Recipe Controler

const controlRecipe = async () => {
    // get id from url
    const id = window
        .location
        .hash
        .replace('#', '')
    //   console.log(id)

    if (id) {
        // prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe)

        // heighlight selectet recipe
        if (state.search) {
            searchView.selected(id)
        }
        // create new Recipe
        state.recipe = new Recipe(id)
        state.info= new InfoRecipe(id)

        // testing window.r=state.recipe
        try {

            // get data recipe and parse ingredients

            await state
                .recipe
                .getRecipe();
            await state.info.getInfoRecipe();
            state
                .recipe
                .parseIngredients();
            // console.log(state.recipe.ingredients) calc serving and time
            state
                .recipe
                .calcTime()
            state
                .recipe
                .calcServings()
            // render recipe
            clearLoader()
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id), state.info);
            //  console.log(state.recipe)

        } catch (error) {
            alert('Error processing recipe:' + error)
            console.log(error)
        }

    }
}
['hashchange', 'load'].forEach( event => addEventListener(event, controlRecipe));

// list controller

const controlList = () => {
    // create new list if there is noone yet
    if (!state.list) state.list = new List();
    
    // add each ingredient

    state
        .recipe
        .ingredients
        .forEach(el => {
            const item = state
                .list
                .addItem(el.count, el.unit, el.ingredient);
            listView.renderItem(item);
        });
}
// delete update item events

elements
    .shopping
    .addEventListener('click', e => {
        const id = e
            .target
            .closest('.shopping__item')
            .dataset
            .itemid;

        // handle the delete button

        if (e.target.matches('.shopping__delete, .shopping__delete *')) {
            // delete from ui and state
            state
                .list
                .deleteItem(id);
            listView.deleteItem(id);
            // handle count update
        } else if (e.target.matches('.shopping__count--value')) {
            // read data ui and update state
            const val = parseFloat(e.target.value, 10);
            state
                .list
                .updateCount(id, val);
        }
    });

// like controller

const controlLike = () => {
    if (!state.likes) 
        state.likes = new Likes();
    
    // 2 states -> unlike/like
    const currentID = state.recipe.id;
    // not liked current recipe
    if (!state.likes.isLiked(currentID)) {
        // add like to the state

        const newLike = state
            .likes
            .addLike(currentID, state.recipe.title, state.recipe.img);

        // toggle the like button
        likesView.toggleLikeBtn(true)
        // add like to ui list
        likesView.renderLike(newLike)
        //  liked current recipe
    } else {

        // remove like from the state
        state
            .likes
            .deleteLike(currentID)
        // toggle the like button
        likesView.toggleLikeBtn(false)
        // remove like from ui list

        likesView.deleteLike(currentID)
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes())
}

// ================================ restore recipe on page load
window.addEventListener('load', () => {
    state.likes = new Likes();

    state
        .likes
        .readStorage()

    likesView.toggleLikeMenu(state.likes.getNumLikes())

    // render existing likes
    state
        .likes
        .likes
        .forEach(like => {
            likesView.renderLike(like)
        })
})

// get id from the recipe we choose==>#12341
// window.addEventListener('hashchange', controlRecipe)  fire ehrnrver the page
// is loaded window.addEventListener('load',controlRecipe) handling recipe
// button click

elements
    .recipe
    .addEventListener('click', e => {
        if (e.target.matches('.btn-decrease, .btn-decrease *')) {
            // decrease
            if (state.recipe.servings > 1) {
                state
                    .recipe
                    .updateServings('dec')
                recipeView.updateservingIng(state.recipe)
            }

        } else if (e.target.matches('.btn-increase, .btn-increase *')) {
            // increase
            state
                .recipe
                .updateServings('inc');
            recipeView.updateservingIng(state.recipe)
            //they're not yet all done by the time that you load up the page
        } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
            // add ingredients to list
            controlList();

        } else if (e.target.matches('.recipe__love, .recipe__love *')) {
            // like controlle
            controlLike()
        }
        // console.log(state.recipe)
    });
// window.l= new List();