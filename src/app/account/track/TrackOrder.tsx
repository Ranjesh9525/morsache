// "use client"

// import Link from "next/link"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import { z } from "zod"

// import { Button } from "@/components/ui/button"
// import { Checkbox } from "@/components/ui/checkbox"
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Switch } from "@/components/ui/switch"
// import { toast } from "@/components/ui/use-toast"

// const notificationsFormSchema = z.object({
//   type: z.enum(["all", "mentions", "none"], {
//     required_error: "You need to select a notification type.",
//   }),
//   mobile: z.boolean().default(false).optional(),
//   communication_emails: z.boolean().default(false).optional(),
//   social_emails: z.boolean().default(false).optional(),
//   marketing_emails: z.boolean().default(false).optional(),
//   security_emails: z.boolean(),
// })

// type NotificationsFormValues = z.infer<typeof notificationsFormSchema>

// // This can come from your database or API.
// const defaultValues: Partial<NotificationsFormValues> = {
//   communication_emails: false,
//   marketing_emails: false,
//   social_emails: true,
//   security_emails: true,
// }

// export function TrackOrder() {
//   const form = useForm<NotificationsFormValues>({
//     resolver: zodResolver(notificationsFormSchema),
//     defaultValues,
//   })

//   function onSubmit(data: NotificationsFormValues) {
//     toast({
//       title: "You submitted the following values:",
//       description: (
//         <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
//           <code className="text-white">{JSON.stringify(data, null, 2)}</code>
//         </pre>
//       ),
//     })
//   }

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//         <FormField
//           control={form.control}
//           name="type"
//           render={({ field }) => (
//             <FormItem className="space-y-3">
//               <FormLabel>Notify me about...</FormLabel>
//               <FormControl>
//                 <RadioGroup
//                   onValueChange={field.onChange}
//                   defaultValue={field.value}
//                   className="flex flex-col space-y-1"
//                 >
//                   <FormItem className="flex items-center space-x-3 space-y-0">
//                     <FormControl>
//                       <RadioGroupItem value="all" />
//                     </FormControl>
//                     <FormLabel className="font-normal">
//                       All new messages
//                     </FormLabel>
//                   </FormItem>
//                   <FormItem className="flex items-center space-x-3 space-y-0">
//                     <FormControl>
//                       <RadioGroupItem value="mentions" />
//                     </FormControl>
//                     <FormLabel className="font-normal">
//                       Direct messages and mentions
//                     </FormLabel>
//                   </FormItem>
//                   <FormItem className="flex items-center space-x-3 space-y-0">
//                     <FormControl>
//                       <RadioGroupItem value="none" />
//                     </FormControl>
//                     <FormLabel className="font-normal">Nothing</FormLabel>
//                   </FormItem>
//                 </RadioGroup>
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <div>
//           <h3 className="mb-4 text-lg font-medium">Email Notifications</h3>
//           <div className="space-y-4">
//             <FormField
//               control={form.control}
//               name="communication_emails"
//               render={({ field }) => (
//                 <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
//                   <div className="space-y-0.5">
//                     <FormLabel className="text-base">
//                       Communication emails
//                     </FormLabel>
//                     <FormDescription>
//                       Receive emails about your account activity.
//                     </FormDescription>
//                   </div>
//                   <FormControl>
//                     <Switch
//                       checked={field.value}
//                       onCheckedChange={field.onChange}
//                     />
//                   </FormControl>
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="marketing_emails"
//               render={({ field }) => (
//                 <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
//                   <div className="space-y-0.5">
//                     <FormLabel className="text-base">
//                       Marketing emails
//                     </FormLabel>
//                     <FormDescription>
//                       Receive emails about new products, features, and more.
//                     </FormDescription>
//                   </div>
//                   <FormControl>
//                     <Switch
//                       checked={field.value}
//                       onCheckedChange={field.onChange}
//                     />
//                   </FormControl>
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="social_emails"
//               render={({ field }) => (
//                 <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
//                   <div className="space-y-0.5">
//                     <FormLabel className="text-base">Social emails</FormLabel>
//                     <FormDescription>
//                       Receive emails for friend requests, follows, and more.
//                     </FormDescription>
//                   </div>
//                   <FormControl>
//                     <Switch
//                       checked={field.value}
//                       onCheckedChange={field.onChange}
//                     />
//                   </FormControl>
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="security_emails"
//               render={({ field }) => (
//                 <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
//                   <div className="space-y-0.5">
//                     <FormLabel className="text-base">Security emails</FormLabel>
//                     <FormDescription>
//                       Receive emails about your account activity and security.
//                     </FormDescription>
//                   </div>
//                   <FormControl>
//                     <Switch
//                       checked={field.value}
//                       onCheckedChange={field.onChange}
//                       disabled
//                       aria-readonly
//                     />
//                   </FormControl>
//                 </FormItem>
//               )}
//             />
//           </div>
//         </div>
//         <FormField
//           control={form.control}
//           name="mobile"
//           render={({ field }) => (
//             <FormItem className="flex flex-row items-start space-x-3 space-y-0">
//               <FormControl>
//                 <Checkbox
//                   checked={field.value}
//                   onCheckedChange={field.onChange}
//                 />
//               </FormControl>
//               <div className="space-y-1 leading-none">
//                 <FormLabel>
//                   Use different settings for my mobile devices
//                 </FormLabel>
//                 <FormDescription>
//                   You can manage your mobile notifications in the{" "}
//                   <Link href="/examples/forms">mobile settings</Link> page.
//                 </FormDescription>
//               </div>
//             </FormItem>
//           )}
//         />
//         <Button type="submit">Update notifications</Button>
//       </form>
//     </Form>
//   )
// }

"use client";
import { format, formatDate } from "@/utilities/global";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { UserTrackOrder } from "@/serverlessActions/_userActions";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

type Props = {};
const TrackOrder = (props: Props) => {
  const [order, setOrder] = useState<any>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const orderSample = {
    orderNumber: "2994349j2f4f",
    packageSize: ["small", "large", "very Large"],
    expectedDeliveryDate: Date.now() + 123456789,
    expectedPickupDate: Date.now() + 334946,
    methodOfCollection: "delivery",
    orderPlacedOn: Date.now() - 123456789,
    status: "delivered",
    cancelled: {
      message: "yikes! this order didnt follow through",
      cancelled: false,
    },
  };

  const status = [
    { title: "pending", description: "awaiting confirmation" },
    {
      title: "confirmed",
      description: "your order is being processed and packaged",
    },
    {
      delivery_title: "shipped",
      delivery_description:
        "your package is ready to be delivered and would be out for delivery soon",
      pickup_title: "ready",
      pickup_description: " your package is ready to be collected at our store",
    },
    {
      delivery_title: "delivered",
      delivery_description: "your package has been delivered!",
      pickup_title: "collected",
      pickup_description: "your package has been collected!",
    },
  ];

  const {
    isPending,
    data: response,
    mutate: server_trackorder,
  } = useMutation({
    mutationFn: UserTrackOrder,
    onSuccess: (res) => {
      console.log(res);
    },
    onError: (err) => {
      console.log(err);
    },
  });
  useEffect(() => {}, []);

  function onSubmit() {
    // server_trackorder(inputValue);
    setOrder(orderSample);
  }

  return (
    <>
      {!order ? (
        <div className="space-y-4 lg:w-2/5 md:w-3/4 max-sm:w-full max-sm:px-5 mx-auto">
          <h1 className="my-3 text-sm capitalize text-center text-primary-dark text-[15px]">
            Fill in the order number to track the order
          </h1>
          <span className="mx-auto w-fit">
            <Input
              type="text"
              placeholder="Order number"
              value={inputValue}
              onChange={(e) => setInputValue(e?.target?.value)}
            />
            <p className="text-center my-3 text-[13px]">
              To locate the order number check for the order in your{" "}
              <Link href="/account/orders" className="underline cursor-pointer">
                orders page
              </Link>{" "}
              and copy the order number
            </p>
          </span>
          <Button
            type="button"
            onClick={onSubmit}
            disabled={isPending}
            className="w-full"
          >
            {isPending ? (
              <span className="w-full text-center">
                <ClipLoader color="#ffffff" size={20} />
              </span>
            ) : (
              "Track"
            )}
          </Button>
        </div>
      ) : (
        <div className="bg-gradient-to-b text-white from-[#292727] to-[#465e48] rounded-xl space-y-4 p-6 py-12">
          <h1 className="text-2xl font-semibold px-6 mb-4">
            Order {order.orderNumber}
          </h1>

          <section className="flex w-full items-start my-4">
            {status.map((i: any, index: number) => {
              const active = status.findIndex(
                (stat: any) =>
                  stat.title === order.status ||
                  stat?.[order.methodOfCollection + "_title"] === order.status
              );
              return (
                <section key={index} className=" w-full">
                  <span className="flex items-center">
                    {" "}
                    <span
                      className={cn(
                        " flex flex-col items-center border border-dashed justify-center rounded-[50%] p-4  h-[120px] w-[120px] max-sm:h-[40px] max-sm:w-[40px]",
                        index <= active &&
                          "border rounded-[50%] bg-[#3553329d]  border-[#34a33f] ",
                        (i.title === order.status ||
                          i?.[order.methodOfCollection + "_title"] ===
                            order.status) &&
                          "border-solid border-[#34a33f]  border-[3px] "
                      )}
                    >
                      <p className="capitalize max-sm:text-[11px]">
                        {i.title || i?.[order.methodOfCollection + "_title"]}
                      </p>
                    </span>
                    {index !== status.length - 1 && (
                      <span
                        className={cn(
                          "w-[50%]  h-2 max-sm:h-1 bg-gray-400 ",
                          index <= active - 1 && "bg-[#34a33f]"
                        )}
                      ></span>
                    )}{" "}
                  </span>
                  {(i.title === order.status ||
                    i?.[order.methodOfCollection + "_title"] ===
                      order.status) && (
                    <p className="text-left max-w-40 my-2 max-sm:text-[10px] text-[12px]">
                      {i.description ||
                        i?.[`${order.methodOfCollection}_description`]}
                    </p>
                  )}
                </section>
              );
            })}
          </section>
          <section className="grid  w-full my-4 gap-y-2 px-6">
            {" "}
            <span>Package size : {order.packageSize[0]}</span>
            <span className="">
              Order placed on : {formatDate(order.orderPlacedOn)}
            </span>
            <span>Method of collection : {order.methodOfCollection}</span>
            <span className="">
              Expected Delivery Date : {formatDate(order.expectedDeliveryDate)}
            </span>
            {/* <span>
            {order[5]}
            {order.orderNumber}
          </span> */}
          </section>
        </div>
      )}
    </>
  );
};

export default TrackOrder;

const orderSample = {
  orderNo: "2994349j2f4f",
  packageSize: ["small", "large", "very Large"],
  expectedDeliveryDate: Date.now(),
  expectedPickupDate: Date.now() + 334946,
  methodOfCollection: "delivery",
  orderPlacedOn: Date.now() + 123456789,
  status: {
    pending: { title: "pending", description: "awaiting confirmation" },
    confirmed: {
      title: "confirmed",
      description: "your order is being processed and packaged",
    },
    shipped: {
      delivery_title: "shipped",
      delivery_description:
        "your package is ready to be delivered and would be out for delivery soon",
      pickup_title: "Ready",
      pickup_description: " your package is ready to be collected at our store",
    },
    delivered: {
      delivery_title: "delivered",
      delivery_description: "your package has been delivered!",
      pickup_title: "collected",
      pickup_description: "your package has been collected!",
      cancelled: "yikes! this order didnt follow through",
    },
  },
};
