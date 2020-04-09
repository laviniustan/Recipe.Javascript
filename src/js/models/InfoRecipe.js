import {key} from '../config';

export default class Recipie {
    constructor(id) {
        this.id = id;
    }


    
    async getInfoRecipe() {
        try {
            const res = await fetch(`https://api.spoonacular.com/recipes/${this.id}/information?apiKey=${key}`)
                .then(response => response.json())
                .then(data => {
                    
                    this.title=data.title
                    this.min= data.readyInMinutes
                    this.servings=data.servings
                    this.img=data.image
                    this.credit=data.creditsText
                    console.log(data)

                })



        } catch (error) {
            // console.log(error);
            alert(error)
        }


    }


}
