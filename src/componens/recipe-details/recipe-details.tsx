"use client"

import React from "react";
import { Container } from "@mui/material";
import RecipeDetailsContent from "./recipe-details-content";

interface IRecipeDetails {
    recipeId: string;
}
const RecipeDetails: React.FC<IRecipeDetails> = ({recipeId}) => {
        
    return (
        <Container maxWidth="md" sx={{ alignContent: "center"}}>
            <RecipeDetailsContent recipeId={recipeId}/>
        </Container>      
    )    
}

export default RecipeDetails;