"use client"

import React from "react";
import Link from 'next/link'
import RecipesListItem from "../recipes-list-item";
import { useRecipes } from "@/store";

interface IRecipesList {
    category: string;
}

const RecipesList: React.FC<IRecipesList> = ({category}) => {
    const recipes = useRecipes(state => state.recipes);

    const selectedRecipes = category ? recipes.filter(item => item.category === category) : recipes;
    
    const recipesItems = selectedRecipes.map((item) => {
        const {id, category, ...itemProps} = item;
        
        return (
            <Link href={`/${category}/${id}`} key={id}>
                <RecipesListItem {...itemProps}/>
            </Link>                 
        );
    });

    return (
        <div className="tour-list">                                
            {recipesItems}
        </div>        
    )
    
}

export default RecipesList;