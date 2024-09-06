import { Button } from "@/components/ui/button";
import React from "react";
import OrderReviewCard from "../../components/OrderReviewCard";
import PageHeadingText from "../../components/PageHeadingText";

type Props = {
  params: {
    id: string;
  };
};

const Page = (props: Props) => {
  return (
    <>
      <PageHeadingText
        pageHeading="Review And Edit Order"
        description="Approve,confirm,cancel orders and so on"
      />
      <div className="container mx-auto min-h-[70vh] py-10 ">
        <OrderReviewCard orderId={props.params.id} />
      </div>
    </>
  );
};

export default Page;
