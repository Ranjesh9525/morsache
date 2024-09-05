"use client"
import { OrderReviewData } from "@/@types/order";
import { OptimizedProduct } from "@/@types/products";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { FetchOrderByOrderNo } from "@/serverlessActions/_cartActions";
import { format, formatDate } from "@/utilities/global";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

const sample = {
  _id: "66c6ac500648f244825ea837",
  orderNumber: "d606cee574b49c26d5934896",
  customer: "66bcbe6770fcbe0f1e539a36",
  items: [
    {
      productId: "66b8bbde503976c2e7b0c836",
      offersData: [
        {
          code: "",
          productId: "66b8bbde503976c2e7b0c836",
          quantity: "1",
          _id: "66c6a9dc0648f244825ea65a",
        },
      ],
      quantity: "1",
      size: "sm",
      variant: "evce cve",
      totalPrice: "30000",
      _id: "66c6a9dc0648f244825ea659",
    },
  ],
  totalItems: "1",
  totalAmount: "30000",
  orderStatus: "pending",
  shippingAddress: {
    street: "mairman stresst",
    city: "mauripol",
    state: "bangalore",
    postalCode: "2389284",
    country: "india",
  },
  paymentMethod: { type: "payOnDelivery" },
  paymentStatus: "pending",
  createdAt: "1724296272693",
  updatedAt: "1724296272693",
  __v: "0",
};

// Sample OptimizedProduct objects based on the type definition
const sampleProduct1: OptimizedProduct = {
  _id: "66b8bbde503976c2e7b0c836",
  name: "Sample Product 1",
  slug: "Sample-Product-1",
  price: 100,
  images: [
    "https://picsum.photos/800/1200?random=8",
    "https://picsum.photos/800/1200?random=7",
  ],
  SKU: "SKU123",
  salePrice: 80,
};

const sampleProduct2: OptimizedProduct = {
  _id: "66c6a9dc0648f244825ea659",
  name: "Sample Product 2",
  slug: "Sample-Product-2",
  price: 50,
  images: [
    "https://picsum.photos/800/1200?random=1",
    "https://picsum.photos/800/1200?random=2",
  ],
  SKU: "SKU456",
  salePrice: null,
};

const sampleProduct3: OptimizedProduct = {
  _id: "66c6a9dc0648f244825ea65a",
  name: "Sample Product 3",
  slug: "Sample-Product-3",
  price: 75,
  images: [
    "https://picsum.photos/800/1200?random=3",
    "https://picsum.photos/800/1200?random=4",
  ],
  SKU: "SKU789",
  salePrice: 60,
};

const sampleProduct4: OptimizedProduct = {
  _id: "66c6ac500648f244825ea837",
  name: "Sample Product 4",
  slug: "Sample-Product-4",
  price: 120,
  images: [
    "https://picsum.photos/800/1200?random=5",
    "https://picsum.photos/800/1200?random=6",
  ],
  SKU: "SKU101",
  salePrice: 100,
};

const returnData: OrderReviewData = {
  products: [
    {
      product: sampleProduct1,
      quantity: 1,
      size: "sm",
      variant: "evce cve",
      totalPrice: 30000,
    },
    {
      product: sampleProduct2,
      quantity: 1,
      size: "md",
      variant: "xyz",
      totalPrice: 25000,
    },
    {
      product: sampleProduct3,
      quantity: 2,
      size: "lg",
      variant: "abc",
      totalPrice: 150000,
    },
    {
      product: sampleProduct4,
      quantity: 3,
      size: "xl",
      variant: "def",
      totalPrice: 450000,
    },
  ],
  paymentDetails: {
    totalAmount: 100000,
    paidOn: new Date(),
    paymentMethod: {
      type: "payOnDelivery",
    },
    paymentStatus: "pending",
  },

  orderDetails: {
    totalAmount: 100000,
    createdAt: new Date(),
    totalItems: 7,
    orderStatus: "pending",
    orderNumber: "786r7ftfuygv68e57",
  },
  customerDetails: {
    shippingAddress: "mairman stresst, mauripol, bangalore, india. 2389284",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phoneNumber: "1234567890",
  },
};
type Props = {
  orderNo:string
};
const OrderReviewCard = ({orderNo}: Props) => {
  const [order, setOrder] = useState<OrderReviewData | null>(returnData);
  const {
    isSuccess,
    isPending,
    mutate: server_fetchOrderById,
  } = useMutation({
    mutationFn: FetchOrderByOrderNo,
    onSuccess(response) {
     console.log(response)
      setOrder(response.data);
    },
    onError(error) {
      console.log(error)
      toast({
        variant: "destructive",
        title: "Error",
        description: <p>{error?.message}</p>,
      });
    },
  });
  useEffect(() => {
    server_fetchOrderById(orderNo)
  },[])

  //fetch products FetchSingleProductByIdOptimized
  //fetch customer details from server
  //payment details comes from server
  //validate it is the customer viewin this page
  //fetch random recommendations

  return (
    <div>
      {isPending ? (
       <div className="flex justify-center items-center h-[50%]"> <ClipLoader size={30} /></div>
      ) : order ? (
        <div className="max-w-[80vw] w-full">
          <section id="products" className="rounded-t-md">
            <section className="bg-primary-dark p-3 rounded-t-md">
              <h1 className="font-medium text-lg text-white">Products</h1>
            </section>
            {order?.products?.map((item, index) => {
              return (
                <div
                  key={index}
                  id="item-container"
                  className="border p-3 w-full flex lg:flex-row sm:flex-col  gap-4"
                >
                  <div className="w-full align-middle ">
                    <h1 className="text-[17px] font-semibold w-full">
                      {item?.product?.name}
                    </h1>
                    <div className="flex flex-row gap-4 w-full items-center p-4">
                      <Image
                        src={item?.product?.images[0]}
                        alt=""
                        width={80}
                        height={80}
                        className="  object-contain"
                      />
                      <section>
                        <p className="text-[14px] text-grey-500">
                          SKU:{item?.product?.SKU}
                        </p>

                        <span className="flex flex-col gap-1 text-[14px] mt-2">
                          {item?.variant && <p>Variant: {item?.variant}</p>}
                          <Link
                            href={`/products/${item?.product?.slug}`}
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
                      <p className="font-medium text-[14px] uppercase">SIZE</p>
                      <p className="text-[#545454]">{item?.size}</p>
                    </section>
                    <section className="flex flex-col items-center gap-2">
                      <p className="font-medium text-[14px] uppercase">PRICE</p>
                      <p className="text-[#545454]">
                        {format(
                          parseFloat(
                            item?.product?.salePrice || item?.product?.price
                          )
                        )}
                      </p>
                    </section>
                    <section>
                      <p className="font-medium text-[14px] uppercase">
                        QUANTITY
                      </p>
                      <section className="flex gap-2 items-center  w-full">
                        <p className="  mx-auto">{item.quantity}</p>
                      </section>
                    </section>
                    <section className="flex flex-col items-center gap-2">
                      <p className="font-medium text-[14px] uppercase">TOTAL</p>
                      <p className="text-[#545454]">
                        {format(item?.totalPrice)}
                      </p>
                    </section>
                  </div>
                </div>
              );
            })}
          </section>
          <section id="order_details">
            <section className="bg-primary-dark p-4">
              <h1 className="font-medium text-lg text-white">Details</h1>
            </section>
            <section className="grid border-x px-4">
              <span className="grid grid-cols-2 border-b py-5 px-4">
                <span>
                  <p className="font-semibold text-black">Total items:</p>
                  <h1>
                    {order?.orderDetails?.totalItems}
                    {order?.orderDetails?.totalItems! > 1
                      ? " items"
                      : " item"}{" "}
                  </h1>
                </span>
                <span>
                  <p className="font-semibold text-black">Total amount:</p>
                  <h1>{format(order?.orderDetails?.totalAmount!)} </h1>
                </span>
              </span>
              <span className="w-full border-b py-5 px-2 text-grey-400">
                <p className="font-semibold text-black">Order number:</p>
                {order?.orderDetails?.orderNumber}
              </span>
              <span className="w-full border-b py-4 px-2">
                <p className="font-semibold text-black">Order status:</p>
                {order?.orderDetails?.orderStatus}
              </span>
              <span className="border-b py-4 px-2">
                <p className="font-semibold text-black">Order placed on:</p>
                {formatDate(order?.orderDetails?.createdAt!)}
              </span>
            </section>
          </section>
          <section id="payment_details">
            <section className="bg-primary-dark p-4">
              <h1 className="font-medium text-lg text-white">
                Payment Details
              </h1>
            </section>
            <section className="grid grid-cols-2 border-x px-4">
              <span className="grid grid-cols-2 border-b py-5 px-2">
                <span>
                  <p className="font-semibold text-black">Amount Paid:</p>
                  <h1>{format(order?.paymentDetails?.totalAmount!)}</h1>
                </span>
                {/* <span><p className="font-semibold text-black">:</p><h1>{format(order?.orderDetails?.totalAmount!)} </h1></span>  */}
              </span>
              <span className="w-full border-b py-5 px-2  text-grey-400">
                <p className="font-semibold text-black mr-2">Paid:</p>
                {order?.paymentDetails?.paidOn
                  ? formatDate(order?.paymentDetails?.paidOn)
                  : "Not Paid"}
              </span>
              <span className="w-full border-b py-4 px-2">
                <p className="font-semibold text-black">Payment method:</p>
                {order?.paymentDetails?.paymentMethod.type === "payOnDelivery" ? "Pay on delivery" : order?.paymentDetails?.paymentMethod.type === "stripe" ? "Stripe" : "Razorpay"}
              </span>
              <span className="border-b py-4 px-2 ">
                <p className="font-semibold text-black mr-2">Payment Status: </p>
                { order?.paymentDetails?.paymentStatus}
              </span>
            </section>
          </section>
          <section id="customer_details " className="border-b">
          <section className="bg-primary-dark p-4">
              <h1 className="font-medium text-lg text-white">
                Customer Details
              </h1>
            </section>
            <section className="grid grid-cols-2 border-x px-4">
              <span className="grid grid-cols-2 border-b py-5 px-2">
                <span>
                  <p className="font-semibold text-black">First name:</p>
                  <h1>{order?.customerDetails?.firstName}</h1>
                </span>
                {/* <span><p className="font-semibold text-black">:</p><h1>{format(order?.orderDetails?.totalAmount!)} </h1></span>  */}
              </span>
              <span className="w-full border-b py-5 px-2  text-grey-400">
                <p className="font-semibold text-black mr-2">Last name:</p>
                {order?.customerDetails?.lastName}
              </span>
              <span className="w-full border-b py-4 px-2">
                <p className="font-semibold text-black">Phone number:</p>
                {order?.customerDetails?.phoneNumber}
              </span>
              <span className="border-b py-4 px-2 ">
                <p className="font-semibold text-black mr-2">Email:</p>
                { order?.customerDetails?.email}
              </span>
              <span className="border-b py-4 px-2 ">
                <p className="font-semibold text-black mr-2">Address:</p>
                { order?.customerDetails?.shippingAddress}
              </span>
            </section>
          </section>
          <section id="recommendations"></section>
        </div>
      ): <p>Nothing to display here,<br /> either an error occured or order has been deleted</p>}
    </div>
  );
};

export default OrderReviewCard;

