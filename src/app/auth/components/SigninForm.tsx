"use client";
import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FcGoogle } from "react-icons/fc";
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
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { ClipLoader } from "react-spinners";

type Props = {
  setEmail: React.Dispatch<React.SetStateAction<string>>;
};

const SigninForm = ({ setEmail }: Props) => {
  const router = useRouter();

  const formSchema = z.object({
    email: z.string().email("Email is invalid"),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });
  const { toast } = useToast();
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    let email = values.email;
    const response = await signIn("email", { email, redirect: false });

    if (response?.error) {
      toast({
        variant: "destructive",
        title: `${response.error} error`,
        description: "Check you details and try again",
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
      setEmail(values.email);
    }
  }

  return (
    <div
      id="auth-container"
      className="flex flex-col min-h-screen  items-center lg:p-12 sm:p-6"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-[400px] space-y-8"
        >
          <FormField
            control={form.control}
            name={"email" as never}
            render={({ field }) => (
              <FormItem className="items-center flex w-full flex-col justify-center">
                <h1 className="uppercase font-semibold tracking-tight text-3xl">
                  Signin With Email
                </h1>
                <FormDescription className="text-[12px]">
                  Please fill in your email to continue
                </FormDescription>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-2">
            <Button
              disabled={
                form.formState.isValidating ||
                form.formState.isSubmitting ||
                !form.formState.isValid
              }
              type="submit"
              className="w-full text-center py-3 h-none"
            >
              {form.formState.isSubmitting ? <ClipLoader size={22} color="white" /> : "Request OTP"}
            </Button>
            <p className="text-[12.5px] capitalize text-center">
              {" "}
              a 6-digit login code would be sent to your email{" "}
            </p>
          </div>
        </form>
      </Form>
      <span className="mx-auto my-4 flex w-[20%] items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400">
        or continue with
      </span>
      <Button
        variant="outline"
        className="w-[20%] cursor-pointer gap-4 inline-flex items-center justify-center"
      >
        <FcGoogle
          title="Google"
          size={25}
          onClick={() => signIn("google")}
          className={"cursor-pointer  dark:bg-white rounded-full"}
        />
        Google
      </Button>
    </div>
  );
};

export default SigninForm;
