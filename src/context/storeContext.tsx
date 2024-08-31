"use client";
import { Store } from "@/@types/store";
import {
  FetchStoreData,
  FetchCategoriesById,
} from "@/serverlessActions/_fetchActions";
import { useQuery } from "@tanstack/react-query";
// import { Store, StoreAction } from "@/@types/Store";
import React, { useEffect, useReducer } from "react";
import { createContext, useState } from "react";
import { FeaturedCategories } from "@/@types/categories";
export const StoreContext = React.createContext<{
  store: Store | null;
  storeDataIsPending: boolean;
  storeDataError: any;
  refetchStoreData: () => void;
  storeDataIsError: boolean;
  featuredCategoriesData: any;
  isFetchingFeaturedCategory: boolean;
} | null>(null);

const StoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [store, setStore] = useState<Store | null>(null);

  const {
    isPending: storeDataIsPending,
    data: storeDataResponse,
    refetch: refetchStoreData,
    isSuccess: storeDataIsSuccess,
    isError: storeDataIsError,
    error: storeDataError,
  } = useQuery({
    queryKey: ["fetchstore"],
    queryFn: () => FetchStoreData(),
  });

  useEffect(() => {
    if (storeDataIsSuccess && storeDataResponse.data) {
      console.log("store res", storeDataResponse);

      setStore(storeDataResponse.data);
    }
  }, [storeDataIsSuccess, storeDataResponse]);
  const [featuredCategories, setFeaturedCategories] =
    useState<FeaturedCategories | null>(null);
  const [isFetchingFeaturedCategory, setisFetchingFeaturedCategory] =
    useState<boolean>(false);
  const [featuredCategoriesData, setFeaturedCategoriesData] =
    useState<any>(null);

  async function fetchCategories() {
    const allData: any[] = [];

    if (featuredCategories === null || featuredCategories.length === 0) return;
    setisFetchingFeaturedCategory(true);
    await Promise.all(
      featuredCategories!.map(async (item) => {
        if ("name" in item && item.categories) {
          const Categories = await Promise.all(
            item.categories.map(async (categoryId) => {
              const response = await FetchCategoriesById({
                type: "category",
                id: categoryId,
              });
              return response?.data;
            })
          );

          allData.push({
            name: item.name,
            categories: Categories,
          });
        }

        if ("section" in item && item.categoriesId) {
          const sectionCategories = await Promise.all(
            item.categoriesId.map(async (categoryId) => {
              const response = await FetchCategoriesById({
                type: "section",
                id: categoryId,
              });

              return response?.data;
            })
          );

          allData.push({
            section: item.section,
            items: sectionCategories.filter(Boolean), // Filter out undefined values
          });
        }
      })
    );
    setisFetchingFeaturedCategory(false);
    // console.log("allData", allData);
    setFeaturedCategoriesData(allData);
  }
  useEffect(() => {
    if (featuredCategories !== null) {
      fetchCategories();
    }
  }, [featuredCategories]);
  useEffect(() => {
    if (store) {
      setFeaturedCategories(store!?.featuredCategories!);
    }
  }, [store]);

  return (
    <StoreContext.Provider
      value={{
        store,
        storeDataIsPending,
        storeDataError,
        storeDataIsError,
        refetchStoreData,
        featuredCategoriesData,
        isFetchingFeaturedCategory,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;
