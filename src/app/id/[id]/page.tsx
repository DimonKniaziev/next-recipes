import { RecipeDetails } from "@/componens/recipe-details"

export default async function Page({
    params,
  }: {
    params: Promise<{ id: string }>
  }) {
    const id = (await params).id

    // url = await....


    return (
        <div>
            <RecipeDetails recipeId={id}/>
        </div>
    )
}