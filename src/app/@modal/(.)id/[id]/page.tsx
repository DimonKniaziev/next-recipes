"use client";
import { useParams } from "next/navigation";
import { RecipeDetailsModal } from "@/componens/recipe-details";

export default function Page() {
    const params = useParams<{ id: string }>()
    
    return (        
        <RecipeDetailsModal recipeId={params.id}/>
    )
}