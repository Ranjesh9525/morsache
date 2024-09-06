
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
      <div className="w-full container lg:grid lg:grid-cols-9 grid- flex flex-col lg:mb-9 mt-4 gap-9">
        <div className="col-span-3 order-2">
          <div className="sticky top-[34px]">
            <CheckoutCard showProducts={true} cartId={props.params.cartId.toString()} />
          </div>
        </div>
        <div className="col-span-6 order-1 flex flex-col h-full">
          <div className="flex-1">
            <DetailsInformation cartId={props.params.cartId} />
          </div>
        </div>
      </div>
    </CheckoutLayout>
  );
};

export default page;
