"use client";
import React, { useEffect, useState } from "react";
import PageHeadingText from "../../components/PageHeadingText";
import { EmblaOptionsType } from "embla-carousel";
import DisplayBySections from "@/components/home/displayProducts/DisplaySections";
import DisplayProductsByCategory from "@/components/home/displayProducts/DisplayProductsByCategory";
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
  name: string;
  categories: string[];
};

type FeaturedCategory = SectionCategory | TitleCategory;

type FeaturedCategories = FeaturedCategory[];
const Page = (props: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const [featuredCategories, setFeaturedCategories] =
    useState<FeaturedCategories | null>([
      { section: "Title 1", categoriesId: ["66bf23775f02cf03f026a348"] },
      {
        name: "categories 1",
        categories: ["66c87e9595331f958fd232f8", "66bf23775f02cf03f026a348"],
      },
      { section: "Title 2", categoriesId: ["66bf23775f02cf03f026a348"] },
      { name: "categories 2", categories: ["66c87e9595331f958fd232f8"] },
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
    setIsLoading(true);
    await Promise.all(
      featuredCategories!.map(async (item) => {
        if ("name" in item) {
          const Categories = await Promise.all(
            item.categories.map(async (categoryId) => {
              console.log(categoryId);
              const response = await FetchCategoriesById({
                type: "category",
                id: categoryId,
              });
              console.log(response);
              return response?.data;
            })
          );

          allData.push({
            name: item.name,
            categories: Categories,
          });
        }

        if ("section" in item) {
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
            title: item.section,
            items: sectionCategories,
          });
          // items: sectionCategories.filter(Boolean), // Filter out undefined values
        }
      })
    );
    setIsLoading(false);
    // Once all data is fetched and processed, you can use the allData array as needed
    console.log("allData", allData);
  }
  useEffect(() => {
    // fetchCategories();
  }, []);
  const sample = [
    {
      title: "Title 1",
      items: [
        {
          _id: "66bf23775f02cf03f026a348",
          name: "shirts",
          image:
            "https://res.cloudinary.com/dq5kkbcox/image/upload/v1723801013/categories/shirts.jpg",
        },
      ],
    },
    {
      name: "categories 1",
      categories: [
        {
          category: "test",
          items: [
            {
              name: "black shirt",
              description: "a tall back shirt tree ce office take home",
              category: ["test", "shirts"],
              price: 5788,
              slug: "black-shirt",
              sizes: ["xs", "sm", "m", "l", "xl", "xxl"],
              tags: [
                "casual",
                "striped",
                "graphic",
                "v-neck",
                "long sleeve",
                "printed",
                "loose fit",
                "polyester",
                "denim",
                "plaid",
              ],
              variants: [],
              SKU: "RKBATCTK",
              images: [
                "https://res.cloudinary.com/dq5kkbcox/image/upload/v1724788970/products/black-shirt/black-shirt-0.jpg",
                "https://res.cloudinary.com/dq5kkbcox/image/upload/v1724788971/products/black-shirt/black-shirt-1.jpg",
              ],
              purchaseQuantity: 0,
              stock: 7,
              offers: [
                {
                  title: "test",
                  description: "kenvikwenl",
                  description2: "vgrewger",
                  discount: 40,
                  _id: "66ce30ec2750c95cbd242b88",
                },
                {
                  title: "Buy 1 get 1 free",
                  description: "if you buy one item youll get one more",
                  description2: "extra description",
                  discount: 50,
                  _id: "66ce30ec2750c95cbd242b89",
                },
              ],
              payOnDelivery: true,
              exchangeAndReturnPolicy: "hjk iuuiubu vvtedrw\\srdtycv u yy  j",
              moreInformation: "dfcgv iu uubvyvyvt tcy g h hbkjh",
              reviews: [],
              createdAt: "2024-08-27T20:02:52.630Z",
              updatedAt: "2024-08-27T20:02:52.630Z",
              id: "66ce30ec2750c95cbd242b87",
            },
          ],
        },
        {
          category: "shirts",
          items: [
            {
              name: "black shirt",
              description: "a tall back shirt tree ce office take home",
              category: ["test", "shirts"],
              price: 5788,
              slug: "black-shirt",
              sizes: ["xs", "sm", "m", "l", "xl", "xxl"],
              tags: [
                "casual",
                "striped",
                "graphic",
                "v-neck",
                "long sleeve",
                "printed",
                "loose fit",
                "polyester",
                "denim",
                "plaid",
              ],
              variants: [],
              SKU: "RKBATCTK",
              images: [
                "https://res.cloudinary.com/dq5kkbcox/image/upload/v1724788970/products/black-shirt/black-shirt-0.jpg",
                "https://res.cloudinary.com/dq5kkbcox/image/upload/v1724788971/products/black-shirt/black-shirt-1.jpg",
              ],
              purchaseQuantity: 0,
              stock: 7,
              offers: [
                {
                  title: "test",
                  description: "kenvikwenl",
                  description2: "vgrewger",
                  discount: 40,
                  _id: "66ce30ec2750c95cbd242b88",
                },
                {
                  title: "Buy 1 get 1 free",
                  description: "if you buy one item youll get one more",
                  description2: "extra description",
                  discount: 50,
                  _id: "66ce30ec2750c95cbd242b89",
                },
              ],
              payOnDelivery: true,
              exchangeAndReturnPolicy: "hjk iuuiubu vvtedrw\\srdtycv u yy  j",
              moreInformation: "dfcgv iu uubvyvyvt tcy g h hbkjh",
              reviews: [],
              createdAt: "2024-08-27T20:02:52.630Z",
              updatedAt: "2024-08-27T20:02:52.630Z",
              id: "66ce30ec2750c95cbd242b87",
            },
          ],
        },
      ],
    },
    {
      title: "Title 2",
      items: [
        {
          _id: "66bf23775f02cf03f026a348",
          name: "shirts",
          image:
            "https://res.cloudinary.com/dq5kkbcox/image/upload/v1723801013/categories/shirts.jpg",
        },
      ],
    },
    {
      name: "categories 2",
      categories: [
        {
          category: "test",
          items: [
            {
              name: "black shirt",
              description: "a tall back shirt tree ce office take home",
              category: ["test", "shirts"],
              price: 5788,
              slug: "black-shirt",
              sizes: ["xs", "sm", "m", "l", "xl", "xxl"],
              tags: [
                "casual",
                "striped",
                "graphic",
                "v-neck",
                "long sleeve",
                "printed",
                "loose fit",
                "polyester",
                "denim",
                "plaid",
              ],
              variants: [],
              SKU: "RKBATCTK",
              images: [
                "https://res.cloudinary.com/dq5kkbcox/image/upload/v1724788970/products/black-shirt/black-shirt-0.jpg",
                "https://res.cloudinary.com/dq5kkbcox/image/upload/v1724788971/products/black-shirt/black-shirt-1.jpg",
              ],
              purchaseQuantity: 0,
              stock: 7,
              offers: [
                {
                  title: "test",
                  description: "kenvikwenl",
                  description2: "vgrewger",
                  discount: 40,
                  _id: "66ce30ec2750c95cbd242b88",
                },
                {
                  title: "Buy 1 get 1 free",
                  description: "if you buy one item youll get one more",
                  description2: "extra description",
                  discount: 50,
                  _id: "66ce30ec2750c95cbd242b89",
                },
              ],
              payOnDelivery: true,
              exchangeAndReturnPolicy: "hjk iuuiubu vvtedrw\\srdtycv u yy  j",
              moreInformation: "dfcgv iu uubvyvyvt tcy g h hbkjh",
              reviews: [],
              createdAt: "2024-08-27T20:02:52.630Z",
              updatedAt: "2024-08-27T20:02:52.630Z",
              id: "66ce30ec2750c95cbd242b87",
            },
          ],
        },
      ],
    },
  ];
  type DefaultTabs = {
    name: string;
    categories: {
      section: string;
      items: {
        id: string;
        name: string;
        price: string;
        sizes: string[];
        images: string[];
      }[];
    }[];
  };
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
      /> <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger>
              </DialogTrigger>
              <DialogContent className=" max-w-xl">
                <DialogHeader>
                  <DialogTitle>Add Team data</DialogTitle>
                  <DialogDescription >
                    This fields are very curcial, please fill in accurate emails to avoid giving wrong user permissions over the database
                  </DialogDescription>
                </DialogHeader>
                </DialogContent>
                </Dialog>
      {isLoading ? (
        <section className="flex items-center justify-center my-6">
          <ClipLoader />
        </section>
      ) : (
        <div>
          {sample.map((item:any, index: number) => {
            if ("name" in item) {
              const EditableData = featuredCategories!.find((i)=> "name" in i && i.name === item.name)
              return( 
              
               
                <DisplayBySections key={index} defaultTabs={item.categories!} />
              
              )
            }
            if ("title" in item) {
              return <DisplayProductsByCategory key={index} category={item} />;
            }
            return <div></div>;
          })}
        </div>
      )}
    </>
  );
};

export default Page;
