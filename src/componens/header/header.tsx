"use client"

import React, { useState } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { useUser } from "@/store";
import { auth } from "@/firebase"

const Header: React.FC = () => {
    const user = useUser(state => state.loggedUser);
    const login = useUser(state => state.login);
    const logout = useUser(state => state.logout);
    
    const provider = new GoogleAuthProvider();

    const onLogin = () => {
        signInWithPopup(auth, provider)
        .then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential?.accessToken;
            const user = result.user;
            login({id: user.uid, email: user.email, name: user.displayName})
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.customData.email;
            const credential = GoogleAuthProvider.credentialFromError(error);
        }); 
    }

    const onLogout = () => {
        logout();
        signOut(auth).then(() => {
            
        }).catch((error) => {
           
        });
    }

    const LoginButton = () => {
        if(!user) {
            return (
                <div>
                    <span onClick={() => onLogin()} className="cursor-pointer">Увійти</span>                    
                </div>
            )  
        }
        else {
            return (
                <span onClick={() => onLogout()} className="cursor-pointer">Вийти</span>
            )
        }
    }

    return (
        <div className="flex justify-center space-x-4">
            <div>
                <span className=" font-bold my-3 text-4xl">Next-Recipes</span>
            </div>
            <div>
                <LoginButton/>
            </div>
        </div>
    )
}

export default Header;