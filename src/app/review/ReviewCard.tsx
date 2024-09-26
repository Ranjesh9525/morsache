"use client";
import { OrderReviewData } from "@/@types/order";
import { OptimizedProduct } from "@/@types/products";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { FetchOrderByOrderNo } from "@/serverlessActions/_cartActions";
import { formatDate, format } from "@/utilities/global";
import { format as formatDateFns } from "date-fns";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

type Props = {
  orderNo: string;
};
const ReviewCard = ({ orderNo }: Props) => {
  const router = useRouter();

  const [order, setOrder] = useState<OrderReviewData | null>(null);
  const {
    isSuccess,
    error,
    isPending,
    mutate: server_fetchOrderById,
  } = useMutation({
    mutationFn: FetchOrderByOrderNo,
    onSuccess(response) {
      //  console.log(response)
      if(response.success == false ){
setOrder(null)
      }else{
     setOrder(response.data);
    }
    },
   
  });
  useEffect(() => {
    server_fetchOrderById(orderNo);
  }, []);

  if (!orderNo) {
    router.push("/cart");
  }
  return (
    <div>
      {isPending ? (
        <p className="text-center">
          <ClipLoader />
        </p>
      ) : order ? (
        <div className="md:max-w-[80vw] w-full">
          <section id="products" className="rounded-t-md">
            <section className="bg-primary-dark p-3 rounded-t-md">
              <h1 className="font-medium text-lg text-white">Products</h1>
            </section>
            {order?.products.map((item, index) => {
              return (
                <div
                  key={index}
                  id="item-container"
                  className="border p-3 w-full flex lg:flex-row flex-col py-4 md:py-3 gap-4"
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
                <p className="font-semibold text-black">
                  {" "}
                  {order?.orderDetails?.collectionMethod === "delivery"
                    ? "Expected delivery date"
                    : "Expected pickup date"}
                </p>
                {order?.orderDetails?.expectedDeliveryOrPickupDate1 ? (
                  <p>
                    {"Between" +
                      " " +
                      (formatDateFns(
                        order?.orderDetails?.expectedDeliveryOrPickupDate1,
                        "PPP"
                      ) +
                        " and " +
                        formatDateFns(
                          order?.orderDetails?.expectedDeliveryOrPickupDate2!,
                          "PPP"
                        ))}
                  </p>
                ) : (
                  "Would be set after order is confirmed"
                )}
              </span>

              <span className="w-full border-b py-4 px-2">
                <p className="font-semibold text-black">Order status:</p>
                {order?.orderDetails?.orderStatus}
              </span>
              <span className="w-full border-b py-4 px-2">
                <p className="font-semibold text-black">Collection Method</p>
                {order?.orderDetails?.collectionMethod}
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
            <section className="grid md:grid-cols-2 border-x px-4">
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
                {order?.paymentDetails?.paymentMethod.type === "payOnDelivery"
                  ? order?.orderDetails.collectionMethod === "pickup"
                    ? "Pay on collection"
                    : "Pay on delivery"
                  : order?.paymentDetails?.paymentMethod.type === "stripe"
                  ? "Stripe"
                  : "Razorpay"}
              </span>
              <span className="border-b py-4 px-2 ">
                <p className="font-semibold text-black mr-2">
                  Payment Status:{" "}
                </p>
                {order?.paymentDetails?.paymentStatus}
              </span>
            </section>
          </section>
          <section id="customer_details " className="border-b">
            <section className="bg-primary-dark p-4">
              <h1 className="font-medium text-lg text-white">
                Customer Details
              </h1>
            </section>
            <section className="grid md:grid-cols-2 border-x px-4">
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
                {order?.customerDetails?.email}
              </span>
              {order?.orderDetails.collectionMethod !== "pickup" && (
                <span className="border-b py-4 px-2 ">
                  <p className="font-semibold text-black mr-2">Address:</p>
                  {order?.customerDetails?.shippingAddress}
                </span>
              )}
            </section>
          </section>
          <section id="recommendations"></section>
        </div>
      ) : (
        <p className="text-center font-semibold mt-3 text-xl">
          Nothing to display here
          <br />{" "}
          {error ? (
            <p className="capitalize font-light text-center text-[14px]">
              {" "}
              {error?.message}
            </p>
          ) : (
            <p className="font-light text-center ">
              This order was not found. Either it has been deleted or removed by
              admin
            </p>
          )}
        </p>
      )}
    </div>
  );
};

export default ReviewCard;
