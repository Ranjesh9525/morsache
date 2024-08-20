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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { UserUpdateShippingAddress } from "@/serverlessActions/_userActions";

import { ShippingContext } from "@/context/shippingContext";

const ShippingInformation = () => {
  const [userData, setUserData] = useState<any | null>(null);
const {Shipping,dispatch}=React.useContext<any>(ShippingContext)!;
  async function fetchUserData() {
    try {
      const session = await getSession();
      setUserData(session!.user);
    } catch (error) {
      console.error(error);
    }
  }

  //   const {isPending, isError, data, error, mutate: server_userUpdateShippingAddress} = useMutation({
  //     mutationFn: UserUpdateShippingAddress,
  // })
  // Fetch user data on component mount
  // useEffect(() => {
  //   fetchUserCartShippingData();
  // }, []);



  return (
 
            <div className="space-y-3">
              <h1>How would you like to receive it?</h1>
           
                <div
                  // onValueChange={(value) =>{
                  //    form.
                  //      form.setValue("howCustomerGetsIt", value)
                  //     }}

                  className="flex flex-col space-y-6 mb-12"
                >
                  <div
                    onClick={() => {
                        dispatch({type:"SET_SHIPPING_CHOICE",payload:"pickUp"})
                     
                    }}
                    className={`flex flex-col items-center space-x-3 rounded-xl border cursor-pointer w-full p-4 border-primary space-y-0 ${
                      Shipping.choice === "pickUp" ? "bg-primary text-white" : ""
                    }`}
                  >
                    <div className="w-full flex">
                      <Input
                        className="w-4 h-4"
                        type="radio"
                        onChange={()=>dispatch({type:"SET_SHIPPING_CHOICE",payload:"pickUp"})}
                        value="pickUp"
                        checked={Shipping.choice === "pickUp"}
                      />
                      <h1 className="font-normal">Pick Up</h1>
                    </div>
                    <p
                      className={`text-[12.5px] ml-2 ${
                        Shipping.choice === "pickUp"
                          ? "text-white"
                          : " text-gray-500"
                      }`}
                    >
                      Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                      Rerum repellat consequuntur nesciunt ratione vel, numquam
                      provident assumenda hic, quae obcaecati cupiditate
                      voluptatem eum molestias! Tenetur tempore provident aliio
                      ea voluptates a quasi id, distinctio nobis delectus
                      quaerat minima. Fuga?
                    </p>
                  </div>
                  <div
                    onClick={() => {
                     dispatch({type:"SET_SHIPPING_CHOICE",payload: "delivery"});
                     
                    }}
                    className={`flex flex-col gap-2 items-start space-x-3  rounded-xl border cursor-pointer w-full p-4 border-primary ${
                      Shipping.choice === "delivery" ? "bg-primary !text-white" : ""
                    }`}
                  >
                    <div className="flex gap-2">
                      <Input
                        className="w-4 h-4"
                        type="radio"
                        onChange={()=>{
                     dispatch({type:"SET_SHIPPING_CHOICE",payload: "delivery"});

                        }}
                        value="delivery"
                        checked={Shipping.choice === "delivery"}
                      />
                      <h1 className="font-normal">Delivery</h1>
                    </div>
                    <p
                      className={`text-[12.5px] ml-2 ${
                        Shipping.choice === "delivery"
                          ? "text-white"
                          : " text-gray-500"
                      }`}
                    >
                      Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                      Rerum repellat consequuntur nesciunt ratione vel, numquam
                      provident assumenda hic, quae obcaecati cupiditate
                      voluptatem eum molestias! Tenetur tptio ea voluptates a
                      quasi id, distinctio nobis delectus quaerat minima. Fuga?
                    </p>
                  </div>
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
