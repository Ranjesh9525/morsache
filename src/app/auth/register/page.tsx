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
import { signIn } from "next-auth/react";

type Props = {};

const Page = (props: Props) => {
  const router = useRouter();
  const callbackUrl = useSearchParams().get("callbackUrl");
  const formSchema = z.object({
    firstName: z.string().min(2, {
      message: "first name must be at least 2 characters.",
    }),
    lastName: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    email: z.string().email("Email is invalid"),
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let email = values.email;
    const response = await signIn("email", {
      email,
      data: values,
      redirect: false,
      registered: true,
    });
     console.log(response)

    if (response?.url === `${process.env.NEXT_PUBLIC_BASE_URL}/auth/register`) {
      router.push("/auth/register"); //  // Redirect to the register page
    } else {
      if (response?.error) {
        toast({
          variant: "destructive",
          title: `${response.error} error`,
          description: "Check your details and try again",
        });
        if (response?.url) {
          router.push(response.url);
        } else {
          router.replace(
            `/auth/login?error=${encodeURIComponent(response.error)}`
          );
        }
      } else {
        toast({
          variant: "default",
          title: `OTP sent to ${values.email}`,
          description: "Check your email for your 6-digit OTP",
        });
        // setEmail(values.email);
      }
    }
  }
  if (!callbackUrl) {
    router.push("/auth/login");
  }
  return (
    <HomeLayout title="Create an account - Morsache Clothing">
      <div
        id="auth-container"
        className="flex flex-col min-h-screen  items-center lg:p-12 sm:p-6"
      >
        <h1 className="text-2xl uppercase font-semibold text-center mt-4 mb-12">
          Create your account
        </h1>
        <DropdownMenuSeparator />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-[400px] space-y-8"
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
              name={"email" as never}
              render={({ field }) => (
                <FormItem className="items-start flex w-full flex-col ">
                  <FormLabel className="capitalize tracking-tight text-xl">
                    Email
                  </FormLabel>
                  <FormDescription className="text-[12px]">
                    Please fill in your email
                  </FormDescription>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
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
              <Button type="submit" className="w-full text-center">
                Save
              </Button>
              <p className="text-[12.5px] capitalize text-center">
                {" "}
              </p>
            </div>
          </form>
        </Form>
      </div>
    </HomeLayout>
  );
};

export default Page;
