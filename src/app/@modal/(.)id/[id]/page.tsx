"use client";
import { useParams } from "next/navigation";
import RecipeDetailsModal from "@/componens/recipeDetailsModal";

export default function Page() {
    const params = useParams<{ id: string }>()
    
    return (        
        <RecipeDetailsModal recipeId={params.id}/>
    )
}