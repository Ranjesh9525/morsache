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
import { useMutation } from "@tanstack/react-query";
import { Offer } from "@/@types/products";
import { AdminCreateOffer } from "@/serverlessActions/_adminActions";

type Props = {};


// Generate 5 random offers
export const columns: ColumnDef<Offer>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "discount",
    header: "Discount (%)",
  },
  {
    accessorKey: "code",
    header: "Offer Code",
  },
  {
    accessorKey: "quantityEffect",
    header: "Quantity Effect",
  },
  {
    accessorKey: "effect",
    header: "Effect Type",
  },
  {
    accessorKey: "active",
    header: "Active",
  },
];

const page = (props: Props) => {
  const [openDialog, setOpenDialog] = React.useState(false);


//   const {
//     isPending,
//     isError,
//     data: offersData,
//     isSuccess,
//     error,
//     mutate: server_AdminCreateOffer,
//   } = useMutation({
//     mutationFn: AdminCreateOffer,
//   });
//   function onSubmit(values: Offer) {
//     server_AdminCreateOffer(values)
//     console.log(values);
//   }
// useEffect(()=>{
//   if(isSuccess){
//     toast({
//       variant: "success",
//       title: "Offer created ",
//       description: "Offer has been created successfully",
//     })
//   }
//   if(error){
//     toast({
//       variant: "destructive",
//       title: "Error:offer creation failed",
//       description:<p>{error?.message}</p> ,
//     })
//   }
  
// },[isSuccess,error])
  return (
    <>
      <PageHeadingText
        pageHeading="All Orders"
        description="Control all the orders and their details here,edit or delete as needed, you can also create new offers here."
      />

      {/**/}
  

      <div className="container mx-auto min-h-[70vh] py-10">
        {/* <DataTable columns={columns} route={"orders"} data={offersData} /> */}
      </div>
    </>
  );
};

export default page;
