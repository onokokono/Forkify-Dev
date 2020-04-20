import axios from 'axios';


export default class Recipe {

    constructor(id) {
        this.id = id;
    };

    async getRecipe() {
        try {
            const result = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = result.data.recipe.title;
            this.author = result.data.recipe.publisher;
            this.img = result.data.recipe.image_url;
            this.url = result.data.recipe.source_url;
            this.ingredients = result.data.recipe.ingredients;

        } catch (error) {
            console.log(error);
            alert('Something is wrong!');
        }
    }

    calcTime() {
        //Assuming that we spend 15 minutes for each 3 ingredients
        const cIngredients = this.ingredients.length;
        const periods = Math.ceil(cIngredients / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablepoon', 'ounce', 'ounces', 'teaspoon', 'teaspoons', 'cup', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'cup', 'pound'];


        const newIngredients = this.ingredients.map(element => {
            // uniform units
            let ingredient = element.toLowerCase();
            unitsLong.forEach((unit, index) => {
                ingredient = ingredient.replace(unit, unitsShort[index]);
            })
            // remove parenthesis
            ingredient = ingredient.replace(/ *\([^)]*\) */g, '');

            // Parse units into count, unit ingredients
            let objIngredient;
            const arrIngredient = ingredient.split(' ');
            const unitIndex = arrIngredient.findIndex(el => unitsShort.includes(el));

            if (unitIndex > -1) {
                //we have a unit
                // 4 1/2 cups
                // 4 cups
                //4-1/2 cups
                const arrCount = arrIngredient.slice(0, unitIndex);
                let count;
                if (arrCount.length === 1) {
                    count = eval(arrCount[0].replace('-', '+'));
                } else {
                    count = eval(arrCount.splice(0, unitIndex).join('+'));
                }

                objIngredient = {
                    count,
                    unit: arrIngredient[unitIndex],
                    ingredient: arrIngredient.splice(unitIndex + 1).join(' ')

                }


            } else if (parseInt(arrIngredient[0], 10)) {
                //we have a count but no unit
                objIngredient = {
                    count: parseInt(arrIngredient[0], 10),
                    unit: '',
                    ingredient: arrIngredient.slice(1).join(' ')
                }
            } else if (unitIndex === -1) {
                //no units and counts
                objIngredient = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }


            return objIngredient;
        });
        this.ingredients = newIngredients;
    }

    updateServings(type) {
        //servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;
        
        //ingredients
        this.ingredients.forEach(element => {
            element.count *= ( newServings / this.servings );
        });

        this.servings = newServings;
    }
}

