import React from "react";
import Link from 'next/link';
import RecipesListItem from "../recipes-list-item";
import { IRecipe } from "@/interfaces";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Container } from "@mui/material";

interface IRecipesList {
    recipes: IRecipe[];
}

const RecipesList: React.FC<IRecipesList> = ({recipes}) => {   
    
    const recipesItems = recipes.map((item) => {
        const {id, ...itemProps} = item;
        
        return (
            <Grid2 xs={12} sm={6} md={4} lg={3}key={id}>
                <Link href={`/id/${id}`} prefetch={true}>
                    <RecipesListItem {...itemProps}/>
                </Link>
            </Grid2>
        );
    });

    return (
        <Container>
            <Grid2 container spacing={3}>                                
                {recipesItems}
            </Grid2>   
        </Container>     
    )    
}

export default RecipesList;