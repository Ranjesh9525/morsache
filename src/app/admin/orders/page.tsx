"use client";

import { ColumnDef } from "@tanstack/react-table";
import React, { useEffect } from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClipLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import { format } from "@/components/products/ProductInfo";
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
  AdminGetAllOrders,
} from "@/serverlessActions/_adminActions";
import { Order } from "@/@types/order";

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

  // const {
  //   isPending,
  //   isError,
  //   data: offersData,
  //   isSuccess,
  //   error,
  //   mutate: server_AdminCreateOffer,
  // } = useMutation({
  //   mutationFn: AdminCreateOffer,
  // });
  const { data, isPending, isSuccess, error, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: () => AdminGetAllOrders(),
  });
  useEffect(() => {
    if (isSuccess) {
      setOrders(data?.data);
    }
  }, [isSuccess, data]);

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
        <div>Auto confrim orders</div>
        {isPending ? (
          <p className="text-center">
            <ClipLoader size={50} />
          </p>
        ) : orders && orders?.length > 0 ? (
          <DataTable rowKey={"orderNumber"} columns={orderColumns} route={"orders"} data={orders!} />
        ):<p>No orders found</p>}
      </div>
    </>
  );
};

export default Page;
