import {
    key
} from '../config';
// import serv from './InfoRecipe'

export default class Recipie {
    constructor(id ) {
        this.id = id
      
    }

    // const urls=[
    //         `https://api.spoonacular.com/recipes/${this.id}/information?includeNutrition=false?apiKey=${key}`,
    //         `https://api.spoonacular.com/recipes/${this.id}/ingredientWidget.json?apiKey=${key}`
    //              `https://api.spoonacular.com/food/ingredients/1001/substitutes`
    // ];

    async getRecipe() {
        try {
            const res = await fetch(`https://api.spoonacular.com/recipes/${this.id}/ingredientWidget.json?apiKey=${key}`)
                .then(response => response.json())
                .then(data => {
                    let recipe = data.ingredients;
                    // console.log(recipe)
                    this.ingredients = []
                    for (let elem of recipe) {
                        this.ingredients.push(elem.amount.metric.value + ' ' + elem.amount.metric.unit + ' ' + elem.name)


                    }
                    // console.log(data.id)
                    // this.ingredients=ing
                    //   console.log(data)
                    // console.log(this.ingredients)

                })

                await fetch(`https://api.spoonacular.com/recipes/${this.id}/information?apiKey=${key}`)
                .then(response => response.json())
                .then(data => {
               
                    this.title=data.title
                    this.min= data.readyInMinutes
                    this.servings=data.servings
                    this.img=data.image
                    this.credit=data.creditsText
                 
                    console.log(this.img)
                })
        } catch (error) {
            // console.log(error);
            alert(error)
        }
    }

    calcTime() {
        // for 3 ingredients =>15 min
        const numIng = this.ingredients.length;
        // console.log(numIng)
        const periods = Math.ceil(numIng / 3)
        this.time = periods * 15
    }

    calcServings() {
        this.servings 
    }

    parseIngredients() {
        const units = ['tbsp', 'tbsps', 'oz', 'tps', 'cup', 'punds', 'g']

        const newIngredients = this.ingredients.map(el => {

            let ingredient = el.toLowerCase()
            // parse ingredient into count, unit and ingredient
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2))

            let objIng;
            if (unitIndex > -1) {
                // there is a unit
                const arrCount = arrIng.slice(0, unitIndex)
                let count;
                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+'))
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                };
            } else if (parseInt(arrIng[0], 10)) {
                // there is no unit but first elem is a number

                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            } else if (unitIndex === -1) {
                // there is no unit and no number in first position
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }


            return objIng
        })
        this.ingredients = newIngredients
    }


    updateServings(type) {

        // servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        // ingredients
        this.ingredients.forEach(ingr => {

            ingr.count *= (newServings / this.servings);
            // ingr.time +=10

        });

        this.servings = newServings;


    }
}