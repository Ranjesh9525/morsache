
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
      <div className="w-full container grid grid-cols-9 mb-9 mt-4 gap-4">
        <div className="col-span-6">
        <ShippingInformation/>
        <PrevAndNextBtn showNext={true} showBack={true} nextLink={ `/cart/checkout/payment/${props.params.cartId.toString()}`} prevLink={`/cart/checkout/${props.params.cartId.toString()} `}/>
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
