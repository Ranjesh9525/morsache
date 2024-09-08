"use client";
import CheckoutLayout from "@/components/layouts/CheckoutLayout";
import React, { useContext, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import CheckoutCard from "@/app/cart/components/CheckoutCard";
import PrevAndNextBtn from "@/app/cart/components/PrevAndNextBtn";
import Image from "next/image";
import { IoCardOutline } from "react-icons/io5";
import {
  FetchUserCartShippingData,
  InitializeOrder,
} from "@/serverlessActions/_cartActions";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { CartContext } from "@/context/cartContext";
import { ClipLoader } from "react-spinners";
import { GlobalContext } from "@/context/globalContext";
import { ShippingContext } from "@/context/shippingContext";

type Props = {
  params: {
    cartId: string;
  };
};

const Page = (props: Props) => {
  const { cart, dispatch } = useContext(CartContext)!;
  const { Shipping, dispatch: shippingDispatch } = useContext(ShippingContext)!;
  const { userData, userDataLoading } = useContext(GlobalContext)!;
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const {
    isPending,
    isSuccess,
    data,
    error,
    isError,
    mutate: server_InitializeOrder,
  } = useMutation({
    mutationFn: InitializeOrder,
  });
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorPay = async () => {
    const DefaultShippingData = await FetchUserCartShippingData();
    setIsLoading(true);
    const res = await loadRazorpayScript();

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      setIsLoading(false);
      return;
    }
    // console.log(cart);

    // Call your API to create an order
    const result = await fetch("/api/razorpay", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount:
          cart.totalAmount +
          (Shipping.choice === "delivery"
            ? parseInt(
                cart?.shippingPrice! || DefaultShippingData?.data?.price || "0"
              )
            : 0),
        currency: "INR",
      }),
    });

    const order = await result.json();

    const {
      id: order_id,
      currency: order_currency,
      amount: order_amount,
    } = order;
    const options = {
      key: process.env.RAZORPAY_KEY_ID,
      amount: order_amount.toString(),
      currency: order_currency,
      name: "Morsache Clothing",
      description: "Order Payment",
      image: "/morsache-clothing-logo.png",
      order_id,
      handler: async (response: any) => {
        toast({
          title: `Payment successful!`,
          description: <p>{`Payment ID: ${response.razorpay_payment_id}`}</p>,
        });
        // add post payment logic
        server_InitializeOrder({ paymentMethod: "razorPay", order });
      },
      prefill: {
        name:
          userData?.firstName && userData?.lastName
            ? userData?.firstName + " " + userData?.lastName
            : userData?.firstName || "test user",
        email: userData?.email || "testuser@example.com",
        contact: userData?.phoneNumber || "9999999999",
      },
      notes: {
        address: "Morsache Clothing HQ",
      },
      theme: {
        color: "#545454",
      },
    };

    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();
    setIsLoading(false);
  };

  const handlePayOnDelivery = () => {
    if (!isPending) {
      server_InitializeOrder({ paymentMethod: "payOnDelivery", order: null });
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setIsLoading(false);
      toast({
        variant: "default",
        title: "order placed",
        description: "Thanks for shopping with us!",
      });
      router.push(`/review/${data?.data}`);
      dispatch({ type: "CLEAR_CART" });
      shippingDispatch({
        type: "CLEAR_CHOICE",
        payload: "pickup",
      });
    }
    if (isError) {
      toast({
        variant: "destructive",
        title: "Couldn't place order",
        description: error.message,
      });
    }
  }, [isSuccess, isLoading, isError]);

  return (
    <CheckoutLayout title="Payment - Morsache Clothing">
      <div className="w-full container lg:grid lg:grid-cols-9 flex flex-col-reverse mb-9 mt-4 gap-9">
        <div className="col-span-6 flex flex-col h-full">
          {userDataLoading ? (
            <p className="text-center">
              <ClipLoader />
            </p>
          ) : (
            <div className="flex-1 flex flex-col items-start gap-4">
              <button
                className="md:w-[60%] w-full p-4 py-6 rounded-lg border border-gray-400 flex items-center gap-3 justify-start cursor-pointer"
                onClick={handlePayOnDelivery}
              >
                <IoCardOutline size={30} />
                {isPending ? (
                  <ClipLoader />
                ) : (
                  <>
                    {" "}
                    <p className="font-medium">Pay on delivery</p>
                  </>
                )}
              </button>
              <button
                className="md:w-[60%] w-full p-4 py-6 rounded-lg border border-gray-400 flex items-center gap-3 justify-start cursor-pointer"
                onClick={handleRazorPay}
                disabled={isLoading}
              >
                <Image
                  src="/razorpay.png"
                  alt="razorPay"
                  width={100}
                  height={50}
                />{" "}
                <p className="font-medium">
                  {isLoading ? "Processing..." : "Pay With Razor Pay"}
                </p>
              </button>
              <button
                className="md:w-[60%] w-full p-4 py-6 rounded-lg border border-gray-400 flex items-center gap-3 justify-start cursor-pointer"
                disabled={true}
              >
                <Image
                  src="/stripe.png"
                  alt="razorPay"
                  width={80}
                  height={50}
                />{" "}
                <p className="font-medium">Pay with stripe</p>
              </button>
            </div>
          )}
          <div className="mt-auto">
            <PrevAndNextBtn
              showNext={false}
              showBack={true}
              prevLink={`/cart/checkout/shipping/${props.params.cartId.toString()}`}
            />
          </div>
        </div>
        <div className="col-span-3">
          <div className="sticky top-[34px]">
            <CheckoutCard
              showProducts={true}
              cartId={props.params.cartId.toString()}
            />
          </div>
        </div>
      </div>
    </CheckoutLayout>
  );
};

export default Page;
