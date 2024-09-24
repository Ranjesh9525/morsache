"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import HomeLayout from "@/components/layouts/HomeLayout";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import { signIn, useSession } from "next-auth/react";
import { Account } from "@/serverlessActions/_userActions";
import { useMutation } from "@tanstack/react-query";
import { ClipLoader } from "react-spinners";

type Props = {};

const Page = (props: Props) => {
  const router = useRouter();
  // const[showPassword,setShowPassword]= useState(false)
  const callbackUrl = useSearchParams().get("callbackUrl");
  const formSchema = z.object({
    firstName: z.string().min(2, {
      message: "first name must be at least 2 characters.",
    }),
    lastName: z.string().min(2, {
      message: "last name must be at least 2 characters.",
    }),
    phoneNumber: z.string().min(9, {
      message: "phone number must be at least 9 characters.",
    }).max(14, {
      message: "phone number must not be longer than 14 characters.",
    }),
    password: z
      .string()
      .min(8, {
        message: "Password must be 8 characters long",
      })
      .refine(
        (value) =>
          /(?=[A-Za-z0-9@#$%^&+!=]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+!=])(?=.{8,}).*$/.test(
            value
          ),
        "Password must contain uppercase, a number and a special character"
      ),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
    },
  });
  const {data,isError,isPending,error,isSuccess,mutate:server_updateUserDetails}=useMutation({
    mutationFn:Account,
    onSuccess:(data)=>{
      if(data?.success == false && data?.data?.error){
        toast({
          variant: "destructive",
          title: "Couldnt update account detail",
          description: <p>{data?.data?.error?.message}</p>,
        });
      router.push('/serverError')
      }else{
      toast({
        variant:"default",
        title:"Account updated successfully",
      })
      router.push("/account")
    }},
 

  })

  

  async function onSubmit(values: z.infer<typeof formSchema>) {
    
   server_updateUserDetails({password:values.password,firstName:values.firstName,lastName:values.lastName,phoneNumber:values.phoneNumber})
  }
  if (!callbackUrl) {
    router.push("/auth/login");
  }
  return (
    <HomeLayout title="Create an account - Morsache Clothing">
      <div
        id="auth-container"
        className="flex flex-col min-h-screen  items-center md:p-12 p-6"
      >
        {/* <h1 className="text-2xl uppercase font-semibold text-center mt-4 mb-12"> */}
        <h1 className="uppercase font-semibold tracking-tight lg:text-2xl mt-4 text-center mb-12 text-xl">

          Create your account
        </h1>
        <DropdownMenuSeparator />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full md:max-w-[400px]  px-6 md:px-4  space-y-4 md:space-y-8"

          >
            <FormField
              control={form.control}
              name={"firstName" as never}
              render={({ field }) => (
                <FormItem className="items-start flex w-full flex-col">
                  <FormLabel className="capitalize tracking-tight text-xl">
                    first name
                  </FormLabel>
                  <FormDescription className="text-[12px]">
                    Please fill in your first name
                  </FormDescription>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"lastName" as never}
              render={({ field }) => (
                <FormItem className="items-start flex w-full flex-col ">
                  <FormLabel className="capitalize tracking-tight text-xl">
                    last name
                  </FormLabel>
                  <FormDescription className="text-[12px]">
                    Please fill in your last name
                  </FormDescription>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"phoneNumber" as never}
              render={({ field }) => (
                <FormItem className="items-start flex w-full flex-col ">
                  <FormLabel className="capitalize tracking-tight text-xl">
                    Phone Number
                  </FormLabel>
                  <FormDescription className="text-[12px]">
                    Please fill in your Phone Number
                  </FormDescription>
                  <FormControl>
                    <Input placeholder="Phone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"password" as never}
              render={({ field }) => (
                <FormItem className="items-start flex w-full flex-col ">
                  <FormLabel className="capitalize tracking-tight text-xl">
                    password
                  </FormLabel>
                  <FormDescription className="text-[12px]">
                    Please fill in your password to continue
                  </FormDescription>
                  <FormControl>
                    <Input type={'password'} placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <Button 
              disabled={isPending}
              type="submit" className="w-full text-center">
                { isPending ? <ClipLoader color="#fff" size={21}/> : "Save"}
              </Button>
              <p className="text-[12.5px] capitalize text-center">
              </p>
            </div>
          </form>
        </Form>
      </div>
    </HomeLayout>
  );
};

export default Page;
