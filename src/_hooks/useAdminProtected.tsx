"use client";
import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { getSession } from "./getSession";
import { redirect, useRouter } from "next/navigation";

export default function AdminProtected({ children }: any) {
  const { data: session } = useSession() as any;
  const router = useRouter();
const [authorized,setAuthorized] = useState(false)
  useEffect(() => {
    const getSession = async () => {
      try {
        const serverSession: any = await getSession();
        if (!serverSession?.user) {
          router.push("/auth/login");
        } else if (serverSession?.user?.role !== "admin") {
          //router.push to home and toast unauthorized message
          router.push("/?error=403");
        }
      } catch (error) {
        console.error("Error fetching server session:", error);
        // Handle error, router.push, or show a message
        router.push("/?error=500");
      }
    };

    // if (!session) {
    //   router.push("/auth/login"); // Redirect to sign-in if no session
    // } else {
      getSession(); // Retrieve server session if user is signed in
    // }
  }, []);

  return !session ?  router.push("/auth/login") : session?.user?.role !=="admin" ?  router.push("/?error=403") : children
}
// import { signIn, useSession } from "next-auth/react";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { redirect } from "next/navigation";

//  export default async function AdminProtected({ children }:any) {
//   const session = await getServerSession(authOptions)
//   return !session?.user ? redirect("/auth/login") : children;

//  }
