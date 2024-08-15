"use client";
import React, { useEffect } from "react";
import { DataTable } from "../components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import PageHeadingText from "../components/PageHeadingText";
import { DataTableColumnHeader } from "../components/DataTableColumnHeader";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AdminGetAllUsers,AdminGetAllProducts } from "@/serverlessActions/_adminActions";
import { ClipLoader } from "react-spinners";
import { toast } from "@/components/ui/use-toast";
import { Product } from "@/@types/products";

export type Users = {
  id: string;
  orders: number;
  dateJoined: Date;
  email: string;
  name: string;
  role: string;
};

// Generate 5 random users

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "id",
    header: "id",
  },
  {
    accessorKey: "SKU",
    header: "SKU",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "slug",
    header: "Slug",
  },
  {
    accessorKey: "salePrice",
    header: "Sale Price",
  },
  {
    accessorKey: "sizes",
    header: "Sizes",
  },
  {
    accessorKey: "tags",
    header: "Tags",
  },
  {
    accessorKey: "variants",
    header: "Variants",
  },
  {
    accessorKey: "rating",
    header: "Rating",
  },
  {
    accessorKey: "purchaseQuantity",
    header: "Purchase Quantity",
  },
  {
    accessorKey: "stock",
    header: "Stock",
  },
  {
    accessorKey: "offers",
    header: "Offers",
  },
  {
    accessorKey: "exchangeAndReturnPolicy",
    header: "Exchange and Return Policy",
  },
  {
    accessorKey: "moreInformation",
    header: "More Information",
  },
  {
    accessorKey: "payOnDelivery",
    header: "Pay On Delivery",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
  },
];
type Props = {};

const page = (props: Props) => {
  // const data = await getData()
  // const {
  //   isPending,
  //   isError,
  //   data,
  //   error,
  //   mutate: server_getAllUsers,
  // } = useMutation({
  //   mutationFn: AdminGetAllUsers,
  // });
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["products"],
    queryFn: () => AdminGetAllProducts(),
  });
  const [randomData, setData] = React.useState<Users[]>([]);
  function generateRandomUsers(count: number): Users[] {
    const randomUsers: Users[] = [];
    const roles = ["admin", "user", "guest"];

    for (let i = 0; i < count; i++) {
      const randomUser: Users = {
        id: Math.random().toString(36).substring(2, 9),
        orders: Math.floor(Math.random() * 100),
        dateJoined: new Date(Math.random() * Date.now()),
        email: `user${i}@example.com`,
        name: `User ${i}`,
        role: roles[Math.floor(Math.random() * roles.length)],
      };

      randomUsers.push(randomUser);
    }

    return randomUsers;
  }
  // useEffect(() => {
  //   setData(generateRandomUsers(25));
  // }, []);
     useEffect(() => {
   if(data){
          console.log(data)}
          if(error){
            toast({
              title: "Error",
              description: error.message,
              variant: "destructive",
            })
            console.log(error)
          }
   }, [data,isError]);

  return (
    <>
      <PageHeadingText
        pageHeading="Products"
        description="Here's a list of products on sale"
      />
      <div className="container mx-auto min-h-[70vh] py-10">
        {isPending ? (
          <section className="flex items-center justify-center my-6">
            <ClipLoader />
          </section>
        ) : (
          <DataTable columns={columns} data={data.data} />
        )}
      </div>
    </>
  );
};

export default page;
