
import CheckoutLayout from "@/components/layouts/CheckoutLayout";
import React, { useState } from "react";
import CheckoutCard from "../../components/CheckoutCard";

import DetailsInformation from "../../components/DetailsInformation";
import { useMutation } from "@tanstack/react-query";

type Props = {
  params: {
    cartId: string;
  };
};

const page = (props: Props) => {

  return (
    <CheckoutLayout title="Checkout - Morsache Clothing">
      <div className="w-full container grid grid-cols-9 mb-9 mt-4 gap-4">
        <div className="col-span-6">
          <DetailsInformation />
        
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
