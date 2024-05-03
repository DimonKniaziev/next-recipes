import { create } from "zustand";
import { IComments, ILikes, IRecipes, IUser } from "./interfaces";
import { persist } from "zustand/middleware";

interface IUserState {
    loggedUser: IUser | null
    login: (user: IUser) => void
    logout: () => void
}

const useUser = create<IUserState>()(
    persist(
        set => ({
            loggedUser: null,
            login: (user: IUser) => set(() => ({loggedUser : user})),
            logout: () => set(() => ({loggedUser : null}))
        }),
        {
            name: 'logged-user-storage'
        }
    )
)

export {useUser};