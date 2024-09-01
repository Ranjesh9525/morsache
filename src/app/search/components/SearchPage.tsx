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
  const {scrolling,setScrolling:setScrollingGlobal} = useContext(GlobalContext)!

   const [currentFilter, setCurrentFilter] = useState<
    { tag: string; values: string[] }[] | []
  >([]);
  const [productsAmount,setProductsAmount] = useState(0)

  return (
    <div>
    <SearchHeader result={productsAmount} />
    <Separator className="my-6 hidden md:block" />
    <div id="products-page-container" className="md:grid md:grid-cols-9 gap-y-2 flex mt-6 md:mt-0 flex-col relative">
      {scrolling && <div className="md:hidden h-10"></div>}
      <section id="filter" className={`md:col-span-2 ${scrolling && "md:relative fixed" } md:relative top-[63px] md:top-0  md:p-0 bg-white w-full md:right-0 z-[120]`}>
        <Filter currentFilter={currentFilter} setCurrentFilter={setCurrentFilter} amountOfProducts={productsAmount}/>
      </section>
      <section id="filter-results" className="md:col-span-7 md:p-9 px-4">
        <DisplayProducts setProductsAmount={setProductsAmount} searchFilterData={currentFilter}/>
      </section>
    </div>
  </div>
  );
};

export default SearchPage;
