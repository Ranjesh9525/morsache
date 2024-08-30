"use client"
import { FetchSimilarProducts } from "@/serverlessActions/_fetchActions";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import ProductCard from "../general/ProductCard";
import DisplayProducts from "./DisplayProducts";
import { sampleProducts } from "./page/ProductPage";

type Props = {
  tags:string[]
};

const Recommendation = ({tags}: Props) => {
  //fetch data from server based on similar products with same tags
  const {
    isPending,
    isError,
    data:response,
    error,
    mutate: server_fetchSimilarProducts,
  } = useMutation({
    mutationFn: FetchSimilarProducts,
  });
   console.log(response);

   useEffect(()=>{
    if(tags && tags?.length > 0){
    server_fetchSimilarProducts(tags)
    }
   },[])
  return( 
  <div
  id="recommendations"
  className="border-b border-b-gray-200 p-9 mt-6 px-16 "
>
  <h1 className="w-full text-center text-2xl font-semibold uppercase my-6">See Also</h1>
  <section id="products" className="grid md:grid-cols-5 grid-cols-3 gap-4 gap-y-7">
        {isPending ? sampleProducts.map((item, index) => (
              <ProductCard
                item={item}
                index={index}
                key={index}
                nameOnly={true}
                isLoading={isPending}
              />
            )) : response?.data && response?.data?.length > 0
          ? response?.data.map((item:any, index:number) => (
              <ProductCard
                item={item}
                index={index}
                key={index}
                nameOnly={true}
                isLoading={isPending}
              />
            ))
          : <p className="text-center text-gray-700 text-xl font-medium">No Similar Products</p> }
      </section>
</div>
)
};

export default Recommendation;
