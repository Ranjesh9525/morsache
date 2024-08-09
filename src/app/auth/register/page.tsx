"use client";
import React from "react";
import { useRouter } from "next/navigation";
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


// value
// :
// [{id: 44784764453026, properties: {}, quantity: 1, variant_id: 44784764453026,…}]
// 0
// :
// {id: 44784764453026, properties: {}, quantity: 1, variant_id: 44784764453026,…}
// discounted_price
// :
// 119900
// discounts
// :
// []
// featured_image
// :
// {aspect_ratio: 0.667, alt: "HoodiniShirt Grey Hoodie", height: 1200,…}
// final_line_price
// :
// 119900
// final_price
// :
// 119900
// gift_card
// :
// false
// grams
// :
// 0
// handle
// :
// "hoodinishirt-green-solid-hoodie"
// has_components
// :
// false
// id
// :
// 44784764453026
// image
// :
// "https://cdn.shopify.com/s/files/1/0420/7073/7058/files/4908bf38cb529d5f2645713041ec664d.jpg?v=1715598821"
// key
// :
// "44784764453026:dc868910e8fa6c65dca9888dc341737f"
// line_level_discount_allocations
// :
// []
// line_level_total_discount
// :
// 0
// line_price
// :
// 119900
// options_with_values
// :
// [{name: "Color", value: "Green"}, {name: "Size", value: "L"}]
// 0
// :
// {name: "Color", value: "Green"}
// 1
// :
// {name: "Size", value: "L"}
// original_line_price
// :
// 119900
// original_price
// :
// 119900
// presentment_price
// :
// 1199
// price
// :
// 119900
// product_description
// :
// "\nGive your everyday wardrobe an effortless appeal with this classy sage 100% polyester shirt. Designed in a Relaxed fit fit, this shirt is known for its endless versatility. A look that bridges dressy and casual, with half sleeve and hooded, it is perfect to wear alone or as an outer layer.\n\nSize & Fit\nFit - Relaxed fit\n  Size -  Model is wearing M size\n\nWash Care\nmachine wash\n\nSpecifications\n\nelevated\nplain\nhooded\n100% polyester\nhalf sleeve\n\nNote : The actual colour of the product may vary slightly due to photographic lighting sources or your device.\n\nSKU:4mswh9890-06\n"
// product_has_only_default_variant
// :
// false
// product_id
// :
// 8316966699170
// product_title
// :
// "HoodiniShirt Grey Hoodie"
// product_type
// :
// "Hoodies"
// properties
// :
// {}
// quantity
// :
// 1
// quantity_rule
// :
// {min: 1, max: null, increment: 1}
// requires_shipping
// :
// true
// sku
// :
// "4MSWH9890-06-L"
// taxable
// :
// true
// title
// :
// "HoodiniShirt Grey Hoodie - Green / L"
// total_discount
// :
// 0
// url
// :
// "/products/hoodinishirt-green-solid-hoodie?variant=44784764453026"
// variant_id
// :
// 44784764453026
// variant_options
// :
// ["Green", "L"]
// variant_title
// :
// "Green / L"
// vendor
// :
// "SNITCH"
type Props = {};

const page = (props: Props) => {
  const router = useRouter()
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

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    router.push("/auth/login");
  }

  return (
    <HomeLayout title="Create an account - Morsache Clothing">
      <div
        id="auth-container"
        className="flex flex-col min-h-screen  items-center lg:p-12 sm:p-6"
      >
        <h1 className="text-2xl uppercase font-semibold text-center mt-4 mb-12">
          Create your <br /> morsache account
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
                    <Input placeholder="Email" {...field} />
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
                    <Input placeholder="Email" {...field} />
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
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <Button type="submit" className="w-full text-center">
                Register
              </Button>
              <p className="text-[12.5px] capitalize text-center"> </p>
            </div>
          </form>
        </Form>
      </div>
    </HomeLayout>
  );
};

export default page;
