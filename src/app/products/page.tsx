"use client"
import HomeLayout from "@/components/layouts/HomeLayout";
import CategoryCard from "@/components/products/CategoryCard";
import React from "react";
import { category, tShirtCategory } from "@/@types/categories.d";

type Props = {};

const page = (props: Props) => {
  //fetch all categories
  const allCategories: category[] = [tShirtCategory,tShirtCategory];
  return (
    <HomeLayout title="Our Products - Morsache Clothing">
  <h1 className="text-center w-ful text-2xl font-semibold uppercase my-6">
       morsache Products
      </h1>
      <div className=" grid grid-cols-4 gap-4 p-9">
        {allCategories.map((item) => (
          <CategoryCard category={item} />
        ))}
      </div>
    </HomeLayout>
  );
};

export default page;
