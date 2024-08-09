import HomeLayout from "@/components/layouts/HomeLayout";
import SearchHeader from "./components/SearchHeader";
import { Separator } from "@/components/ui/separator";
import React from "react";
import Filter from "@/components/products/filter/Filter";
import DisplayProducts from "@/components/products/DisplayProducts";

type Props = {};

const page = (props: Props) => {
  const result = {
    total: 238,
  };
  return (
    <div>
      <SearchHeader result={result} />
      <Separator className="my-6" />
      <div id="products-page-container" className="grid grid-cols-9">
        <section id="filter" className="col-span-2  relative">
          <Filter category={"T-shirt"} />
        </section>
        <section id="filter-results" className="col-span-7 p-9">
          <DisplayProducts />
        </section>
      </div>
    </div>
  );
};

export default page;
