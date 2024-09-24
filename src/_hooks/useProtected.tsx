"use client";
import { useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { getSession } from "./getSession";
import { redirect,useRouter } from "next/navigation";


export default function Protected({ children }: any) {
  //   const { data: session } = useSession();
const router = useRouter()
 // useEffect(() => {
   // const getSerSession = async () => {
      
   //   try {
      //  const serverSession: any = //await getSession();
        //if (!serverSession?.user) {
         // router.push("/auth/login");
     //   }
   //   } catch (error) {
     //   console.error("Error fetching //server session:", error);
      //  router.push("/?error=500");
    //  }
   // };

    // if (!session) {
    //   signIn(); // Redirect to sign-in if no session
    // } else {
  //  getSerSession(); // Retrieve server session if user is signed in
    // }
 // }, []);

  return children;
}
// import { signIn, useSession } from "next-auth/react";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { redirect } from "next/navigation";

//  export default async function Protected({ children }:any) {
//   const session = await getServerSession(authOptions)
//   return !session?.user ? redirect("/auth/login") : children;

//  }
