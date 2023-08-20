"use client"
import {useState, useEffect, useContext, createContext} from "react";
import { onAuthStateChanged, signOut as authSignOut } from "firebase/auth";
import { auth } from "./firebase";

const AuthUserContext=createContext({
    authUser: null,
    isLoading: true
})

export default function useFirebaseAuth(){
    const [authUser, setAuthUser]=useState(null);
    const [isLoading, setIsLoading]=useState(true);

    const clear=()=>{
        setAuthUser(null);
        setIsLoading(false);
    }
    const authStateChanged=(user)=>{
        setIsLoading(true);
        if(!user){
            clear();
        }
        else{
            setAuthUser({uid: user.uid, email: user.email, name: user.displayName})
            setIsLoading(false);    
        }
    }

    const signOut=async()=>{
        authSignOut(auth).then(()=>clear()).catch((err)=>console.log(err));
    }

    useEffect(()=>{
        const unsubscribe=onAuthStateChanged(auth, authStateChanged)
    },[])

    return {
        authUser, isLoading, setAuthUser, signOut,
    };
}

export const AuthUserProvider=({children})=>{
    const auth=useFirebaseAuth();
    return(
        <AuthUserContext.Provider value={auth}>
            {children}
        </AuthUserContext.Provider>
    )
}

export const useAuth=()=>{
   return useContext(AuthUserContext);
}  