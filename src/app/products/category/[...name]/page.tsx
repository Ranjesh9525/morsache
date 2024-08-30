import HomeLayout from "@/components/layouts/HomeLayout";
import DisplayProducts from "@/components/products/DisplayProducts";
import Filter from "@/components/products/filter/Filter";
import CategoriesPage from "@/components/products/page/CategoryPage";
import React from "react";

type Props = {
    params:{name:string}
};

const page = (props: Props) => {
  return (
    <HomeLayout title={`${props.params.name.toString().replaceAll("-"," ") } - Morsache Clothing `}>
      <CategoriesPage category={props?.params?.name}/>
    </HomeLayout>
  );
};

export default page;
