"use client"
import HomeLayout from "@/components/layouts/HomeLayout";
import SearchHeader from "./SearchHeader";
import { Separator } from "@/components/ui/separator";
import React, { useContext, useState } from "react";
import Filter from "@/components/products/filter/Filter";
import DisplayProducts from "@/components/products/DisplayProducts";
import { GlobalContext } from "@/context/globalContext";

type Props = {};

const SearchPage = (props: Props) => {
  const {scrolling:scrollingGlobal,setScrolling:setScrollingGlobal} = useContext(GlobalContext)!

   const [currentFilter, setCurrentFilter] = useState<
    { tag: string; values: string[] }[] | []
  >([]);
  const [productsAmount,setProductsAmount] = useState(0)

  return (
    <div>
    <SearchHeader result={productsAmount} />
    <Separator className="my-6" />
    <div id="products-page-container" className="md:grid md:grid-cols-9 flex flex-col relative">
      <section id="filter" className="md:col-span-2 sticky top-10 h-10 bg-green-500 w-full right-0 z-50">
        {/* <Filter currentFilter={currentFilter} setCurrentFilter={setCurrentFilter}/> */}
      </section>
      <section id="filter-results" className="md:col-span-7 md:p-9 px-6">
        <DisplayProducts setProductsAmount={setProductsAmount} searchFilterData={currentFilter}/>
      </section>
    </div>
  </div>
  );
};

export default SearchPage;
