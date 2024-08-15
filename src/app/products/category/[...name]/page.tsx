import HomeLayout from "@/components/layouts/HomeLayout";
import DisplayProducts from "@/components/products/DisplayProducts";
import Filter from "@/components/products/filter/Filter";
import React from "react";

type Props = {
    params:{name:string}
};

const page = (props: Props) => {
  return (
    <HomeLayout title={`${props.params.name.toString().replaceAll("-"," ") } - Morsache Clothing `}>
      <div id="products-page-container" className="grid grid-cols-9">
        <section id="filter" className="col-span-2  relative">
          <Filter category={props.params.name}/>
        </section>
        <section id="filter-results" className="col-span-7 p-9">
          <DisplayProducts  category={props.params.name.toString().replaceAll("-"," ")}/>
        </section>
      </div>
    </HomeLayout>
  );
};

export default page;
