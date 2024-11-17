export interface IRecipe {
    id: string,
    label: string,
    ingredients: string[],
    instruction: string[],
    category: string,
    imageId: number
}

export interface IComments {
    id: string,
    recipeId: string,
    userId: string,
    userName: string,
    userAvatar: string | null,
    text: string
}

export interface ILikes {
    id: string,
    userId: string,
    recipeId: string
}

export interface IUser {
    id: string | null,
    email: string | null,
    name: string | null,
    photoURL: string | null
}

export interface IRecipeData {
    recipe: IRecipe,
    likes: ILikes[],
    comments: IComments[],
    image: string | null
}