"use client";
import React, { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import PageHeadingText from "../components/PageHeadingText";
import { DataTableColumnHeader } from "../components/DataTableColumnHeader";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  AdminGetAllCategories,
  AdminGetAllUsers,
  AdminDeleteCategory,
} from "@/serverlessActions/_adminActions";
import { category } from "@/@types/categories.d";
import { tShirtCategory } from "@/@types/categories.d";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
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
// export const columns: ColumnDef<category>[] = [
//   {
//     accessorKey: "id",
//     header: "id",
//   },
//   {
//     accessorKey: "id",
//     header: "id",
//   },
//   {
//     accessorKey: "name",
//     header: "Name",
//   },
// ];
type Props = {};

const Page = (props: Props) => {
  const [categories, setCategories] = useState([]);
  // const data = await getData()
 
  const {
    isPending,
    isError,
    data: response,
    error,
  } = useQuery({
    queryKey: ["categories-admin"],
    queryFn: () => AdminGetAllCategories(),
  });

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

  useEffect(() => {
    if (response?.data) {
      console.log(response)
      setCategories(response.data);
    }
    if (isError) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `${error}`,
      });
    }
  }, [response, isError]);

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
  // const categories = [tShirtCategory, tShirtCategory];
  return (
    <>
      <PageHeadingText
        pageHeading="Categories in the store"
        description="View all the categories availiable in the store"
      />
      <div className="container mx-auto min-h-[70vh] space-y-10 py-10">
        {/* <DataTable columns={columns} data={randomData} /> */}
        {isPending?<div className="w-full inline-flex items-center justify-center h-full"> <ClipLoader className="" size={30}/> </div>:categories && categories.length>0? (
          categories?.map((item:any,index:number) => {
            return <CategoryCardAdmin key={index} cat={item} />;
          })
        ) : (
          <span >
            <h1 className="text-center">
              You dont have any categories...This is bad...Add one quickly!
            </h1>
          </span>
        )}
      </div>
    </>
  );
};

export default Page;

export const CategoryCardAdmin = ({ cat }: { cat: category }) => {
  const {
    isPending:deleteIsPending,
    isError:deleteIsError,
    isSuccess:deleteIsSuccess,
    error:deleteError,
    mutate: server_deleteCategory,
  } = useMutation({
    mutationFn: AdminDeleteCategory,
  });

  useEffect(()=>{
    if(deleteIsError){
      console.log(deleteError);
      toast({
        variant: "destructive",
        title: "Error",
        description: `${deleteError}`,
      });
    
    }
    if(deleteIsSuccess){
      // console.log(deleteError);
      toast({
        variant: "success",
        title: `Category ${cat.name} deleted`,
      })
    
    }

  },[deleteIsError,deleteIsSuccess])
  return (
    <div id="category" className="group">
      <section
        id="category-header"
        className="w-full hidden my-2 group-hover:flex justify-between items-center transition-all duration-200"
      >
        <h1 className="text-xl font-semibold">
          Category Name : {cat.name}
        </h1>
        <section id="category-action-btns" className="space-x-3">
          <Button variant="outline">Edit</Button>
          <Button variant="destructive" disabled={deleteIsPending} onClick={()=>server_deleteCategory(cat._id!)}>{deleteIsPending ? <ClipLoader color="#fff"/>:"Delete"}</Button>
        </section>
      </section>
      <div className="w-full flex">
        <div className="flex-[3] relative cursor-pointer">
          <div id="category-image " className="h-[450px]  relative  ">
            <Image
              src={cat.image}
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
            {cat.name}
          </div>
        </div>
        <div className="flex-[9] border grid grid-cols-4 p-2.5 gap-4">
          <section className="">
            <h1 className="uppercase font-medium text-lg underline">Id</h1>
            <span className="text-[14.5px]  whitespace-break-spaces break-words">
              {cat._id}
            </span>
          </section>
          {cat.tags &&
            cat.tags.length > 0 &&
            cat.tags.map((tag, index: number) => (
              <section key={index} className="border rounded-md text-center">
                <h1 className="uppercase font-medium text-lg underline">
                  {tag.tag}
                </h1>
                <section>
                  {tag.values.map((value, subindex: number) => (
                    <span
                      key={subindex}
                      className="flex items-center text-center justify-center  w-full text-[14.5px] gap-2"
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
