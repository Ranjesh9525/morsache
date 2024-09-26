"use client";
import React from "react";
import ReviewCard from "../ReviewCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import HomeLayout from "@/components/layouts/HomeLayout";
import { Separator } from "@/components/ui/separator";

type Props = {
  params: {
    orderNo: string;
  };
};

const page = (props: Props) => {

  return (
    <HomeLayout title="Review order - Morsache Clothing">
      <div className="w-full md:container p-4 mb-9 mt-4 gap-9">
        <div id="header" className="  pb-5">
          <section className="flex md:flex-row flex-col gap-3 justify-between items-center ">
            <span className="flex-[6]">
              <h1 className="text-3xl w-full md:w-fit mb-3 md:mb-0 font-bold tracking-tight max-sm:text-xl">
                Review Order {props.params.orderNo}
              </h1>{" "}
              <p className="text-gray-500 text-[14px] my-1 max-sm:text-[12.5px]">
                {" "}
                Regarding any complaints or problems with your order information
                please contact support to cancel or assit with your order. Note
                that this wont be possible when your order has been shipped
              </p>
            </span>
            <span className="flex-[4] justify-end flex-row gap-2 flex">
              <Link href="/search" className="cursor-pointer">
                <Button className="">Back to shopping</Button>
              </Link>
              <Link href="/contact-us" className="cursor-pointer">
                <Button variant="outline" className="">Contact support</Button>
              </Link>
            </span>
          </section>
          <Separator className="mt-7" />
        </div>
        <ReviewCard orderNo={props?.params?.orderNo.toString()}/>
      </div>
    </HomeLayout>
  );
};

export default page;
