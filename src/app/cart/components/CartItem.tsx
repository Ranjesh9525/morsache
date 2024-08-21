"use client";
import { Product } from "@/@types/products";
import { CartItem } from "@/@types/cart";
import Image from "next/image";
import Link from "next/link";
import React, { useContext } from "react";
import { Minus, Plus } from "lucide-react";
import { format } from "@/components/products/ProductInfo";
import { MdOutlineCancel } from "react-icons/md";
import { CartContext } from "@/context/cartContext";
import { cn } from "@/lib/utils";
type Props = {
  cartItem: CartItem;
};

const CartItem = ({ cartItem }: Props) => {
  const { cart, dispatch } = useContext(CartContext)!;
  const inStock = cartItem?.product?.stock && parseInt(cartItem?.product?.stock) > 0;

  // const [hideDecreaseBtn, sethideDecreaseBtn] = React.useState(false);

    const [hideIncreaseBtn, sethideIncreaseBtn] = React.useState(false);

function decreaseQuantity (){
  if (cartItem.quantity > 1) {
    dispatch({ type: "DECREASE", payload: cartItem });
  }else{
    dispatch({ type: "REMOVE_FROM_CART", payload: cartItem });
  }
}

function increaseQuantity (){
  if(parseInt(cartItem?.product?.stock!) > (cartItem.quantity+1)){
    dispatch({ type: "INCREASE", payload: cartItem });
  } else {
    sethideIncreaseBtn(true);
    return null
  }
}

  return (
    <div>
      <div
        id="item-container"
        className="border p-3 w-full flex lg:flex-row sm:flex-col  gap-4"
      >
        <div className="w-full align-middle ">
          <h1 className="text-lg font-semibold w-full">
            {cartItem?.product?.name}
          </h1>
          <div className="flex flex-row gap-2 w-full items-center p-4">
            <Image
              src={cartItem?.product?.images[0]}
              alt=""
              width={200}
              height={200}
              className="rounded-lg w-20 h-20 object-contain"
            />
            <section>
              <p className="text-[14px] text-grey-500">
                SKU:{cartItem?.product?.SKU}
              </p>

              <span className="flex flex-col gap-1 text-sm mt-2">
                {cartItem?.variant && <p>Variant: {cartItem?.variant}</p>}
                {inStock ? (
                  <p>{"In Stock"}</p>
                ) : (
                  <p className="text-red-500">Out Of Stock</p>
                )}
                <Link
                  href={`/products/${cartItem?.product?.slug}`}
                  className="text-[#545454] cursor-pointer hover:text-[#545454]/80"
                >
                  View Details
                </Link>
              </span>
            </section>
          </div>
        </div>
        <div className="flex align-middle flex-row m-auto justify-self-center justify-between w-full">
          <section className="flex flex-col items-center gap-2">
            <p className="font-medium uppercase">SIZE</p>
            <p className="text-[#545454]">{cartItem?.size}</p>
          </section>
          <section className="flex flex-col items-center gap-2">
            <p className="font-medium uppercase">PRICE</p>
            <p className="text-[#545454]">
              {format(parseFloat(cartItem?.product?.price))}
            </p>
          </section>
          <section>
            <p className="font-medium uppercase">QUANTITY</p>
            <section className="flex gap-2 items-center">
              <Minus color="#ffffff" className={cn("rounded-full border p-1 bg-[#545454] border-[#545454] cursor-pointer text-white")} onClick={decreaseQuantity}/>
              <p className=" text-lg">{cartItem?.quantity}</p>
              <Plus color="#ffffff" className={cn("rounded-full border p-1 bg-[#545454] border-[#545454] cursor-pointer text-white", hideIncreaseBtn && "hidden" )} onClick={increaseQuantity} />
            </section>
          </section>
          <section className="flex flex-col items-center gap-2">
            <p className="font-medium uppercase">TOTAL</p>
            <p className="text-[#545454]">{format(cartItem?.totalPrice)}</p>
          </section>
        </div>
        <div
          className="lg:m-none sm:bg-gray-100 lg:bg-transparent cursor-pointer group sm:w-full lg:w-fit font-bold text-lg"
          onClick={() =>
            dispatch({ type: "REMOVE_FROM_CART", payload: cartItem })
          }
        >
          <p className="lg:m-none text-center sm:m-auto group-hover:text-gray-700">
            {" "}
            x
          </p>
          {/* <p className="text-[#545454]">{cartItem?.size}</p> */}
        </div>
      </div>
    </div>
  );
};

export default CartItem;
