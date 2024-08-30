import { Separator } from "@/components/ui/separator";
import AdminProtected from "@/_hooks/useAdminProtected";
import React from "react";
import OrdersChart from "./components/OrdersChart";
import TopSellingCategoriesChart from "./components/TopSellingCategoriesChart";
import TopSellingProductsChart from "./components/TopSellingProductsChart";
import UsersChart from "./components/UsersChart";

type Props = {};

const page = (props: Props) => {
  return (
    <div className="h-full min-h-[70vh] p-9 space-y-4">
      <div id="header" className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight capitalize"> Hello Harivansh,</h1>
        <p className="text-gray-500 text-[14px] "> Here&#39;s how morsache store has been doing</p>
      </div>
      <Separator />
      <div id="page-content" className="grid grid-cols-7 gap-4 mt-4">
        <div className="col-span-5 w-full space-y-4">
          <UsersChart />
          <OrdersChart />
        </div>
        <div className="col-span-2 w-full space-y-4">
          <TopSellingProductsChart />
          <TopSellingCategoriesChart />
        </div>
      </div>
      <div>
        <div>Accept stripe</div>
        <div>Accept razorpay</div>
        <div>Accept pay on delivery</div>
      </div>
    </div>
  );
};

export default page;
