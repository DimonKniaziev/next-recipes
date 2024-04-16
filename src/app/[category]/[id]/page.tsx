import RecipeDetails from "@/componens/recipe-details"

export default function Page({ params }: { params: { category: string, id: string } }) {
    return (
        <div>
            <RecipeDetails recipeId={params.id}/>
        </div>
    )
}