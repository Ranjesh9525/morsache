"use client";
import { Order, OrderReviewData } from "@/@types/order";
import { OptimizedProduct } from "@/@types/products";
import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format as formatDateFns } from "date-fns";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import {
  AdminDeleteOrder,
  AdminGetOrderById,
} from "@/serverlessActions/_adminActions";
// import {format as formatDateFns} from "date-fns";
import { FetchOrderByOrderNo } from "@/serverlessActions/_cartActions";
import { format, formatDate } from "@/utilities/global";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CalendarIcon, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ClipLoader } from "react-spinners";
import { z } from "zod";
import { Separator } from "@/components/ui/separator";
import OrderEditCard from "./OrderEditCard";
import ConfirmationDialog from "@/components/general/ConfirmationDialog";

type Props = {
  orderId: string;
};
const OrderReviewCard = ({ orderId }: Props) => {
  const router = useRouter();
  const [openDialog, setOpenDialog] = React.useState(false);
  const [orderReview, setOrderReview] = useState<OrderReviewData | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [refetch, setRefetch] = useState<boolean>(false);
  const {
    isSuccess,
    isPending,

    mutate: server_fetchOrderById,
  } = useMutation({
    mutationFn: AdminGetOrderById,
    onSuccess: (response) => {
      console.log(response);
      if(response?.success == false && response?.data?.error){
        toast({
          variant: "destructive",
          title: "An error occured",
          description: <p>{response?.data?.error?.message}</p>,
        });
      }else{
        setOrderReview(response.data.orderReview);
      setOrder(response.data.order);}
    },
   
  });
  const {
    isSuccess: Deleted,
    isPending: isDeleting,
    mutate: server_AdminDeleteOrder,
  } = useMutation({
    mutationFn: AdminDeleteOrder,
    mutationKey: ["delete"],
    onSuccess: (response) => {
      if(response?.success == false && response?.data?.error){
        toast({
          variant: "destructive",
          title: "An Error occured",
          description: <p>{response?.data?.error?.message}</p>,
        });
      }else{
      toast({
        variant: "success",
        title: "Order deleted",
      });
      setOpenDialog(false);
      router.back();}
    },
 
  });
  useEffect(() => {
    server_fetchOrderById(orderId.toString());
  }, [refetch]);

  return (
    <div>
      <ConfirmationDialog
        dialogTitle="Are you sure you want to delete this Order?"
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        onClick={() => {
          server_AdminDeleteOrder(orderId.toString());
        }}
        loading={isDeleting}
      />
      {isPending ? (
        <div className="flex justify-center items-center h-[50%]">
          {" "}
          <ClipLoader size={30} />
        </div>
      ) : orderReview && order ? (
        <>
          <div className="flex items-center justify-end w-full mb-4">
            <Button onClick={() => setOpenDialog(true)} variant="destructive">
              Delete
            </Button>
          </div>

          <div className="px-9 w-full">
            <section id="products" className="rounded-t-md">
              <section className="bg-primary-dark p-3 rounded-t-md">
                <h1 className="font-medium text-lg text-white">Products</h1>
              </section>
              {orderReview?.products?.map((item, index) => {
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
                        <p className="font-medium text-[14px] uppercase">
                          SIZE
                        </p>
                        <p className="text-[#545454]">{item?.size}</p>
                      </section>
                      <section className="flex flex-col items-center gap-2">
                        <p className="font-medium text-[14px] uppercase">
                          PRICE
                        </p>
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
                        <p className="font-medium text-[14px] uppercase">
                          TOTAL
                        </p>
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
                      {orderReview?.orderDetails?.totalItems}
                      {orderReview?.orderDetails?.totalItems! > 1
                        ? " items"
                        : " item"}{" "}
                    </h1>
                  </span>
                  <span>
                    <p className="font-semibold text-black">Total amount:</p>
                    <h1>{format(orderReview?.orderDetails?.totalAmount!)} </h1>
                  </span>
                </span>
                <span className="w-full border-b py-5 px-2 text-grey-400">
                  <p className="font-semibold text-black">Order number:</p>
                  {orderReview?.orderDetails?.orderNumber}
                </span>
                <span className="w-full border-b py-4 px-2">
                  <p className="font-semibold text-black">
                    {" "}
                    {orderReview?.orderDetails?.collectionMethod === "delivery"
                      ? "Expected delivery date"
                      : "Expected pickup date"}
                  </p>
                  {orderReview?.orderDetails?.expectedDeliveryOrPickupDate1 ? (
                    <p>
                      {formatDateFns(
                        orderReview?.orderDetails
                          ?.expectedDeliveryOrPickupDate1,
                        "PPP"
                      ) +
                        " and " +
                        formatDateFns(
                          orderReview?.orderDetails
                            ?.expectedDeliveryOrPickupDate2!,
                          "PPP"
                        )}
                    </p>
                  ) : (
                    "Would be set after order is confirmed"
                  )}
                </span>

                <span className="w-full border-b py-4 px-2">
                  <p className="font-semibold text-black">Order status:</p>
                  {orderReview?.orderDetails?.orderStatus}
                </span>
                <span className="w-full border-b py-4 px-2">
                  <p className="font-semibold text-black">Collection Method</p>
                  {orderReview?.orderDetails?.collectionMethod}
                </span>
                <span className="border-b py-4 px-2">
                  <p className="font-semibold text-black">Order placed on:</p>
                  {formatDate(orderReview?.orderDetails?.createdAt!)}
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
                    <h1>{format(orderReview?.paymentDetails?.totalAmount!)}</h1>
                  </span>
                  {/* <span><p className="font-semibold text-black">:</p><h1>{format(orderReview?.orderDetails?.totalAmount!)} </h1></span>  */}
                </span>
                <span className="w-full border-b py-5 px-2  text-grey-400">
                  <p className="font-semibold text-black mr-2">Paid:</p>
                  {orderReview?.paymentDetails?.paidOn
                    ? formatDate(orderReview?.paymentDetails?.paidOn)
                    : "Not Paid"}
                </span>
                <span className="w-full border-b py-4 px-2">
                  <p className="font-semibold text-black">Payment method:</p>
                  {orderReview?.paymentDetails?.paymentMethod.type ===
                  "payOnDelivery"
                    ? orderReview?.orderDetails.collectionMethod !== "pickup"
                      ? "Pay on delivery"
                      : "Pay on collection"
                    : orderReview?.paymentDetails?.paymentMethod.type ===
                      "stripe"
                    ? "Stripe"
                    : "Razorpay"}
                </span>
                <span className="border-b py-4 px-2 ">
                  <p className="font-semibold text-black mr-2">
                    Payment Status:{" "}
                  </p>
                  {orderReview?.paymentDetails?.paymentStatus}
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
                    <h1>{orderReview?.customerDetails?.firstName}</h1>
                  </span>
                  {/* <span><p className="font-semibold text-black">:</p><h1>{format(orderReview?.orderDetails?.totalAmount!)} </h1></span>  */}
                </span>
                <span className="w-full border-b py-5 px-2  text-grey-400">
                  <p className="font-semibold text-black mr-2">Last name:</p>
                  {orderReview?.customerDetails?.lastName}
                </span>
                <span className="w-full border-b py-4 px-2">
                  <p className="font-semibold text-black">Phone number:</p>
                  {orderReview?.customerDetails?.phoneNumber}
                </span>
                <span className="border-b py-4 px-2 ">
                  <p className="font-semibold text-black mr-2">Email:</p>
                  {orderReview?.customerDetails?.email}
                </span>
                {orderReview?.orderDetails.collectionMethod !== "pickup" && (
                  <span className="border-b py-4 px-2 ">
                    <p className="font-semibold text-black mr-2">Address:</p>
                    {orderReview?.customerDetails?.shippingAddress}
                  </span>
                )}
              </section>
            </section>
          </div>
          <Separator className="mt-10" />
          <OrderEditCard
            order={order}
            refetch={refetch}
            setRefetch={setRefetch}
          />
        </>
      ) : (
        <p className="text-center">
          Nothing to display here,
          <br />
          Are you sure youre connected to internet ?
          <br /> If you are then either an error occured or order has been
          deleted
        </p>
      )}
    </div>
  );
};

export default OrderReviewCard;
