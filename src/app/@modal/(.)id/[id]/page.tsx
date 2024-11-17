import { RecipeDetailsModal } from "@/componens/recipe-details";
import { getDownloadURL, ref } from "firebase/storage";
import { db, storage } from "@/firebase";
import { doc, getDoc } from "firebase/firestore"; 
import { getCommentsByRecipeId, getLikesByRecipeId, getRecipeById, getRecipeData, getRecipeImageById } from "@/services/firebase-service";

export default async function Page({
    params,
  }: {
    params: Promise<{ id: string }>
  }) {
    const recipeId = (await params).id

    const recipeData = await getRecipeData(recipeId);      

    return (        
        <RecipeDetailsModal recipeData={recipeData}/>
    )
}