import RecipeDetails from "@/componens/recipe-details"

export default async function Page({
    params,
  }: {
    params: Promise<{ id: string }>
  }) {
    const id = (await params).id

    return (
        <div>
            <RecipeDetails recipeId={id}/>
        </div>
    )
}