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
import {
  Form,
  FormField,
  FormItem,
  FormDescription,
  FormControl,
  FormMessage,
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
  useEffect(() => {
    fetchUserData();
  }, []);

  const shippingSchema = z.object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      zipCode: z.string(),
      country: z.string(),
  });

  const form = useForm<z.infer<typeof shippingSchema>>({
    resolver: zodResolver(shippingSchema),
  });

  function onSubmit(values: z.infer<typeof shippingSchema>) {
    // Perform any necessary actions with the form values
    console.log(values);
  }

  return (
    <div>
      <section>
        <h1>Details</h1>
        {userData ? (
          <div className="flex gap-2 my-3">
            {userData.image ? (
              <Image
                src={userData.image}
                alt="profile"
                width={50}
                height={50}
              />
            ) : (<AiOutlineUser className="bg-gray-200 p-[0.35rem] h-[30px] w-[30px] rounded-[50%]" />)
            }
            <h1 className="">
              {userData.firstName && userData.lastName ? (
                <>
                  {userData.firstName} {userData.lastName}
                </>
              ) : (
                ""
              )}
            </h1>
            <h1 className=" font-medium">{userData.email}</h1>
            {userData.shippingAddress && (
              <p>Shipping Address: {userData.shippingAddress}</p>
            )}
          </div>
        ) : (
          <p className="">
            <ClipLoader />
          </p>
        )}
      </section>
      <section className=" my-8">
      <h1 className="mb-3">Shipping address</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-12"
          >
            <div className="w-full grid grid-cols-2 gap-3 items-start">
              <FormField
                control={form.control}
                name="street"
                render={({ field }) => (
                  <FormItem className="items-start flex w-full flex-col justify-start">
                    <h1 className="capitalize font-medium tracking-tight text-xl">
                      Street
                    </h1>
                    <FormControl>
                      <Input placeholder="Enter street address" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="items-start flex w-full flex-col justify-start">
                    <h1 className="capitalize font-medium tracking-tight text-xl">
                      City
                    </h1>
                    <FormControl>
                      <Input placeholder="Enter city" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem className="items-start flex w-full flex-col justify-start">
                    <h1 className="capitalize font-medium tracking-tight text-xl">
                      State
                    </h1>
                    <FormControl>
                      <Input placeholder="Enter state" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem className="items-start flex w-full flex-col justify-start">
                    <h1 className="capitalize font-medium tracking-tight text-xl">
                      Zip Code
                    </h1>
                    <FormControl>
                      <Input placeholder="Enter zip code" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem className="items-start flex w-full flex-col justify-start">
                    <h1 className="capitalize font-medium tracking-tight text-xl">
                      Country
                    </h1>
                    <FormControl>
                      <Input placeholder="Enter zip code" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </section>
    </div>
  );
};

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
