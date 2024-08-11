"use client";
import { Product } from "@/@types/products";
import ProductGallery from "@/components/products/ProductGallery";
import ProductInfo from "@/components/products/ProductInfo";
import Recommendation from "@/components/products/Recommendation";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

type Props = {};

const ProductPreview = (props: Props) => {
  const router = useRouter();
  const [values, setValues] = React.useState<Product>();
  useEffect(() => {
    const productDraft = localStorage.getItem("product-draft");
    if (productDraft) {
      setValues(JSON.parse(productDraft));
    } else {
      router.push("/admin/products/create");
    }
  }, []);
  return (
    <>
      <div className="grid grid-cols-2 p-9 min-h-screen gap-x-16 !mt-5">
        <ProductGallery product={values} />
        <ProductInfo product={values!} />
      </div>
      <Recommendation />
    </>
  );
};

export default ProductPreview;
