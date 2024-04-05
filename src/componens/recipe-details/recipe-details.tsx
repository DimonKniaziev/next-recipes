"use client"

import React from "react";
import { useRecipes } from "@/store";

interface IRecipeDetails {
    recipeId: number;
}

const RecipeDetails: React.FC<IRecipeDetails> = ({recipeId}) => {
    const recipes = useRecipes(state => state.recipes);

    const selectedRecipe = recipes.find(item => item.id === recipeId);

    const ingredientsList = selectedRecipe?.ingredients.map(item => {
        return <li>{item}</li>
    })

    const instructionsList = selectedRecipe?.instruction.map(item => {
        return <li>{item}</li>
    })
    
    return (
        <div className="tour-list">                               
            <h1>{selectedRecipe?.label}</h1>
            <br/>
            <h2>Інгредієнти:</h2>
            <ul>{ingredientsList}</ul>
            <br/>
            <h2>Спосіб приготування:</h2>
            <ol>{instructionsList}</ol>
        </div>        
    )
    
}

export default RecipeDetails;