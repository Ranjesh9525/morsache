"use client";

import { ColumnDef } from "@tanstack/react-table";
import React, { useEffect } from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClipLoader } from "react-spinners";

import { cn } from "@/lib/utils";
import {
  Form,
  FormField,
  FormItem,
  FormDescription,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { DataTable } from "../components/DataTable";
import PageHeadingText from "../components/PageHeadingText";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Offer } from "@/@types/products";
import {
  AdminCreateOffer,
  AdminGetAdminData,
  AdminGetAllOrders,
  AdminUpdateAdminData,
} from "@/serverlessActions/_adminActions";
import { Order } from "@/@types/order";
import { useSearchParams } from "next/navigation";

type Props = {};

const orderColumns: ColumnDef<Order>[] = [
  { accessorKey: "_id", header: "Order Id" },
  { accessorKey: "orderNumber", header: "Order Number" },
  { accessorKey: "customer", header: "Customer Id" },
  { accessorKey: "totalItems", header: "Total Items" },
  { accessorKey: "totalAmount", header: "Total Amount" },
  { accessorKey: "orderStatus", header: "Order Status" },
  { accessorKey: "shippingAddress", header: "Shipping Address" },
  { accessorKey: "shippingPrice", header: "Shipping Price" },
  { accessorKey: "paymentMethod.type", header: "Payment Method" },
  { accessorKey: "paymentStatus", header: "Payment Status" },
];
const Page = (props: Props) => {
  const [orders, setOrders] = React.useState<Order[] | null>(null);
  const [switchValue, setSwitchValue] = React.useState<boolean>(false);
  const searchParams = useSearchParams();
  const status:any = searchParams!.get("status") 
  const {
    isPending:UpdatingAdminData,
    mutate: server_AdminUpdateAdminData,
  } = useMutation({
    mutationFn: AdminUpdateAdminData,
    onSuccess:(res)=>{
      console.log(res)
      setSwitchValue(res?.data?.defaultConfirmOrders)
      toast({
        variant:"success",
        title:"Auto confirm orders set"
      })
    },
    onError:(err)=>{
      toast({
        variant:"destructive",
        title:"Failed to update admin data",
        description:<p>{err?.message}</p>
      })
    }
  });
  const { data, isPending, isSuccess, error, isError,mutate:server_AdminGetAllOrders } = useMutation({
    mutationFn: AdminGetAllOrders
  })
  useEffect(()=>{
    server_AdminGetAllOrders(status)
  },[status])
  const { data:AdminResponse, isPending:AdminDataIsPending, isSuccess:AdminDataIsSuccess, error:AdminDataError } = useQuery({
    queryKey: ["admin-data"],
    queryFn: () => AdminGetAdminData(),
  });
  useEffect(() => {
    if (isSuccess) {
      setOrders(data?.data);
    }
  }, [isSuccess, data]);
useEffect(()=>{
if(AdminResponse){
  setSwitchValue(AdminResponse?.data?.defaultConfirmOrders)

}
},[AdminResponse,AdminDataIsSuccess])
  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error:offer creation failed",
        description: <p>{error?.message}</p>,
      });
    }
  }, [isError, error]);
  return (
    <>
      <PageHeadingText
        pageHeading="All Orders"
        description="Control all the orders and their details here,edit or delete as needed, you can also create new offers here."
      />

      {/**/}

      <div className="container mx-auto min-h-[70vh] py-10">
        <div className="flex flex-row items-center justify-between rounded-lg border mb-10 p-4">
          <div className="space-y-0.5">
            <h1 className="text-xl font-semibold">Auto confirm orders?</h1>
            <p className="text-[14px] text-gray-500">
              Set all orders to be confirmed after they are placed, NOTE that by
              default every other would be approved and wouldnt need an admin to
              review them
            </p>
          </div>

          <Switch disabled={UpdatingAdminData} checked={switchValue} onCheckedChange={(checked)=> server_AdminUpdateAdminData({ defaultConfirmOrders:checked})} />
        </div>
        {isPending ? (
          <p className="text-center">
            <ClipLoader size={50} />
          </p>
        ) : orders && orders?.length > 0 ? (
          <DataTable
            rowKey={"_id"}
            columns={orderColumns}
            route={"orders"}
            data={orders!}
          />
        ) : (
          <p>No orders found</p>
        )}
      </div>
    </>
  );
};

export default Page;
