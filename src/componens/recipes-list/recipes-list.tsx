"use client"

import React, { useEffect, useState } from "react";
import Link from 'next/link';
import { collection, getDocs, query, where } from "firebase/firestore";
import RecipesListItem from "../recipes-list-item";
import { db } from "@/firebase";
import { IRecipes } from "@/interfaces";

interface IRecipesList {
    category: string;
}

const RecipesList: React.FC<IRecipesList> = ({category}) => {
    const [recipesList, setRecipesList] = useState<IRecipes[]>([]);
    
    useEffect(() => {
        console.log("effected");
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
            console.log(recipes);
            setRecipesList(recipes);
        } catch (error) {
            console.error(error);
        }
    }
    
    const recipesItems = recipesList.map((item) => {
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