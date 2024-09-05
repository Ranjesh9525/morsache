import React from "react";
import OrderReviewCard from "../../components/OrderReviewCard";
import PageHeadingText from "../../components/PageHeadingText";
import UserViewCard from "../../components/UserViewCard";

type Props = {
  params: {
    id: string;
  };
};

const Page = (props: Props) => {
  return (
    <>
      <PageHeadingText
        pageHeading="View user"
        description="Moderate a user account"
      />
      <div className="container mx-auto min-h-[70vh] py-10 ">
        <UserViewCard id={props.params.id.toString()} />
      </div>
    </>
  );
};

export default Page;
