import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
}

export const clearResults = () => {
    elements.searchResultList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
}

export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((acc, current) => {
            if (acc + current.length <= limit) newTitle.push(current);
            return acc + current.length;
        }, 0)
        //returning the result
        return `${newTitle.join(' ')}...`;
    }
    return title;
}

const renderRecipe = (recipe) => {
    const markup = `
                 <li>
                    <a class="results__link" href="#${recipe.recipe_id}">
                        <figure class="results__fig">
                            <img src="${recipe.image_url}" alt="${recipe.title}">
                        </figure>
                        <div class="results__data">
                            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                            <p class="results__author">${recipe.publisher}</p>
                        </div>
                    </a>
                </li>
    `;
    elements.searchResultList.insertAdjacentHTML('beforeend', markup);
}

//type 'prev' and 'next'
const createButton = (page, type) => {
    return `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
    `;
    /*
    <button class="btn-inline results__btn--prev">
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-left"></use>
        </svg>
        <span>Page 1</span>
    </button>
    
    <button class="btn-inline results__btn--next">
        <span>Page 3</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-right"></use>
        </svg>
    </button>
    */
}

const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);
    let button;

    if (page === 1 && pages > 1) {
        // show next page button
        button = createButton(page, 'next')
    } else if (page < pages) {
        // show both buttons
        button = `${createButton(page, 'prev')} 
        ${createButton(page, 'next')}`;
    } else if (page === pages && pages > 1) {
        // show prev button
        button = createButton(page, 'prev')
    }

    elements.searchResPages.insertAdjacentHTML('afterBegin', button);

}

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;
    recipes.slice(start, end).forEach(renderRecipe);
    renderButtons(page, recipes.length, resPerPage);
}

export const highlightSelected = id => {
    const resultsArray = document.querySelectorAll('.results__link');
    resultsArray.forEach(element => element.classList.remove('results__link--active'));

    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');
}

