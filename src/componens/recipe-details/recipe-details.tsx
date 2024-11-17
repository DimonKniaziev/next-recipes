"use client"

import React from "react";
import { Container } from "@mui/material";
import RecipeDetailsContent from "./recipe-details-content";
import { IRecipeData } from "@/interfaces";

interface IRecipeDetails {
    recipeData: IRecipeData | null;
}
const RecipeDetails: React.FC<IRecipeDetails> = ({recipeData}) => {

    const content = recipeData ? <RecipeDetailsContent recipeData={recipeData}/> : <span>РЕЦЕПТ НЕ ЗНАЙДЕНО</span>
        
    return (
        <Container maxWidth="md" sx={{ alignContent: "center"}}>
            {content}
        </Container>      
    )    
}

export default RecipeDetails;