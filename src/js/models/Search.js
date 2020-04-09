import {key} from '../config';

export default class Search{
    constructor(query){
        this.query=query;
    }

    
    async getResults() {
    // const proxy = 'https://cors-anywhere.herokuapp.com/';
    // const key = '2a0ba042735e4d1192971206de8f2a48';
    // ${proxy}
    // fetch ->axio
        try {
           const searc= await fetch(`https://api.spoonacular.com/recipes/search?apiKey=${key}&query=${this.query}`
)
            .then(response=>response.json())
            .then( data=>{
                //  console.log(data)
                this.result= data.results
                // this.title=data.n
                // console.log(this.res)
                 console.log(data)
                this.title= data.results.title
                // console.log(this.title)
            }
            
            )

            // const recipes = res.data.recipes
                //  console.log(data)
        } catch (error) {
            alert(error);
        }

    }   

}
