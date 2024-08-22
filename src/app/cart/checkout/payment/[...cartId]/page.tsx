"use client";
import CheckoutLayout from "@/components/layouts/CheckoutLayout";
import React, { useContext, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import CheckoutCard from "@/app/cart/components/CheckoutCard";
import PrevAndNextBtn from "@/app/cart/components/PrevAndNextBtn";
import Image from "next/image";
import { IoCardOutline } from "react-icons/io5";
import { InitializeOrder } from "@/serverlessActions/_cartActions";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { CartContext } from "@/context/cartContext";

type Props = {
  params: {
    cartId: string;
  };
};

const Page = (props: Props) => {
  const {cart,dispatch}= useContext(CartContext)!
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
    server_InitializeOrder("razorPay");
    setIsLoading(true);
    const res = await loadRazorpayScript();

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      setIsLoading(false);
      return;
    }

    // Call your API to create an order
    const result = await fetch("/api/razorpay", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: 500, currency: "INR" }),
    });

    const {
      id: order_id,
      currency: order_currency,
      amount: order_amount,
    } = await result.json();

    const options = {
      key: process.env.RAZORPAY_KEY_ID,
      amount: order_amount.toString(),
      currency: order_currency,
      name: "Morsache Clothing",
      description: "Order Payment",
      image: "/morsache-clothing-logo.png",
      order_id,
      handler: async (response: any) => {
        alert(
          `Payment successful! Payment ID: ${response.razorpay_payment_id}`
        );
        // add post payment logic
      },
      prefill: {
        name: "John Doe",
        email: "johndoe@example.com",
        contact: "9999999999",
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
    // add pay on delivery logic
    server_InitializeOrder("payOnDelivery");
  };

  useEffect(() => {
    if (isSuccess) {
      setIsLoading(false);
      toast({
        variant: "default",
        title: "order placed",
        description: "Thanks for shopping with us!",
      });
      dispatch({type:"CLEAR_CART"})
      router.push("/cart/checkout/review");
    }
    if (isError) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: error.message,
      });
    }
  }, [isSuccess, isLoading, isError]);

  return (
    <CheckoutLayout title="Payment - Morsache Clothing">
      <div className="w-full container grid grid-cols-9 mb-9 mt-4 gap-9">
        <div className="col-span-6 flex flex-col h-full">
          <div className="flex-1 flex flex-col items-start gap-4">
            <button
              className="w-[60%] p-4 py-6 rounded-lg border flex items-center gap-3 justify-start cursor-pointer"
              onClick={handlePayOnDelivery}
            >
              <IoCardOutline /> <p className="font-medium">Pay on delivery</p>
            </button>
            <button
              className="w-[60%] p-4 py-6 rounded-lg border flex items-center gap-3 justify-start cursor-pointer"
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
              className="w-[60%] p-4 py-6 rounded-lg border flex items-center gap-3 justify-start cursor-pointer"
              disabled={true}
            >
              <Image src="/stripe.png" alt="razorPay" width={80} height={50} />{" "}
              <p className="font-medium">Pay with stripe</p>
            </button>
          </div>
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
            <CheckoutCard cartId={props.params.cartId.toString()} />
          </div>
        </div>
      </div>
    </CheckoutLayout>
  );
};

export default Page;
