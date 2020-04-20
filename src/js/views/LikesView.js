import { elements } from './base';
import { limitRecipeTitle } from './SearchView';

export const toggleLikeButton = isLiked => {

    //img/icons.svg#icon-heart-outlined
    const iconString = isLiked ? 'icon-heart-outlined' : 'icon-heart';
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
}

export const toggleLikeMenu = numOfLikes => {
    elements.likesMenu.style.visibility = numOfLikes > 0 ? 'visible' : 'hidden';
}

export const renderLikes = likes => {
    const markup = `
    <li>
        <a class="likes__link" href="#${likes.id}">
            <figure class="likes__fig">
                <img src="${likes.img}" alt="${likes.title}">
            </figure>
            <div class="likes__data">
                <h4 class="likes__name">${limitRecipeTitle(likes.title)}</h4>
                <p class="likes__author">${likes.author}</p>
            </div>
        </a>
    </li>
    `;

    elements.likesList.insertAdjacentHTML('beforeend', markup);
}

export const removeLike = id => {

    const element = document.querySelector(`.likes__link[href*="${id}"]`).parentElement;
    if (element) element.parentElement.removeChild(element);

}