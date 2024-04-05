import RecipeDetails from "@/componens/recipe-details"

export default function Page({ params }: { params: { category: string, id: number } }) {
    return (
        <div>
            <RecipeDetails recipeId={Number(params.id)}/>
        </div>
    )
}