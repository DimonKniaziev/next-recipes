export interface IRecipes {
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
    userName: string
    text: string
}

export interface ILikes {
    id: string
    userId: string,
    recipeId: string
}

export interface IUser {
    id: string | null,
    email: string | null,
    name: string | null
}