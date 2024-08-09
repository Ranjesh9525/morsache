import React from "react";
import ProductCard from "../general/ProductCard";
import DisplayProducts from "./DisplayProducts";
import { sampleProducts } from "./page/ProductPage";

type Props = {};

const Recommendation = (props: Props) => {
  //fetch data from server based on similar products with same tags
  const data:any = []
  return <div
  id="recommendations"
  className="border-b border-b-gray-200 p-9 mt-6 px-16 "
>
  <h1 className="w-full text-center text-2xl font-semibold uppercase my-6">See Also</h1>
  <section id="products" className="grid grid-cols-5 gap-4 gap-y-7">
        {data.length > 0
          ? data.map((item:any, index:number) => (
              <ProductCard
                item={item}
                index={index}
                key={index}
                nameOnly={true}
                //isLoading={isPending}
              />
            ))
          :  sampleProducts.map((item, index) => (
              <ProductCard
                item={item}
                index={index}
                key={index}
                nameOnly={true}
               // isLoading={isPending}
              />
            ))}
      </section>
</div>
};

export default Recommendation;
