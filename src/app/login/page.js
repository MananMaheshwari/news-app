"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc"
import { toast } from "react-toastify";
import { auth } from "../../../connections/firebase.js";
import {signInWithPopup, signInWithEmailAndPassword, GoogleAuthProvider } from "firebase/auth";
import { useAuth } from "../../../connections/auth.js";

const provider=new GoogleAuthProvider();

const Page = () => {
  const router=useRouter();  
  const [user, setUser] = useState({
        email: "",
        password: "",
    });
    const {authUser, isLoading} = useAuth();

    useEffect(()=>{
      if(!isLoading && authUser){
        router.push("/")
      }
    },[isLoading, authUser])

    //handle user input
    const handleInput = (e) => {
        console.log(e);
        setUser({ ...user, [e.target.name]: e.target.value });
    }
    const googleSignIn=async()=>{
        try{
            const newUser=await signInWithPopup(auth, provider);
        }catch(err){
            console.log(err);
        }
    }
    //form submit function
    const handleForm = async (e) => {
        e.preventDefault();
        if (!user.email || !user.password) {
            toast.error("All fields are not filled", {
                position: "top-center"
            })
        }
        try {
            const newUser = await signInWithEmailAndPassword(
                auth,
                user.email,
                user.password
            )
            console.log(newUser);

        } catch (err) {
            console.log("error: ", err);
            toast.error("Wrong Credentials", {
                position: "top-center"
            });
        }
    }


    return isLoading || (!isLoading && authUser)?
    <h1 className="font-bold text-3xl">Loading...</h1>:
     (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img
                        className="mx-auto h-24 w-auto"
                        src="https://cdn.dribbble.com/users/975543/screenshots/4623054/1_d.png"
                        alt="Your Company"
                    />
                    <h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Log in
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" action="#" method="POST">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    onChange={handleInput}
                                    value={user.email}
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                    Password
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    onChange={handleInput}
                                    value={user.password}
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                onClick={handleForm}

                                className="flex w-full justify-center rounded-md bg-cyan-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Log In
                            </button>
                        </div>
                    </form>
                    <button onClick={googleSignIn} className="rounded-lg bg-gray-200 w-full my-4 p-1.5" ><FcGoogle className="inline-block"/> Sign in with Google</button>
                    <p className="mt-4 text-center text-sm text-gray-500">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="font-semibold leading-6 text-cyan-500 hover:text-indigo-500 hover:underline">
                            Sign Up
                        </Link>
                    </p>
                </div>
                
            </div>
        </>
    )
}

export default Page