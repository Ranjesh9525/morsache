
import CheckoutLayout from "@/components/layouts/CheckoutLayout";
import React, { useState } from "react";

import { useMutation } from "@tanstack/react-query";
import CheckoutCard from "@/app/cart/components/CheckoutCard";
import ShippingInformation from "@/app/cart/components/ShippingInformation";
import PrevAndNextBtn from "@/app/cart/components/PrevAndNextBtn";

type Props = {
    params:{
        cartId:string}
};

const page = (props: Props) => {

  return (
    <CheckoutLayout title="Checkout - Morsache Clothing">
      <div className="w-full container lg:grid lg:grid-cols-9 flex flex-col-reverse mb-9 mt-4 gap-9">
      <div className="col-span-6 flex flex-col h-full">
      <div className="flex-1">
        <ShippingInformation/></div>
        <div className="mt-auto">
        <PrevAndNextBtn showNext={true} showBack={true} nextLink={ `/cart/checkout/payment/${props.params.cartId.toString()}`} prevLink={`/cart/checkout/${props.params.cartId.toString()} `}/>
        </div>
        </div>
        <div className="col-span-3">
            <div className="sticky top-[10px]">
                <CheckoutCard cartId={props.params.cartId.toString()}/>
            </div>
        </div>
      </div>
    </CheckoutLayout>
  );
};

export default page;
