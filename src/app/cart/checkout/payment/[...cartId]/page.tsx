"use client";
import CheckoutLayout from "@/components/layouts/CheckoutLayout";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import CheckoutCard from "@/app/cart/components/CheckoutCard";
import PrevAndNextBtn from "@/app/cart/components/PrevAndNextBtn";

type Props = {
  params: {
    cartId: string;
  };
};

const Page = (props: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
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
      image: "/your_logo.png",
      order_id,
      handler: async (response: any) => {
        alert(
          `Payment successful! Payment ID: ${response.razorpay_payment_id}`
        );
        //bro add post payment logic
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
        color: "#61dafb",
      },
    };

    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();
    setIsLoading(false);
  };

  return (
    <CheckoutLayout title="Payment - Morsache Clothing">
      <div style={{ backgroundColor: "red", width: "100px" }}>
        <button onClick={handlePayment} disabled={isLoading}>
          {isLoading ? "Processing..." : "Go to payment page"}
        </button>
      </div>
      <div className="w-full container grid grid-cols-9 mb-9 mt-4 gap-4">
        <div className="col-span-6">
          {/* <ShippingInformation /> */}
          <PrevAndNextBtn
            showNext={false}
            showBack={true}
            prevLink={`/cart/checkout/shipping/${props.params.cartId.toString()}`}
          />
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
