"use client";
import HomeLayout from "@/components/layouts/HomeLayout";
import CategoryCard from "@/components/products/CategoryCard";
import React, { useEffect, useState } from "react";
import { category, tShirtCategory } from "@/@types/categories.d";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FetchAllCategories } from "@/serverlessActions/_fetchActions";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";

type Props = {};

const page = (props: Props) => {
  //fetch all categories
  const [allCategories, setAllCategories] = useState<category[] | null>(null);

  const { data: categoriesResponse, isPending: categoriesIsFetching } =
    useQuery({
      queryKey: ["fetch_categories"],
      queryFn: () => FetchAllCategories(),
    });
  useEffect(() => {
    if (categoriesResponse) {
      if (categoriesResponse?.success == true) {
        // console.log(categoriesResponse);
        setAllCategories(categoriesResponse?.data);
      }
      if (
        categoriesResponse?.success == false &&
        categoriesResponse?.data?.error
      ) {
        console.log(categoriesResponse?.data);
        toast({
          variant: "destructive",
          title: categoriesResponse?.data?.error?.message,
        });
      }
    }
  }, [categoriesResponse]);
  return (
    <HomeLayout title="Our Products - Morsache Clothing">
      <h1 className="text-center w-ful text-2xl font-semibold uppercase my-6">
        morsache Products
      </h1>
      <div className=" grid lg:grid-cols-4 gap-y-7 md:grid-cols-3 grid-cols-2 max-sm:grid-cols-1 gap-4 p-9 ">
        {categoriesIsFetching
          ? Array.from({ length: 12 }).map((_, index) => (
              <Skeleton key={index} className="w-full h-96 rounded-xl" />
            ))
          : allCategories &&
            allCategories.length > 0 &&
            allCategories.map((item: any, index: number) => (
              <CategoryCard key={index} category={item} />
            ))}
      </div>
    </HomeLayout>
  );
};

export default page;
