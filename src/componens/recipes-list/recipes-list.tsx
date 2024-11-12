"use client"

import React, { useEffect, useState } from "react";
import Link from 'next/link';
import { collection, getDocs, query, where } from "firebase/firestore";
import RecipesListItem from "../recipes-list-item";
import { db } from "@/firebase";
import { IRecipes } from "@/interfaces";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Container } from "@mui/material";

interface IRecipesList {
    category: string;
}

const RecipesList: React.FC<IRecipesList> = ({category}) => {
    const [recipesList, setRecipesList] = useState<IRecipes[]>([]);
    
    useEffect(() => {
        loadData();
    }, [])

    const loadData = async() => {
        let filteredQuery = query(collection(db, "recipes"));

        if(category) {
            filteredQuery = query(filteredQuery, where('category', '==', category));
        }

        try {
            const {docs} = await getDocs(filteredQuery);
    
            const recipes = (docs.map((doc) => {
                const id = doc.id;
                return {
                    id,
                    label: doc.data().label,
                    ingredients: doc.data().ingredients,
                    instruction: doc.data().instruction,
                    category: doc.data().category,
                    imageId: doc.data().imageId
                };
            }))
            setRecipesList(recipes);
        } catch (error) {
            console.error(error);
        }
    }
    
    const recipesItems = recipesList.map((item) => {
        const {id, ...itemProps} = item;
        
        return (
            <Grid2 xs={12} sm={6} md={4} lg={3}key={id}>
                <Link href={`/id/${id}`}>
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