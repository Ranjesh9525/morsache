"use client";
import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

type Props = {};

const RecentlyViewed = (props: Props) => {
  const [recentProductsWithinThreeDays, setRecentProductsWithinThreeDays] =
    useState<any[]>([]);
  useEffect(() => {
    const allViewedProducts = JSON.parse(
      localStorage.getItem("recentlyViewed") || "[]"
    );
    const i = allViewedProducts.filter(
      (product: any) => product.viewedOn > Date.now() - 259200000
    );
    setRecentProductsWithinThreeDays(i);

    localStorage.setItem("recentlyViewed", JSON.stringify(i));
  }, []);
  // allViewedProducts.map((item: any) => {
  //   //if product was viewed over three days ago dont include it
  //   if (item.viewedOn > Date.now() - 259200000) {
  //     recentProducts.push(item);
  //   }

  // });
  return (
    <div className="min-h-[50vh] text-center my-6 p-9">
      <h1 className="text-center w-ful text-2xl font-semibold uppercase my-6">
        Recently Viewed
      </h1>
      <div id="tab-content" className="w-full grid gap-4 grid-cols-5 mb-8">
        {recentProductsWithinThreeDays.length > 0 &&
          recentProductsWithinThreeDays
            .slice(0, 5)
            .map((item: any, index: number) => (
              <ProductCard key={index} item={item} index={index} />
            ))}
      </div>
    </div>
  );
};

export default RecentlyViewed;
