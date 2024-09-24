// "use client"

// import { zodResolver } from "@hookform/resolvers/zod"

// import { useForm } from "react-hook-form"
// import { z } from "zod"

// import { cn } from "@/lib/utils"
// import { Button, buttonVariants } from "@/components/ui/button"
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
// import { toast } from "@/components/ui/use-toast"
// import { ChevronDown } from "lucide-react"

// const appearanceFormSchema = z.object({
//   theme: z.enum(["light", "dark"], {
//     required_error: "Please select a theme.",
//   }),
//   font: z.enum(["inter", "manrope", "system"], {
//     invalid_type_error: "Select a font",
//     required_error: "Please select a font.",
//   }),
// })

// type AppearanceFormValues = z.infer<typeof appearanceFormSchema>

// // This can come from your database or API.
// const defaultValues: Partial<AppearanceFormValues> = {
//   theme: "light",
// }

// export function AppearanceForm() {
//   const form = useForm<AppearanceFormValues>({
//     resolver: zodResolver(appearanceFormSchema),
//     defaultValues,
//   })

//   function onSubmit(data: AppearanceFormValues) {
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
//           name="font"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Font</FormLabel>
//               <div className="relative w-max">
//                 <FormControl>
//                   <select
//                     className={cn(
//                       buttonVariants({ variant: "outline" }),
//                       "w-[200px] appearance-none font-normal"
//                     )}
//                     {...field}
//                   >
//                     <option value="inter">Inter</option>
//                     <option value="manrope">Manrope</option>
//                     <option value="system">System</option>
//                   </select>
//                 </FormControl>
//                 <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 opacity-50" />
//               </div>
//               <FormDescription>
//                 Set the font you want to use in the dashboard.
//               </FormDescription>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="theme"
//           render={({ field }) => (
//             <FormItem className="space-y-1">
//               <FormLabel>Theme</FormLabel>
//               <FormDescription>
//                 Select the theme for the dashboard.
//               </FormDescription>
//               <FormMessage />
//               <RadioGroup
//                 onValueChange={field.onChange}
//                 defaultValue={field.value}
//                 className="grid max-w-md grid-cols-2 gap-8 pt-2"
//               >
//                 <FormItem>
//                   <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
//                     <FormControl>
//                       <RadioGroupItem value="light" className="sr-only" />
//                     </FormControl>
//                     <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
//                       <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
//                         <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
//                           <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
//                           <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
//                         </div>
//                         <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
//                           <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
//                           <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
//                         </div>
//                         <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
//                           <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
//                           <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
//                         </div>
//                       </div>
//                     </div>
//                     <span className="block w-full p-2 text-center font-normal">
//                       Light
//                     </span>
//                   </FormLabel>
//                 </FormItem>
//                 <FormItem>
//                   <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
//                     <FormControl>
//                       <RadioGroupItem value="dark" className="sr-only" />
//                     </FormControl>
//                     <div className="items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground">
//                       <div className="space-y-2 rounded-sm bg-slate-950 p-2">
//                         <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
//                           <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
//                           <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
//                         </div>
//                         <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
//                           <div className="h-4 w-4 rounded-full bg-slate-400" />
//                           <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
//                         </div>
//                         <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
//                           <div className="h-4 w-4 rounded-full bg-slate-400" />
//                           <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
//                         </div>
//                       </div>
//                     </div>
//                     <span className="block w-full p-2 text-center font-normal">
//                       Dark
//                     </span>
//                   </FormLabel>
//                 </FormItem>
//               </RadioGroup>
//             </FormItem>
//           )}
//         />

//         <Button type="submit">Update preferences</Button>
//       </form>
//     </Form>
//   )
// }
"use client";
import { OptimizedOrder } from "@/@types/order";

import { UserGetAllOrders } from "@/serverlessActions/_userActions";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import React, { useEffect } from "react";
import { ClipLoader } from "react-spinners";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { format, formatDate } from "@/utilities/global";

type Props = {};

const DisplayOrders = (props: Props) => {
  const [orders, setOrders] = React.useState<OptimizedOrder[] | null>(null);
  const {
    isPending,
    data: response,
    mutate: server_userGetAllOrders,
  } = useMutation({
    mutationFn: UserGetAllOrders,
    onSuccess: (res) => {
      // console.log(res);
      setOrders(res.data);
    },
  
  });
  useEffect(() => {
    server_userGetAllOrders();
  }, []);
  return (
    <>
      {isPending ? (
        <p className="text-center">
          <ClipLoader />
        </p>
      ) : (
        orders && (
          <div className="w-full md:p-5 p-2 md:pt-0 pt-0 grid gap-3">
            <section>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <span className="md:w-44 cursor-pointer border p-3 py-[0.40rem] md:py-[0.65rem] rounded-sm text-[12px] md:text-[13px] border-gray-300 justify-between gap-6 inline-flex items-center ">
                    Sort <ChevronDown size={18} />
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Sort</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                  // checked={showStatusBar}
                  // onCheckedChange={setShowStatusBar}
                  >
                    Pending
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                  // checked={showActivityBar}
                  // onCheckedChange={setShowActivityBar}
                  >
                    Confirmed
                  </DropdownMenuCheckboxItem>
                  {/* </DropdownMenuCheckboxItem> */}
                  <DropdownMenuCheckboxItem
                  // checked={showActivityBar}
                  // onCheckedChange={setShowActivityBar}
                  >
                    Cancelled
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                  // checked={showActivityBar}
                  // onCheckedChange={setShowActivityBar}
                  >
                    Shipped
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                  // checked={showActivityBar}
                  // onCheckedChange={setShowActivityBar}
                  >
                    Delivered
                  </DropdownMenuCheckboxItem>
                  {/* <DropdownMenuCheckboxItem
      checked={showPanel}
      onCheckedChange={setShowPanel}
    >
      
    </DropdownMenuCheckboxItem> */}
                </DropdownMenuContent>
              </DropdownMenu>
            </section>
            {orders.map((order: OptimizedOrder, index: number) => {
              return (
                <Link
                  href={`/review/${order.orderNumber}`}
                  key={index}
                  className="border rounded-lg p-4 space-y-3 max-sm:space-y-2 cursor-pointer hover:scale-[102%] transition-all w-full"
                >
                  <h1 className="text-xl font-semibold w-full max-sm:text-base">
                    Order:{order.orderNumber}
                  </h1>
                  <section className="w-full justify-between md:flex max-sm:text-[13px] max-sm:grid max-sm:grid-cols2-2 gap-2">
                    <p className="font-semibold">{order.orderStatus}</p>
                    <p>Placed on :{formatDate(order.createdAt)}</p>
                    <p>{order.totalItems} items</p>
                    <p>{format(order.totalAmount)}</p>
                  </section>
                </Link>
              );
            })}
          </div>
        )
      )}
    </>
  );
};

export default DisplayOrders;
