"use client";
import React, { useEffect, useState } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";
import Image from "next/image";
import { AiOutlineUser } from "react-icons/ai";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClipLoader } from "react-spinners";
import { getSession } from "next-auth/react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"
import {
  Form,
  FormField,
  FormItem,
  FormDescription,
  FormControl,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";

const ShippingInformation = () => {
  const [userData, setUserData] = useState<any | null>(null);

  async function fetchUserData() {
    try {
      const session = await getSession();
      setUserData(session!.user);
    } catch (error) {
      console.error(error);
    }
  }

  // Fetch user data on component mount
  // useEffect(() => {
  //   fetchUserCartShippingData();
  // }, []);

  const shippingSchema = z.object({
    howCustomerGetsIt: z.object({
        pickUp: z.boolean(),
        delivery: z.boolean(),
    })
});

const form = useForm<z.infer<typeof shippingSchema>>({
    resolver: zodResolver(shippingSchema),
});

function onSubmit(values: z.infer<typeof shippingSchema>) {
    // Perform any necessary actions with the form values
    console.log(values);
}

return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
            <FormField
                control={form.control}
                name="howCustomerGetsIt"
                render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel>How would you like to receive it?</FormLabel>
                        <FormControl>
                            <RadioGroup
                                onValueChange={field.onChange}
                                // defaultValue={field!.value!}
                                className="flex flex-col space-y-1"
                            >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                        <RadioGroupItem value="pickUp" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                        Pick Up
                                    </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                        <RadioGroupItem value="delivery" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                        Delivery
                                    </FormLabel>
                                </FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <Button type="submit">Submit</Button>
        </form>
    </Form>
);
                }
export default ShippingInformation;

// const {
//   isPending: productsFromFilterIsPending,
//   isError: productsFromFilterIsError,
//   data: productsFromFilterResponse,
//   error: productsFromFilterError,
//   mutate: server_fetchProductsFromFilterData,
// } = useMutation({
//   mutationFn: FetchProductsFromFilterData,
// });
