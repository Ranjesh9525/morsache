"use client";
import React, { useEffect } from "react";
import { DataTable } from "../components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import PageHeadingText from "../components/PageHeadingText";
import { DataTableColumnHeader } from "../components/DataTableColumnHeader";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AdminGetAllUsers } from "@/serverlessActions/_adminActions";
import { ClipLoader } from "react-spinners";

export type Users = {
  id: string;
  orders: number;
  dateJoined: Date;
  email: string;
  name: string;
  role: string;
};

// Generate 5 random users
export const columns: ColumnDef<Users>[] = [
  {
    accessorKey: "_id",
    header: "id",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "firstName",
    header: "first name",
  },
  {
    accessorKey: "lastName",
    header: "last name",
  },
  {
    accessorKey: "createdAt",
    header: "Date Joined",
  },
  {
    accessorKey: "orders",
    header: "Orders",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
];
type Props = {};

const Page = (props: Props) => {
  const {
    isPending,
    isError,
    data: response,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => AdminGetAllUsers(),
  });
  const [data, setData] = React.useState<Users[]>([]);
  useEffect(() => {
    if (response?.data) {
      console.log(response?.data);
      setData(response?.data);
    }
    if (error) {
      console.log(error);
    }
  }, [data, isError, isPending]);

  return (
    <>
      <PageHeadingText
        pageHeading="Users"
        description="A list of all users on the morsache store"
      />
      <div className="container mx-auto min-h-[70vh] py-10">
        {isPending ? (
          <p className="text-center">
            <ClipLoader size={30} />
          </p>
        ) : (
          <DataTable
            columns={columns}
            rowKey={"_id"}
            route={"users"}
            data={data}
          />
        )}
      </div>
    </>
  );
};

export default Page;
