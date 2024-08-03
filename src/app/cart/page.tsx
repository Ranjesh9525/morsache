import HomeLayout from "@/components/layouts/HomeLayout";
import React from "react";

type Props = {};

const page = (props: Props) => {
  return (
    <HomeLayout>
      <div className="h-screen text-center">Cart</div>
    </HomeLayout>
  );
};

export default page;
