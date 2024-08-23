"use client";
import React, { useEffect, useState } from "react";
import PageHeadingText from "../../components/PageHeadingText";
import { EmblaOptionsType } from "embla-carousel";
import Carousel from "@/components/home/slider/Carousel";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FaPlusCircle } from "react-icons/fa";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AdminUpdateStoreData } from "@/serverlessActions/_adminActions";
import { toast } from "@/components/ui/use-toast";
import {
  FetchCategoriesById,
  FetchStoreData,
} from "@/serverlessActions/_fetchActions";
import { ClipLoader } from "react-spinners";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {};
type SectionCategory = {
  section: string;
  categoriesId: string[];
};

type TitleCategory = {
  category: string;
};

type FeaturedCategory = SectionCategory | TitleCategory;

type FeaturedCategories = FeaturedCategory[];
const Page = (props: Props) => {
  const [featuredCategories, setFeaturedCategories] =
    useState<FeaturedCategories | null>([
      { section: "Title 1", categoriesId: ["id1", "id2", "id3"] },
      { category: "66bf23775f02cf03f026a348" },
      { section: "Title 2", categoriesId: ["id1", "id2"] },
      { category: "66c87e9595331f958fd232f8" },
    ]);
  const {
    isPending,
    data: storeResponse,
    refetch,
    isSuccess,
  } = useQuery({
    queryKey: ["store"],
    queryFn: () => FetchStoreData(),
  });
  const {
    data: response,
    isPending: fetchIsPending,
    mutate: server_searchCategories,
  } = useMutation({
    mutationFn: FetchCategoriesById,
  });

  async function fetchCategories() {
    const allData: any[] = [];
    // for (const item of featuredCategories!) {
    //             if ("category" in item) {
    //               await server_searchCategories({ type: "category", id: item.category });
    //               if (response?.data) {
    //                 allData.push({
    //                   category: response?.data?.name,
    //                   items: response?.data?.products,
    //                 });
    //               }
    //             }

    //             if ("section" in item) {
    //               const sectionCategories = [];
    //               for (const categoryId of item.categoriesId) {
    //                  await server_searchCategories({ type: "section", id: categoryId });
    //                 if (response?.data?.category) {
    //                   sectionCategories.push(response?.data?.category);
    //                 }
    //               }

    //               allData.push({
    //                 title: item.section,
    //                 items: sectionCategories,
    //               });
    //             }
    //           }
    await Promise.all(
      featuredCategories!.map(async (item) => {
        if ("category" in item) {
          const response = await FetchCategoriesById({
            type: "category",
            id: item.category,
          });
          if (response?.data) {
            allData.push({
              category: response?.data?.name,
              items: response?.data?.products,
            });
          }
        }

        if ("section" in item) {
          const sectionCategories = await Promise.all(
            item.categoriesId.map(async (categoryId) => {
              const response = await FetchCategoriesById({
                type: "section",
                id: categoryId,
              });

              return response?.data?.category;
            })
          );

          allData.push({
            title: item.section,
            items: sectionCategories.filter(Boolean), // Filter out undefined values
          });
        }
      })
    );

    // Once all data is fetched and processed, you can use the allData array as needed
    console.log("allData", allData);
  }
//fetchCategories()
  type DefaultTabs = {
    section: string;
    items: {
      id: string;
      name: string;
      price: string;
      sizes: string[];
      images: string[];
    }[];
  }[];
  type category = { title: string; items: { name: string; image: string }[] };

  useEffect(() => {
    if (response?.data) {
      //   setImages(response?.data?.carouselImages);
    }
  }, [isSuccess, response]);
  return (
    <>
      <PageHeadingText
        pageHeading="Edit Featured Categories"
        description="Main attraction in the homeScreen be sure to use images of dimension 1240x760 "
      />
    </>
  );
};

export default Page;
