import RecipesList from "@/componens/recipes-list";
import { getRecipesListByCategory } from "@/services/firebase-service";

export default async function Home() {
  const recipes = await getRecipesListByCategory("");
  return (
    <div>
      <RecipesList recipes={recipes}/>
    </div>
  );
}