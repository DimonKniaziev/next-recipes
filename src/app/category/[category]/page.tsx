import RecipesList from "@/componens/recipes-list"
import { getRecipesListByCategory } from "@/services/firebase-service";
export const dynamic = 'force-dynamic'

export default async function Page({
    params,
  }: {
    params: Promise<{ category: string }>
  }) {
    const category = (await params).category

    const recipes = await getRecipesListByCategory(category);
    return (
        <div>
            <RecipesList recipes={recipes}/>
        </div>
    )
}