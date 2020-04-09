import {
    elements
} from './base';

export const getInput = () => {
    // reutrn input value of the field select get value, return
    return elements.searchInput.value;

};
// clearinput
export const clearInput = () => {
    elements.searchInput.value = '';
}
export const clearResult = () => {
    elements.searchResultList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
}

export const selected = id => {
    const resilts = Array.from(document.querySelectorAll('.results__link'));
    resilts.forEach(el => {
        el
            .classList
            .remove('results__link--active');
    })
    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active')
}

const limitRecipeTitle = (title, limit = 20) => {
    const newTitle = []
    if (title.length > limit) {
        title
            .split(' ')
            .reduce((acc, cur) => {
                if (acc + cur.length <= limit) {
                    newTitle.push(cur)
                }
                return acc + cur.length
            }, 0);
        return `${newTitle.join(' ')} ...`;
    }
    return title;

}

// print one single recipe
const renderRecipe = (recipe,list) => {
    // console.log(recipe)
    const markup = `
                <li > <a class="results__link" href="#${recipe.id}">
                    <figure class="results__fig">
                        <img src="${recipe.img}" alt="${list.title}"></figure>
                        <div class="results__data">
                            <h4 class="results__name">${limitRecipeTitle( recipe.title )}</h4>
                            <p class="results__author">Servings: ${recipe.servings}</p>
                            
                        </div>
                    </a>
                </li>
                `;

    elements.searchResultList.insertAdjacentHTML("beforeend", markup)

}
// buttons
const createButton = (page, type) => {
    return ` 
        <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev'
        ? page - 1
        : page + 1} >
            <svg class="search__icon">
                <use href="img/icons.svg#icon-triangle-${type === "prev"
            ? 'left'
            : 'right'}"></use>
            </svg>
            <span>Page ${type === "prev"
                ? page - 1
                : page + 1}</span>
        </button>
    `;
}

const renderButton = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage)
    let button;
    if (page === 1 && pages > 1) {
        // button to go on next page
        button = createButton(page, 'next')
    } else if (page < pages) {
        // both sides
        button = `
        ${createButton(page, 'prev')}
        ${createButton(page, 'next')}
        `;
    } else if (page === pages && pages > 1) {
        // button to go on prev
        button = createButton(page, 'prev')
    }

    elements
        .searchResPages
        .insertAdjacentHTML("afterbegin", button);
}

export const renderResult = (recipes, page = 1, resPerPage = 8) => {

    // render results of curremt page console.log(recipes)
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    recipes
        .slice(start, end)
        .forEach(renderRecipe)
    // render pagination
    renderButton(page, recipes.length, resPerPage)

}