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
import { UserUpdateShippingAddress } from "@/serverlessActions/_userActions";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { ShippingAddress } from "@/@types/cart";
import { UserDocument } from "@/@types/user";
import { FaPlus } from "react-icons/fa6";

const DetailsInformation = () => {
  const [userData, setUserData] = useState<UserDocument | null>(null);
  const [addShippingAddress, setaddShippingAddress] = useState<boolean>(false);

  async function fetchUserData() {
    try {
      const session: any = await getSession();
      setUserData(session!.user);
      if (!session!.user?.address || session!.user?.address.length === 0) {
        setaddShippingAddress(true);
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Fetch user data on component mount

  const {
    isPending,
    isError,
    data,
    isSuccess,
    error,
    mutate: server_userUpdateShippingAddress,
  } = useMutation({
    mutationFn: UserUpdateShippingAddress,
  });
  useEffect(() => {
    fetchUserData();
  }, []);
  useEffect(() => {
    if (isError) {
      console.log(error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
    if (isSuccess) {
      fetchUserData();
      setaddShippingAddress(false)
      toast({
        title: "Success",
        description: <p>{data?.message}</p>,
      });
    }
  }, [isError, isSuccess]);
  const shippingSchema = z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    postalCode: z.string(),
    country: z.string(),
  });

  const form = useForm<z.infer<typeof shippingSchema>>({
    resolver: zodResolver(shippingSchema),
  });

  function onSubmit(values: z.infer<typeof shippingSchema>) {
    // Perform any necessary actions with the form values
    const body = {
      userId: userData!._id!,
      address: {
        street: values.street,
        city: values.city,
        state: values.state,
        postalCode: values.postalCode,
        country: values.country,
      },
    };
    // console.log(body);
    server_userUpdateShippingAddress(body);
  }

  return (
    <div>
      <section className="mb-16">
        <h1 className="mb-3">Details</h1>
        {userData ? (
          <div className="space-y-8">
            <div className="flex gap-2 my-3 w-full">
              {userData.image ? (
                <Image
                  src={userData.image}
                  alt="profile"
                  width={50}
                  height={50}
                />
              ) : (
                <AiOutlineUser className="bg-gray-200 p-[0.35rem] h-[30px] w-[30px] rounded-[50%]" />
              )}
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
            </div>{" "}
           <div>
            <h1 className="w-full text-sm mb-4">Saved Shipping Addresses:</h1>
             <div className="w-full grid grid-cols-4 gap-6">
              { userData!.address!.map((a: ShippingAddress, a_index: number) => {
                if (!a.city || !a.state || !a.country || !a.street) return null;
                return (
                  <div
                    className={`rounded-xl col-span-2 min-h-24 border-primary cursor-pointer hover:bg-primary hover:text-white border p-6 ${a.defaultAddress && "bg-primary text-white"}`}
                    key={a_index}
                    onClick={() => {
                      const body = {
                        userId: userData!._id!,
                        address: {
                          street: a.street,
                          city: a.city,
                          state: a.state,
                          postalCode: a.postalCode,
                          country: a.country,
                        },
                      };
                      // console.log(body);
                     if(!isPending){ 
                      server_userUpdateShippingAddress(body);
                     }
                    }}
                  >
                    <p>{a.street || ""}</p>{a.city || ""},{a.state || ""},
                    {a.postalCode || ""},{a.country || ""}
                    {a.defaultAddress && <p className="text-xs">{"(Default)"}</p>}
                  </div>
                );
              })}
               <div
                    className={`col-span-1 flex-col text-[13px] text-center text-[#669999] gap-1 items-center flex justify-center rounded-xl min-h-24 border-[#669999] hover:border-white cursor-pointer hover:bg-[#669999] hover:text-white border p-6 ${addShippingAddress && "hidden" }`}
                  onClick={()=>{
                    if(!isPending){ 

                    setaddShippingAddress(true)}
                  }}
                  >
                <FaPlus/>  <p>Add Shipping Address</p>
                  </div>
            </div>
            </div>
          </div>
        ) : (
          <p className="">
            <ClipLoader />
          </p>
        )}
      </section>
      {addShippingAddress && (
        <section className=" my-8">
          <h1 className="mb-3">Add shipping address</h1>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-12"
            >
              <div className="w-full grid grid-cols-2 gap-3 items-end">
                <FormField
                  control={form.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem className="items-start flex w-full flex-col justify-start">
                      <h1 className="capitalize font-medium tracking-tight text-xl">
                        Street
                      </h1>
                      <FormMessage />
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
                      <FormMessage />
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
                      <FormMessage />
                      <FormControl>
                        <Input placeholder="Enter state" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem className="items-start flex w-full flex-col justify-start">
                      <h1 className="capitalize font-medium tracking-tight text-xl">
                        Postal Code
                      </h1>
                      <FormMessage />
                      <FormControl>
                        <Input placeholder="Enter postal code" {...field} />
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
                      <FormMessage />
                      <FormControl>
                        <Input placeholder="Enter zip code" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  disabled={form.formState.isSubmitting || isPending}
                  type="submit"
                >
                  {isPending ? (
                    <ClipLoader color={"white"} size={20} />
                  ) : (
                    "Submit"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </section>
      )}
    </div>
  );
};

export default DetailsInformation;

// const {
//   isPending: productsFromFilterIsPending,
//   isError: productsFromFilterIsError,
//   data: productsFromFilterResponse,
//   error: productsFromFilterError,
//   mutate: server_fetchProductsFromFilterData,
// } = useMutation({
//   mutationFn: FetchProductsFromFilterData,
// });
