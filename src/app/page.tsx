"use client";
import Navbar from "@/components/general/navbar/Navbar";
import AdsPromotions from "@/components/home/AdsPromotions";
import DisplayBySections from "@/components/home/displayProducts/DisplaySections";
import DisplayProductsByCategory from "@/components/home/displayProducts/DisplayProductsByCategory";
import HeaderAds from "@/components/home/HeaderAds";
import RecentlyViewed from "@/components/general/RecentlyViewed";
import Slider from "@/components/home/slider/Slider";
import HomeLayout from "@/components/layouts/HomeLayout";
import Image from "next/image";
import Protected from "@/_hooks/useProtected";
import { toast } from "@/components/ui/use-toast";
import { useContext, useEffect, useState } from "react";
import { StoreContext } from "@/context/storeContext";
import { FetchCategoriesById } from "@/serverlessActions/_fetchActions";
import { FeaturedCategories } from "@/@types/categories";
import ProductCard from "@/components/general/ProductCard";


export default function Home() {


  const [featuredCategories, setFeaturedCategories] =
    useState<FeaturedCategories | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const {
    store,
    storeDataIsPending,
    storeDataError,
    storeDataIsError,
    refetchStoreData,
    featuredCategoriesData,
    isFetchingFeaturedCategory,
  } = useContext(StoreContext)!;

  return (
    <HomeLayout title="Morsache Clothing">
      <Slider />
      {isFetchingFeaturedCategory || storeDataIsPending ? (
        <>
          <div id="tab-content-1" className="w-full overflow-x-auto mb-8">
            <div
              className=" gap-x-4 items-center justify-center flex whitespace-nowrap ml-[17px] lg:ml-0 p-9"
              style={{ scrollSnapType: "x mandatory" }}
            >
              {Array.from({ length: 5 }).map((_, index) => (
                <ProductCard
                  item={null}
                  index={index}
                  key={index}
                  isLoading={true}
                />
              ))}
            </div>
          </div>
        </>
      ) : (
        <div id="section_wrapper-1">
          {featuredCategoriesData && featuredCategoriesData?.length > 0 ? (
            featuredCategoriesData
              .slice(0, featuredCategoriesData.length - 1)
              .map((item: any, index: number) => {
                if ("name" in item) {
                  return (
                    <DisplayBySections
                      key={index}
                      defaultTabs={item.categories!}
                    />
                  );
                }
                if ("section" in item) {
                  return (
                    <DisplayProductsByCategory key={index} category={item} />
                  );
                }

                return <div key={index}></div>;
              })
          ) : (
            <div></div>
          )}
        </div>
      )}
      <AdsPromotions />
      {isFetchingFeaturedCategory || storeDataIsPending ? (
        <>
          <div id="tab-content-2" className="w-full overflow-x-auto mb-8">
            <div
              className=" gap-x-4 items-center justify-center flex whitespace-nowrap ml-[17px] lg:ml-0 p-9"
              style={{ scrollSnapType: "x mandatory" }}
            >
              {Array.from({ length: 5 }).map((_, index) => (
                <ProductCard
                  item={null}
                  index={index}
                  key={index}
                  isLoading={true}
                />
              ))}
            </div>
          </div>
        </>
      ) : (
        <div id="section_wrapper-2">
          {featuredCategoriesData && featuredCategoriesData?.length > 0 ? (
            featuredCategoriesData
              .slice(featuredCategoriesData.length - 1)
              .map((item: any, index: number) => {
                if ("name" in item) {
                  return (
                    <DisplayBySections
                      key={index}
                      defaultTabs={item.categories!}
                    />
                  );
                }
                if ("section" in item) {
                  return (
                    <DisplayProductsByCategory key={index} category={item} />
                  );
                }

                return <div key={index}></div>;
              })
          ) : (
            <div></div>
          )}
        </div>
      )}
      <RecentlyViewed />
    </HomeLayout>
  );
}
