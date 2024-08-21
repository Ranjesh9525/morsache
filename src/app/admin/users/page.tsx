"use client";
import React, { useEffect } from "react";
import { DataTable } from "../components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import PageHeadingText from "../components/PageHeadingText";
import { DataTableColumnHeader } from "../components/DataTableColumnHeader";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AdminGetAllUsers } from "@/serverlessActions/_adminActions";

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
    accessorKey: "id",
    header: "id",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "name",
    header: "name",
  },
  {
    accessorKey: "dateJoined",
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

const Page =  (props: Props) => {
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
    queryKey: ["users"],
    queryFn:()=> AdminGetAllUsers(),
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
useEffect(()=>{
 setData( generateRandomUsers(25))

},[])
   useEffect(() => {

    // server_getAllUsers();
    // if (!isPending && !isError && data) {
    //   console.log("data", data);
    // }
    // if (error) {
    //   console.log("error", error);
    // }
    async function fetchh(){
        const res= await AdminGetAllUsers();
     
        console.log(res)
        } 
        console.log(data)
        if(error){
          console.log(error)
        }
 }, [data,isError,isPending]);

  return (
    <>
      <PageHeadingText
        pageHeading="Users"
        description="A list of all users on the morsache store"
      />
      <div className="container mx-auto min-h-[70vh] py-10">
        <DataTable columns={columns} route={"users"} data={randomData} />
      </div>
    </>
  );
};

export default Page;
