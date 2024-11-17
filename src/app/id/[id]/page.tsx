import { RecipeDetails } from "@/componens/recipe-details"
import { getRecipeData } from "@/services/firebase-service";

export default async function Page({
    params,
  }: {
    params: Promise<{ id: string }>
  }) {
    const recipeId = (await params).id

    const recipeData = await getRecipeData(recipeId);

    return (
        <div>
            <RecipeDetails recipeData={recipeData}/>
        </div>
    )
}