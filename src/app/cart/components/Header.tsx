import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import React from "react";
import { Cart } from "@/@types/cart.d";

type Props = {
  cart: Cart;
};

const Header = ({ cart }: Props) => {
  return (
    <div className="w-full ">
      <h1 className="text-3xl font-semibold w-full mb-10 ">Your Cart</h1>
      <div className="w-full ">
        <span className="w-full flex -items-center justify-between mb-1 ">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-900">
            continue shopping
          </Link>
          <p className="text-lg">
            {cart?.totalItems || 0} {cart.totalItems === 1 ? "item" : "items"}
          </p>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-900">
            Need help?
          </Link>
        </span>
        <Separator />
      </div>
    </div>
  );
};

export default Header;
