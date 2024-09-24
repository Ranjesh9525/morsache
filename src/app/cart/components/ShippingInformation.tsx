"use client";
import React, { useEffect, useState } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { redirect, useRouter } from "next/navigation";
import Image from "next/image";
import { AiOutlineUser } from "react-icons/ai";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClipLoader } from "react-spinners";
import { getSession } from "next-auth/react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { UserUpdateShippingAddress } from "@/serverlessActions/_userActions";

import { ShippingContext } from "@/context/shippingContext";
import { UpdateCartOrderRecieveBy } from "@/serverlessActions/_cartActions";
import PrevAndNextBtn from "./PrevAndNextBtn";

const ShippingInformation = ({cartId}:{cartId:any}) => {
  const [userData, setUserData] = useState<any | null>(null);
  const router = useRouter()
  const { Shipping, dispatch } = React.useContext<any>(ShippingContext)!;
  async function fetchUserData() {
    try {
      const session = await getSession();
      setUserData(session!.user);
    } catch (error) {
      console.error(error);
    }
  }

  const {
    isPending,
    data,
    mutate: server_updateCartOrderRecieveBy,
  } = useMutation({
    mutationFn: UpdateCartOrderRecieveBy,
  });
  // Fetch user data on component mount
  // useEffect(() => {
  //   fetchUserCartShippingData();
  // }, []);

  return (
    <div className="space-y-3">
      <h1>How would you like to receive it?</h1>

      <div
   

        className="flex flex-col space-y-6 mb-12"
      >
        {/* <div
          onClick={() => {
            if(!isPending){
            server_updateCartOrderRecieveBy('pickup')
            dispatch({ type: "SET_SHIPPING_CHOICE", payload: "pickup" });
            }
          }}
          className={`flex flex-col items-start space-x-3 rounded-xl border cursor-pointer w-full p-4 border-primary space-y-0 `}
        >
          <div className="flex gap-2">
            <Input
              className="w-4 h-4 checked:text-primary"
              type="radio"
              onChange={() =>{
                if(!isPending){
                  server_updateCartOrderRecieveBy('pickup')
                  dispatch({ type: "SET_SHIPPING_CHOICE", payload: "pickup" });
                  }}
              }
              value="pickUp"
              checked={Shipping.choice === "pickup"}
            />
            <h1 className="font-normal">Pick Up</h1>
          </div>
          <p className={`text-[12.5px] ml-2 ${" text-gray-500"}`}>
            Choose the pickup option for convenient in-store collection of your
            selected items at our store
          </p>
        </div> */}
        <div
          onClick={() => {
if(!isPending){
                  server_updateCartOrderRecieveBy('delivery')
            dispatch({ type: "SET_SHIPPING_CHOICE", payload: "delivery" })} ;
          }}
          className={`flex flex-col gap-2 items-start space-x-3  rounded-xl border cursor-pointer w-full p-4 border-primary`}
        >
          <div className="flex gap-2">
            <Input
              className="w-4 h-4 checked:!bg-primary"
              type="radio"
              onChange={() => {
if(!isPending){
                  server_updateCartOrderRecieveBy('delivery')
                dispatch({ type: "SET_SHIPPING_CHOICE", payload: "delivery" })} ;
              }}
              value="delivery"
              checked={Shipping.choice === "delivery"}
            />
            <h1 className="font-normal">Delivery</h1>
          </div>
          <p className={`text-[12.5px] ml-2 ${" text-gray-500"}`}>
            Get it delivered to your address within 7-12days from when your
            order is placed. further information about delivery would be
            contacted to you
          </p>
        </div>
      </div>
      <div className="mt-auto">
        <PrevAndNextBtn showNext={true} 
        onclickFunc={()=>{
          if(Shipping.choice){
            router.push(`/cart/checkout/payment/${cartId.toString()}`)
          }
        }}
        showBack={true} nextLink={ `/cart/checkout/payment/${cartId.toString()}`} prevLink={`/cart/checkout/${cartId.toString()} `}/>
        </div>
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
