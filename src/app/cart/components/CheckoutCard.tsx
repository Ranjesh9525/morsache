"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Cart, CartForServer, CartItem } from "@/@types/cart.d";
import { Product } from "@/@types/products.d";
import { Separator } from "@/components/ui/separator";
import { format } from "@/components/products/ProductInfo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { redirect, useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createCart,
  validateOffers,
  findUserCart,
  FetchUserCartShippingData,
} from "@/serverlessActions/_cartActions";
import { ClipLoader } from "react-spinners";
import { CiDiscount1 } from "react-icons/ci";
import { Skeleton } from "@/components/ui/skeleton";
import CartCard from "./CartCard";
import { ShippingContext } from "@/context/shippingContext";

type Props = {
  cart?: Cart;
  cartId?: string;
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
      <h1 className="inline-flex justify-between items-center">
        <p className="font-medium text-lg">{offer.title}</p> <CiDiscount1 />
      </h1>
      <div className="flex flex-col w-full ">
        <h1>Affected Products:</h1>
        <p className="text font-italic text-[12.5px]">{product.name}</p>
      </div>
    </div>
  );
};

const CheckoutCard = ({ cart, cartId }: Props) => {
  const [code, setCode] = useState<string>("");
  const [userCartWithDiscount, setUserCartWithDiscount] = useState<Cart | null>(
    !cart ? null : cart
  );
  const { Shipping, dispatch } = React.useContext<any>(ShippingContext)!;
  const [totalDiscount, setTotalDiscount] = useState<number>(0);
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
  const {
    isPending: uploadCartIsPending,
    isError: uploadCartIsError,
    data: uploadCartData,
    isSuccess: uploadCartIsSuccess,
    error: uploadCartError,
    mutate: server_CreateCartMutate,
  } = useMutation({
    mutationFn: createCart,
  });
  const {
    isPending: findCartIsPending,
    isError: findCartIsError,
    isSuccess: findCartIsSuccess,
    data: findCartData,
    error: findCartError,
    mutate: server_findUserCartMutate,
  } = useMutation({
    mutationFn: findUserCart,
  });
  useEffect(() => {
    if (cartId) {
      server_findUserCartMutate(cartId);
    }
  }, []);

  function uploadCartSubmit() {
    const modifiedCart: CartForServer = cart!;
    for (const item of modifiedCart.items) {
      item.productId = item.product.id ? item.product.id : item.product._id;
      item.offersData = item.product.offers.map((offer: any) => {
        return {
          code: offer.code || "",
          productId: item.productId,
          quantity: item.quantity,
        };
      });
      delete item.product;
    }
    server_CreateCartMutate(modifiedCart);
  }

  useEffect(() => {
    if (code) {
      setAllOfferData(() =>
        cart!?.items.reduce(
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

  useEffect(() => {
    if (findCartIsSuccess) {
      setUserCartWithDiscount(findCartData?.data);
      console.log(findCartData?.data);
    }
    if (findCartIsError) {
      console.log(findCartError);
      redirect("/cart?error=404");
    }
  }, [findCartIsSuccess, findCartData, findCartIsError]);
  useEffect(() => {
    if (uploadCartIsSuccess && uploadCartData.data) {
      redirect(`/cart/checkout/${uploadCartData?.data}`);
    }
    if (uploadCartIsError) {
      console.log(uploadCartError);
    }
  }, [uploadCartIsSuccess, uploadCartData, uploadCartIsError]);

  useEffect(() => {
    if (offersData && userCartWithDiscount) {
      let totalDiscountAmount = 0;
      const updatedCart = { ...userCartWithDiscount };

      offersData.forEach(({ product, offerDiscountedPrice }: any) => {
        const cartItemIndex = updatedCart!?.items.findIndex(
          (item) => item.product.id === product.id
        );
        if (cartItemIndex !== -1) {
          const discount = product.salePrice
            ? product.salePrice - offerDiscountedPrice
            : product.price - offerDiscountedPrice;
          totalDiscountAmount += discount;
          updatedCart.items[cartItemIndex].product.salePrice =
            offerDiscountedPrice;
        }
      });

      setTotalDiscount(
        (prevTotalDiscount) => prevTotalDiscount + totalDiscountAmount
      );
      setUserCartWithDiscount(updatedCart);
    }
  }, [offersData, userCartWithDiscount]);

  // console.log("allOfferData", allOfferData);
  // if(!findCartIsPending && userCartWithDiscount===null){
  //   redirect('/cart')
  // }
  const {
    error: shippingDataError,
    data: shippingDataResponse,
    isPending: shippingDataIsPending,
    isError: shippingDataIsError,
    refetch,
  } = useQuery({
    queryKey: ["shipping"],
    queryFn: () => FetchUserCartShippingData(),
    enabled: false,
  });
  useEffect(() => {
    if(Shipping.choice){
    refetch()
  }
  }, [Shipping]);
  useEffect(() => {
    if (shippingDataIsError) {
      console.log(shippingDataError);
    }
    if (shippingDataResponse) {
      console.log(shippingDataResponse);
    }
  }, [shippingDataIsError, shippingDataResponse]);
  return (
    <>
      {findCartIsPending ? (
        <div className="relative flex flex-col bg-white">
          <Skeleton className="h-[120px] w-full rounded-lg mb-3" />
          <Skeleton className="h-[20px] w-[160px] bg-gray-200 mb-1 rounded-lg" />
          <Skeleton className="h-[20px] w-full bg-gray-200 mb-2 rounded-lg" />
          <Skeleton className="h-[40px] w-full bg-gray-200 mb-3 rounded-lg" />
          <Skeleton className="h-[20px] w-[200px] bg-gray-200 mb-1 rounded-lg" />
          <Skeleton className="h-[20px] w-[100px] bg-gray-200 rounded-lg" />
        </div>
      ) : userCartWithDiscount !== null ? (
        <div className="flex flex-col gap-2 w-full">
          <section>
            {!cart &&
              userCartWithDiscount.items.map((product: any, ind: number) => {
                return <CartCard key={ind} product={product} />;
              })}
          </section>
          <Separator />
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
          <section
            id="subtotal and shipping"
            className="flex flex-col gap-2 my-2"
          >
            <span className="inline-flex items-center justify-between text-[15px]">
              <h1 className="font-medium text-gray-800 ">Discounts applied</h1>
              <h1 className="text-gray-400 ">{format(totalDiscount)}</h1>
            </span>
            <span className="inline-flex items-center justify-between text-[15px]">
              <h1 className="font-medium text-gray-800">Shipping</h1>
              <span className="text-gray-400 text-[14px]">
                {Shipping.choice ? "Calculating..." : "calculated at checkout"}
              </span>
            </span>
            <span className="inline-flex items-center justify-between text-[15px]">
              <h1 className="font-medium text-gray-800">Subtotal</h1>
              <span className="text-gray-400 ">
                {" "}
                {format(userCartWithDiscount!?.totalAmount)}
              </span>
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
                {format(userCartWithDiscount!?.totalAmount)}
              </p>
            </span>
          </section>

          {cart && (
            <>
              {" "}
              <Separator />
              <Button disabled={uploadCartIsPending} onClick={uploadCartSubmit}>
                {uploadCartIsPending ? (
                  <ClipLoader size={20} color="white" />
                ) : (
                  "Checkout"
                )}
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="relative flex flex-col bg-white">
          <Skeleton className="h-[120px] w-full rounded-lg mb-3" />
          <Skeleton className="h-[20px] w-[160px] bg-gray-200 mb-1 rounded-lg" />
          <Skeleton className="h-[20px] w-full bg-gray-200 mb-2 rounded-lg" />
          <Skeleton className="h-[40px] w-full bg-gray-200 mb-3 rounded-lg" />
          <Skeleton className="h-[20px] w-[200px] bg-gray-200 mb-1 rounded-lg" />
          <Skeleton className="h-[20px] w-[100px] bg-gray-200 rounded-lg" />
        </div>
      )}
    </>
  );
};

export default CheckoutCard;
