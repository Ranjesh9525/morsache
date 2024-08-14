"use client";
import React, { useEffect } from "react";
import { DataTable } from "../components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import PageHeadingText from "../components/PageHeadingText";
import { DataTableColumnHeader } from "../components/DataTableColumnHeader";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AdminGetAllUsers } from "@/serverlessActions/_adminActions";
import { category } from "@/@types/categories.d";
import { tShirtCategory } from "@/@types/categories.d";
import Image from "next/image";
import {Button} from "@/components/ui/button"

export type Users = {
  id: string;
  orders: number;
  dateJoined: Date;
  email: string;
  name: string;
  role: string;
};

// Generate 5 random users
export const columns: ColumnDef<category>[] = [
  {
    accessorKey: "id",
    header: "id",
  },
  {
    accessorKey: "id",
    header: "id",
  },
  {
    accessorKey: "name",
    header: "Name",
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

  // const { isPending, isError, data, error } = useQuery({
  //   queryKey: ["users"],
  //   queryFn:()=> AdminGetAllUsers(),
  // });

  // const [randomData, setData] = React.useState<Users[]>([]);

  //   function generateRandomUsers(count: number): Users[] {
  //     const randomUsers: Users[] = [];
  //     const roles = ["admin", "user", "guest"];

  //     for (let i = 0; i < count; i++) {
  //       const randomUser: Users = {
  //         id: Math.random().toString(36).substring(2, 9),
  //         orders: Math.floor(Math.random() * 100),
  //         dateJoined: new Date(Math.random() * Date.now()),
  //         email: `user${i}@example.com`,
  //         name: `User ${i}`,
  //         role: roles[Math.floor(Math.random() * roles.length)],
  //       };

  //       randomUsers.push(randomUser);
  //     }

  //     return randomUsers;
  //   }

  // useEffect(()=>{
  //  setData( generateRandomUsers(25))

  // },[])

  //    useEffect(() => {

  //     // server_getAllUsers();
  //     // if (!isPending && !isError && data) {
  //     //   console.log("data", data);
  //     // }
  //     // if (error) {
  //     //   console.log("error", error);
  //     // }
  //     async function fetchh(){
  //         const res= await AdminGetAllUsers();

  //         console.log(res)
  //         }
  //         console.log(data)
  //         if(error){
  //           console.log(error)
  //         }
  //  }, [data,isError,isPending]);
  const categories = [tShirtCategory, tShirtCategory];
  return (
    <>
      <PageHeadingText
        pageHeading="Categories in the store"
        description="View all the categories availiable in the store"
      />
      <div className="container mx-auto min-h-[70vh] space-y-10 py-10">
        {/* <DataTable columns={columns} data={randomData} /> */}
        {categories ? (
          categories.map((item) => {
            return <CategoryCardAdmin category={item} />;
          })
        ) : (
          <span>
            <h1>
              You dont have any categories...This is bad...Add one quickly!
            </h1>
          </span>
        )}
      </div>
    </>
  );
};

export default page;

export const CategoryCardAdmin = ({ category }: {category:category}) => {
  return (
    <div id="category" className="group">
      <section id="category-header" className="w-full hidden my-2 group-hover:flex justify-between items-center transition-all duration-200">
      <h1 className="text-xl font-semibold">Category Name : {category.name}</h1>
      <section id="category-action-btns" className="space-x-3"><Button variant="outline">Edit</Button><Button variant="destructive">Delete</Button></section>
      </section>
      <div className="w-full flex">
      <div className="flex-[3] relative cursor-pointer">
        <div id="category-image " className="h-[450px]  relative  ">
          <Image
            src={category.image}
            alt=""
            width={280}
            height={280}
            className="shadow-lg w-full h-full object-contain absolute"
          />
          <div className="absolute inset-0 bg-black opacity-[12%] "></div>
        </div>
        <div
          id="category-name"
          className="absolute text-xl font-medium uppercase bottom-[20px] tracking-wider left-[10px] text-white"
        >
          {" "}
          {category.name}
        </div>
      </div>
      <div className="flex-[9] border grid grid-cols-4 p-2.5">
        <section >
          <h1 className="uppercase font-medium text-lg underline">Id</h1>
          <span className="text-[14.5px] pr-4 whitespace-break-spaces break-words">
            {category.id}
          </span>
        </section>
        {category.tags &&
          category.tags.length > 0 &&
          category.tags.map((tag, index: number) => (
            <section key={index}>
              <h1 className="uppercase font-medium text-lg underline">{tag.tag}</h1>
              <section>
                {tag.values.map((value, subindex: number) => (
                  <span
                    key={subindex}
                    className="flex items-center text-[14.5px] gap-2"
                  >
                    {/* <Checkbox
                          onCheckedChange={() =>
                            handleFilter({ tag: tag.tag, value })
                          }
                          className="w-4 h-4 rounded-none"
                        /> */}
                    {value}
                  </span>
                ))}
              </section>
            </section>
          ))}
      </div>
      </div>
    </div>
  );
};
