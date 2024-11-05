import RecipesList from "@/componens/recipes-list"

export default function Page({ params }: { params: { category: string } }) {
    return (
        <div>
            <RecipesList category={params.category}/>
        </div>
    )
}