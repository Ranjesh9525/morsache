
import React,{useState} from "react";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import HomeLayout from "@/components/layouts/HomeLayout";
import { signIn, useSession } from "next-auth/react";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";
import OTPVerification from "../components/OTPVerification";
import SignIn from "../components/SignIn";
// import SignInForm from "./SignInForm";
// import VerificationAlert from "./VerificationAlert";

async function authenticationPrecheck(): Promise<void> {
  const session = await getServerSession(authOptions)
  console.log("session from server",session)
  if (session?.user) return redirect("/account")
}


  type Props = {};
  
  const page = async(props: Props) => {
  await authenticationPrecheck()


  return (
    <HomeLayout title="Login - Morsache Clothing">

  <SignIn/>
    </HomeLayout>
  );
};

export default page;

// "use client"
// import React from "react";

// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import { z } from "zod"

// import { Button } from "@/components/ui/button"
// import {
//     Form,
//     FormControl,
//     FormDescription,
//     FormField,
//     FormItem,
//     FormLabel,
//     FormMessage,
// } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import HomeLayout from "@/components/layouts/HomeLayout";

// type Props = {};

// const page = (props: Props) => {

//     const formSchema = z.object({
//       username: z.string().min(2, {
//         message: "Username must be at least 2 characters.",
//       }),
//     })
//     const form = useForm<z.infer<typeof formSchema>>({
//         resolver: zodResolver(formSchema),
//         defaultValues: {
//           username: "",
//         },
//       })

//       // 2. Define a submit handler.
//       function onSubmit(values: z.infer<typeof formSchema>) {
//         // Do something with the form values.
//         // ✅ This will be type-safe and validated.
//         console.log(values)
//       }

//   return (
//     <HomeLayout title="Login - Morsache Clothing">
//       <div id="auth">
//       <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//         <FormField
//           control={form.control}
//           name="username"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Username</FormLabel>
//               <FormControl>
//                 <Input placeholder="shadcn" {...field} />
//               </FormControl>
//               <FormDescription>
//                 This is your public display name.
//               </FormDescription>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <Button type="submit">Submit</Button>
//       </form>
//     </Form>
//       </div>
//     </HomeLayout>
//   );
// };

// export default page;
