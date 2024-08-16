"use client"
import HomeLayout from "@/components/layouts/HomeLayout";
import SearchHeader from "./SearchHeader";
import { Separator } from "@/components/ui/separator";
import React, { useState } from "react";
import Filter from "@/components/products/filter/Filter";
import DisplayProducts from "@/components/products/DisplayProducts";

type Props = {};

const SearchPage = (props: Props) => {
   const [currentFilter, setCurrentFilter] = useState<
    { tag: string; values: string[] }[] | []
  >([]);
  const result = {
    total: 238,
  };
  return (
    <div>
      <SearchHeader result={result} />
      <Separator className="my-6" />
      <div id="products-page-container" className="grid grid-cols-9">
        <section id="filter" className="col-span-2  relative">
          <Filter currentFilter={currentFilter} setCurrentFilter={setCurrentFilter}/>
        </section>
        <section id="filter-results" className="col-span-7 p-9">
          <DisplayProducts searchFilterData={currentFilter}/>
        </section>
      </div>
    </div>
  );
};

export default SearchPage;
