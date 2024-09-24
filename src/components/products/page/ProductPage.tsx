"use client";
import React, { useEffect, useState } from "react";
import ProductGallery from "../ProductGallery";
import ProductInfo from "../ProductInfo";
import Recommendation from "../Recommendation";
import { Offer, Product } from "@/@types/products.d";
import { redirect } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { FetchSingleProduct } from "@/serverlessActions/_fetchActions";
import { ClipLoader } from "react-spinners";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  slug: string;
};

function generateRandomTitle() {
  const titles = [
    "Special Offer",
    "Discount Deal",
    "Limited Time Offer",
    "Big Sale",
    "Seasonal Discount",
  ];
  return titles[Math.floor(Math.random() * titles.length)];
}

function generateRandomDescription() {
  const descriptions = [
    "Great discount on selected items",
    "Buy one get one free",
    "Exclusive offer for members",
  ];
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

function generateRandomImage() {
  const images = [
    "https://picsum.photos/200",
    "https://picsum.photos/250",
    "https://picsum.photos/260",
    "https://picsum.photos/270",
    "https://picsum.photos/190",
    "https://picsum.photos/220",
    "https://picsum.photos/240",
    "https://picsum.photos/230",
  ];
  return images[Math.floor(Math.random() * images.length)];
}

function generateRandomOffer(numberOfOffers: number): Offer[] {
  function offers() {
    return {
      title: generateRandomTitle(),
      id: Math.random().toString(36).substring(2, 9),
      description: generateRandomDescription(),
      description2: "Additional description here",
      discount: Math.floor(Math.random() * 51).toString(), 
      code: Math.random().toString(36).substring(2, 9),
      image: generateRandomImage(),
      quantityEffect: (Math.floor(Math.random() * 10) + 1).toString(), 
      effect: ["flat", "percentage", "quantity"][
        Math.floor(Math.random() * 3)
      ] as "flat" | "percentage" | "quantity",
      active: Math.random() > 0.5,
    };
  }
  const randomOffers: Offer[] = Array.from({ length: numberOfOffers }, offers);
  return randomOffers;
}


export const saveRecentlyViewedProduct = (product: any) => {
  if (product) {
    const recent = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");

    // Check if the product is already in the list of recently viewed products
    const index = recent.findIndex((item: any) => item.id === product.id);
    if (index !== -1) {
      // If product is already in the list, update viewedOn and bring it to the top
      recent[index].viewedOn = Date.now();
      const updatedRecentlyViewed = [
        recent[index],
        ...recent.slice(0, index),
        ...recent.slice(index + 1),
      ];
      localStorage.setItem(
        "recentlyViewed",
        JSON.stringify(updatedRecentlyViewed)
      );
    } else {
      // If product is not in the list.. add it to the top
      product.viewedOn = Date.now();
      const updatedRecentlyViewed = [product, ...recent];
      localStorage.setItem(
        "recentlyViewed",
        JSON.stringify(updatedRecentlyViewed)
      );
    }
  }
  return null;
};
const ProductPage = ({ slug }: Props) => {
  const [product, setProduct] = useState<Product | null>(null);
  // console.log(slug)
  const {
    isPending,
    isError,
    isSuccess,
    data: response,
    error,
    mutate: server_fetchProduct,
  } = useMutation({
    mutationFn: FetchSingleProduct,
  });
  useEffect(() => {
    server_fetchProduct(slug);
  }, []);

  useEffect(() => {
    if (response) {
      if (response?.success == false && response?.data?.error) {
        redirect("/404");


        } else {
      setProduct(response.data);
      // console.log(response);}
        }
    }
    if (isError) {
      // console.log(error);
      redirect("/404");
    }
  }, [isError, isSuccess, response]);

  // if (!product && !isPending) {
  //   redirect("/404");
  // }
  useEffect(() => {
    if (product) {
      const optimizedProduct = {
        id: product.id,
        images: product?.images,
        name: product?.name,
        slug: product?.slug,
        sizes: product?.sizes,
        price: product?.price,
        salePrice: product?.salePrice,
      };
      saveRecentlyViewedProduct(optimizedProduct);
    }
  }, [product]);
  return (
    <>
      {product ? (
        <>
          <div className="grid md:grid-cols-2 md:p-9 p-5 min-h-screen gap-x-16 !mt-5">
            <ProductGallery product={product!} />
            <ProductInfo product={product!} />
          </div>
          <Recommendation tags={product!?.tags!} />
        </>
      ) : (
        <div className="grid md:grid-cols-2 md:p-9 p-5 min-h-screen gap-x-16 !mt-5 bg-white">
          <div className="relative flex gap-3 max-sm:flex-col">
            <div className="flex flex-col gap-4 flex-[3] max-sm:flex-row">
              <Skeleton className="h-[160px] w-[100%]  rounded-lg" />
              <Skeleton className="h-[160px] w-[100%] rounded-lg" />{" "}
            </div>
            <Skeleton className="h-[450px] w-full rounded-lg flex-[9]" />
          </div>
          <div className="relative flex flex-col">
            <Skeleton className="h-[50px] w-full rounded-lg" />
            <Skeleton className="h-[30px] w-[160px] my-3 rounded-lg" />
            <Skeleton className="h-[30px] w-full my-3 rounded-lg" />
            <Skeleton className="h-[60px] mt-6 w-[40%] rounded-lg" />
            <Skeleton className="h-[60px] mt-2 w-[40%] rounded-lg" />
            <Skeleton className="h-[60px] mt-2 w-[40%] rounded-lg" />
            <Skeleton className="h-[60px] mb-6 mt-2 w-[40%] rounded-lg" />
            <Skeleton className="h-[41px] w-full rounded-lg" />
            <Skeleton className="h-[41px] mt-3 w-full rounded-lg" />
          </div>
        </div>
      )}
    </>
  );
};

export default ProductPage;
