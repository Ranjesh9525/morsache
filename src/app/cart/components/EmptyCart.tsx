import { LucidePackageOpen } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {};

const EmptyCart = (props: Props) => {
  return (
    <div className="w-full flex flex-col items-center my-auto lg:gap-4 sm:gap-2 lg:mt-16 md:mt-10 sm:mt-7">
      <p className="text-4xl font-semibold">Your cart is empty</p>
      <LucidePackageOpen size={100} strokeWidth={0.7} />
      <p>{"Looks like you haven't added any items to your cart."}</p>{" "}
      <Link
        href="/"
        className="py-2 px-4 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-[#545454] text-[#545454] border hover:bg-[#545454]/90 hover:text-white"
      >
        Continue Shopping
      </Link>
    </div>
  );
};

export default EmptyCart;
