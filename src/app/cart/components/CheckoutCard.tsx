"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Cart, CartItem } from "@/@types/cart.d";
import { Product } from "@/@types/products.d";
import { Separator } from "@/components/ui/separator";
import { format } from "@/components/products/ProductInfo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { validateOffers } from "@/serverlessActions/_cartActions";
import { ClipLoader } from "react-spinners";
import { CiDiscount1 } from "react-icons/ci";

type Props = {
  cart: Cart;
};
type offerProps = {
  offer: {
    title: string;
    description: string;
    description2?: string;
    discount: number;
  };
  offerDiscountedPrice: number;
  product: any;
};
const OfferCard = ({ offer, product, offerDiscountedPrice }: offerProps) => {
  return (
    <div>
      <h1 className="inline-flex justify-between items-center"><p className="font-medium text-lg">{offer.title}</p> <CiDiscount1/></h1>
      <div className="flex flex-col w-full ">
        <h1>Affected Products:</h1>
        <p className="text font-italic text-[12.5px]">{product.name}</p>
      </div>
    </div>
  );
};

//get all offers in cart and all products in cart and send it back with the offer results to the offer component
// const offe = [
//   { offerIf: "10%", offerDiscountedPrice: 1900, productId: 323424 },
// ];
// data:[{offerId,productId,quantity},
const CheckoutCard = ({ cart }: Props) => {
  const [code, setCode] = useState<string>("");
  const [allOfferData, setAllOfferData] = useState<
    | {
        code: string;
        productId: string;
        quantity: number;
      }[]
    | []
  >([]);
  const router = useRouter();
  const {
    isPending,
    isError,
    data: offersData,
    isSuccess,
    error,
    mutate: validateOffersMutate,
  } = useMutation({
    mutationFn: validateOffers,
  });
  // const {
  //   isPending:uploadCartIsPending,
  //   isError:uploadCartError,
    //   isSuccess:uploadCartIsSuccess,
  //   error:uploadCartError,
  //   mutate: server_uploadUserCartMutate,
  // } = useMutation({
  //   mutationFn: uploadUserCart,
  // });
  useEffect(() => {
    if (code) {
      setAllOfferData(() =>
        cart.items.reduce(
          (
            acc: { code: string; productId: string; quantity: number }[],
            curr
          ) => {
            const productOffers = curr.product.offers || [];

            const offersData: {
              code: string;
              productId: string;
              quantity: number;
            }[] = productOffers.map((offer) => ({
              code: code,
              productId: curr.product.id,
              quantity: curr.quantity,
            }));

            return acc.concat(offersData);
          },
          []
        )
      );
    }
  }, [code]);

const [userCartWithDiscount,setUserCartWithDiscount] = useState<Cart>(cart)
const [totalDiscount, setTotalDiscount] = useState<number>(0);

useEffect(() => {
    if (offersData) {
        let totalDiscountAmount = 0;
        const updatedCart = { ...userCartWithDiscount };
        
        offersData.forEach(({ product, offerDiscountedPrice}:any) => {
            const cartItemIndex = updatedCart.items.findIndex(item => item.product.id === product.id);
            if (cartItemIndex !== -1) {
                const discount = product.salePrice ? (product.salePrice - offerDiscountedPrice) : (product.price - offerDiscountedPrice);
                totalDiscountAmount += discount;
                updatedCart.items[cartItemIndex].product.salePrice = offerDiscountedPrice;
            }
        });

        setTotalDiscount(prevTotalDiscount => prevTotalDiscount + totalDiscountAmount);
        setUserCartWithDiscount(updatedCart);
    }
}, [offersData, userCartWithDiscount]);

  console.log("allOfferData", allOfferData);
  return (
    <div className="flex flex-col gap-2 w-full">
      <section id="offers" className="">
        <div className="inline-flex items-center w-full">
          <Input
            type={"text"}
            placeholder={"Enter code"}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full  rounded-r-none focus-visible:ring-none focus-visible:ring-0"
          />
          <Button
            type="submit"
            className="rounded-l-none"
            onClick={() => validateOffersMutate(allOfferData)}
          >
            Apply
          </Button>
        </div>
        {offersData?.data && <h1>Active offers</h1>}
        <div className="flex flex-col items-center my-2">
          {isPending ? (
            <ClipLoader />
          ) : (
            offersData?.data &&
            offersData?.data.map((i: any, ind: number) => (
              <OfferCard
                key={ind}
                offer={i.offer}
                offerDiscountedPrice={i.offerDiscountedPrice}
                product={i.optimizedProduct}
              />
            ))
          )}
        </div>
      </section>
      <Separator />
      <section id="subtotal and shipping" className="flex flex-col gap-2 my-2">
        <span className="inline-flex items-center justify-between text-[15px]">
          <h1 className="font-medium text-gray-800 ">Discounts applied</h1>
          <h1 className="text-gray-400 ">{ format(totalDiscount) }</h1>
       
        </span>
        <span className="inline-flex items-center justify-between text-[15px]">
          <h1 className="font-medium text-gray-800">Shipping</h1>
          <span className="text-gray-400 text-[14px]">
            calculated at checkout
          </span>
        </span>
        <span className="inline-flex items-center justify-between text-[15px]">
          <h1 className="font-medium text-gray-800">Subtotal</h1>
          <span className="text-gray-400 ">  {format(userCartWithDiscount?.totalAmount)}</span>
        </span>
      </section>
      <Separator />
      <section
        id="total"
        className="whitespace items-center-nowrap inline-flex w-full justify-between my-2"
      >
        <h1 className="text-lg font-medium text-gray-600">Total</h1>
        <span className="inline-flex items-center text-sm">
          INR{" "}
          <p className="font-semibold text-[1.35rem] ml-1">
            {format(userCartWithDiscount?.totalAmount)}
          </p>
        </span>
      </section>
      <Separator />
      <Button>Checkout</Button>
    </div>
  );
};

export default CheckoutCard;
