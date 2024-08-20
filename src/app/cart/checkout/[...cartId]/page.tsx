
import CheckoutLayout from "@/components/layouts/CheckoutLayout";
import React, { useState } from "react";
import CheckoutCard from "../../components/CheckoutCard";

import DetailsInformation from "../../components/DetailsInformation";
import { useMutation } from "@tanstack/react-query";
import PrevAndNextBtn from "../../components/PrevAndNextBtn";

type Props = {
  params: {
    cartId: string;
  };
};

const page = (props: Props) => {

  return (
    <CheckoutLayout title="Checkout - Morsache Clothing">
      <div className="w-full container grid grid-cols-9 mb-9 mt-4 gap-9">
      <div className="col-span-6 flex flex-col h-full">
      <div className="flex-1">
        <DetailsInformation />
      </div>
      <div className="mt-auto">
        <PrevAndNextBtn
          showBack={true}
          showNext={true}
          nextLink={`/cart/checkout/shipping/${props.params.cartId}`}
          prevLink={`/cart`}
        />
      </div>
    </div>
        <div className="col-span-3">
          <div className="sticky top-[34px]">
            <CheckoutCard cartId={props.params.cartId.toString()} />
          </div>
        </div>
      </div>
    </CheckoutLayout>
  );
};

export default page;
