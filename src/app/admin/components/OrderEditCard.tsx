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
  AdminEditOrder,
  AdminGetOrderById,
} from "@/serverlessActions/_adminActions";
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
import ConfirmationDialog from "@/components/general/ConfirmationDialog";

type Props = {
  order: Order | null;
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: boolean;
};

const OrderEditCard = ({ order, refetch, setRefetch }: Props) => {
  const [openDialog, setOpenDialog] = React.useState(false);
  const {
    isSuccess: Updated,
    isPending: isUpdating,
    mutate: server_AdminUpdateOrder,
  } = useMutation({
    mutationFn: AdminEditOrder,
    onSuccess: (response) => {
      setRefetch(!refetch);
      toast({
        variant: "success",
        title: "Order Updated",
      });
      setOpenDialog(false);
    },
    onError: (error) => {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: <p>{error?.message}</p>,
      });
    },
  });
  const OrderSchema = z.object({
    orderNumber: z.string(),
    customer: z.string(),
    totalItems: z.union([z.number(), z.string()]),
    totalAmount: z.union([z.number(), z.string()]),
    orderStatus: z.union([
      z.literal("pending"),
      z.literal("confirmed"),
      z.literal("shipped"),
      z.literal("delivered"),
      z.literal("cancelled"),
      z.literal("ready"),
      z.literal("collected"),
    ]),
    shippingAddress: z.object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      postalCode: z.string(),
      country: z.string(),
    }),
    shippingPrice: z.union([z.number(), z.string()]).optional(),
    paymentMethod: z.object({
      type: z.union([
        z.literal("creditCard"),
        z.literal("razorPay"),
        z.literal("stripe"),
        z.literal("payOnDelivery"),
      ]),
    }),
    expectedDeliveryOrPickupDate1: z.union([z.date(), z.string()]).optional(),
    expectedDeliveryOrPickupDate2: z.union([z.date(), z.string()]).optional(),
    paymentStatus: z.union([z.literal("pending"), z.literal("paid")]),
    collectionMethod: z.union([z.literal("delivery"), z.literal("pickup")]),
    paidOn: z.union([z.date(), z.string()]).nullable().optional(),
  });

  const form = useForm<z.infer<typeof OrderSchema>>({
    resolver: zodResolver(OrderSchema),
    defaultValues: {
      orderNumber: order?.orderNumber || "",
      customer: order?.customer.toString(),
      totalItems: order?.totalItems || 0,
      totalAmount: order?.totalAmount || 0,
      orderStatus: order?.orderStatus || "pending",
      shippingAddress: {
        street: order?.shippingAddress.street || "",
        city: order?.shippingAddress.city || "",
        state: order?.shippingAddress.state || "",
        postalCode: order?.shippingAddress.postalCode || "",
        country: order?.shippingAddress.country || "",
      },
      shippingPrice: order?.shippingPrice || undefined,
      paymentMethod: {
        type: order?.paymentMethod.type || "payOnDelivery",
      },
      expectedDeliveryOrPickupDate1: order?.expectedDeliveryOrPickupDate1,
      expectedDeliveryOrPickupDate2: order?.expectedDeliveryOrPickupDate2,
      collectionMethod: order?.collectionMethod || "delivery",
      paymentStatus: order?.paymentStatus || "pending",
      paidOn: order?.paidOn || null,
    },
  });

  async function onSubmit(data: z.infer<typeof OrderSchema>) {
    console.log(data);
    setOpenDialog(true);
  }
  return (
    <>
      <ConfirmationDialog
        dialogTitle="Confirm Order Changes"
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        onClick={() => {
          server_AdminUpdateOrder({
            orderId: order?._id,
            updatedOrderData: form.getValues(),
          });
        }}
        notDangerous
        onClickBtnTitle={"Save changes"}
        loading={isUpdating}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="my-12 px-9">
          <h1 className="mb-4 text-2xl font-semibold">Edit Order Data</h1>
          <div className="w-full grid grid-cols-2 gap-4 items-start">
            <FormField
              control={form.control}
              name="orderNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="check user id in users page"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-red-600">
                    Changing the order number is not recommended!
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Id</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="check user id in users page"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Changing the customer id will set this order for another
                    user
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="totalAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total amount</FormLabel>
                  <FormControl>
                    <Input placeholder="0" {...field} />
                  </FormControl>
                  <FormDescription>
                    Total amount of the order ,changing this will completely
                    ulter the money to be paid for this order if its not already
                    paid
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="totalItems"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Items</FormLabel>
                  <FormControl>
                    <Input placeholder="0" {...field} />
                  </FormControl>
                  <FormDescription>
                    Total items the order have, changing this will not
                    recalulate the price
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shippingPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shipping Price</FormLabel>
                  <FormControl>
                    <Input placeholder="0" {...field} />
                  </FormControl>
                  <FormDescription>
                    Changing the shipping price will affect how much the user
                    pays for shipping
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paidOn"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Paid on</FormLabel>

                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            " pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field?.value ? (
                            formatDateFns(field?.value, "PPP")
                          ) : (
                            <span>No date, not yet paid</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value as Date}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    This is the date the user paid for this order
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shippingAddress.street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shipping City</FormLabel>
                  <FormControl>
                    <Input placeholder="street" {...field} />
                  </FormControl>
                  <FormDescription>Write only the city name</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shippingAddress.city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shipping City</FormLabel>
                  <FormControl>
                    <Input placeholder="city" {...field} />
                  </FormControl>
                  <FormDescription>Write only the city name</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shippingAddress.state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shipping state</FormLabel>
                  <FormControl>
                    <Input placeholder="state" {...field} />
                  </FormControl>
                  <FormDescription>write only the state name</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shippingAddress.country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shipping Country</FormLabel>
                  <FormControl>
                    <Input placeholder="country" {...field} />
                  </FormControl>
                  <FormDescription>Write only the country name</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shippingAddress.postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shipping Postal code</FormLabel>
                  <FormControl>
                    <Input placeholder="Postal code" {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="orderStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the order status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="ready">Ready</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="collected">Collected</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-red-500">
                    WARNING!: review delivery address before confirming order
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="collectionMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Collection method</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Set the method of collection" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="delivery">Delivery</SelectItem>
                      <SelectItem value="pickup">Pick up</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription className="">
                    Changing this will alter the order in &quot;to be
                    delivered&quot; page
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paymentStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Set the payment status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription className="">
                    Changing this will alter the order in &quot;to be
                    delivered&quot; page
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paymentMethod.type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment method type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Set the method of payment" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="razorPay">Razor pay</SelectItem>
                      <SelectItem value="payOnDelivery">
                        Pay on delivery
                      </SelectItem>
                      <SelectItem value="stripe">Stripe</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription className=""></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expectedDeliveryOrPickupDate1"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    Minimum expected delivery or pickup date
                  </FormLabel>

                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            " pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field?.value ? (
                            formatDateFns(field?.value!, "PPP")
                          ) : (
                            <span>No date selected</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value as Date}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    if no date manually selected default is 7 days after
                    confirmation
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expectedDeliveryOrPickupDate2"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    Maximum expected delivery or pickup date
                  </FormLabel>

                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            " pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field?.value ? (
                            formatDateFns(field?.value!, "PPP")
                          ) : (
                            <span>No date selected</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value as Date}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    if no date is selected maximum is 12 days after confirmation
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2 mx-auto my-4 w-fit">
            <Button
              disabled={isUpdating}
              type="submit"
              className="w-full max-w-[400px] text-center py-5 h-none"
            >
              {form.formState.isSubmitting || isUpdating ? (
                <ClipLoader size={22} color="white" />
              ) : (
                "update order"
              )}
            </Button>
            <p className="text-[12.5px] capitalize text-center">
              Ensure youve selected correct values, this is a permanent change,
              no backup
            </p>
          </div>
        </form>
      </Form>
    </>
  );
};

export default OrderEditCard;
