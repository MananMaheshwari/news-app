"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../connections/auth";
import { collection,addDoc, getDocs, where, query, deleteDoc, updateDoc, doc } from "firebase/firestore";
import Navbar from "@/components/Navbar";
import NewsDashboard from "@/components/NewsDashboard";


export default function Home() {

  const router=useRouter();
  const {isLoading, authUser, setAuthUser, signOut} =useAuth();
  useEffect(()=>{
    console.log(isLoading)
    console.log(authUser)
    if(!isLoading && !authUser){
      
        router.push("/login")
    }
  },[isLoading, authUser])
  return (
    <main className="main-body">
      <Navbar/>
      <NewsDashboard/>
    </main>
  )
}
