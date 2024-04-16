import { create } from "zustand";
import { IComments, ILikes, IRecipes, IUser } from "./interfaces";



interface IRecipesState {    
    recipes: IRecipes[],
    comments: IComments[],
    likes: ILikes[],
    setLike: (like: ILikes) => void
}

interface IUserState {
    loggedUser: IUser | null
    login: (user: IUser) => void
    logout: () => void
}

const useUser = create<IUserState>()(
    set => ({
        loggedUser: null,
        login: (user: IUser) => set(() => ({loggedUser : user})),
        logout: () => set(() => ({loggedUser : null}))
    })
)

export {useUser};