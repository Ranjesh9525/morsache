"use client";
import React, { useEffect, useState } from "react";
import PageHeadingText from "../../components/PageHeadingText";
import { EmblaOptionsType } from "embla-carousel";
import DisplayBySections from "@/components/home/displayProducts/DisplaySections";
import DisplayProductsByCategory from "@/components/home/displayProducts/DisplayProductsByCategory";
import Carousel from "@/components/home/slider/Carousel";
import Image from "next/image";
import {
  Form,
  FormField,
  FormItem,
  FormDescription,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PencilIcon, Plus, PlusIcon, Trash } from "lucide-react";
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
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { FeaturedCategories } from "@/@types/categories";

type Props = {};

const Page = (props: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [featuredCategories, setFeaturedCategories] =
    useState<FeaturedCategories | null>(null);
  const [featuredCategoriesData, setFeaturedCategoriesData] =
    useState<any>(null);
  const defaultt = [
    {
      type: "categoriesWithProducts",
      name: "categories 1",
      categories: ["66c87e9595331f958fd232f8", "66bf23775f02cf03f026a348"],
    },
    {
      type: "multipleCategories",
      section: "Title 1",
      categoriesId: ["66bf23775f02cf03f026a348"],
    },
    {
      type: "categoriesWithProducts",
      name: "categories 2",
      categories: ["66c87e9595331f958fd232f8", "66bf23775f02cf03f026a348"],
    },
    {
      type: "multipleCategories",
      section: "Title 2",
      categoriesId: ["66bf23775f02cf03f026a348"],
    },
    {
      type: "categoriesWithProducts",
      name: "categories 3",
      categories: ["66c87e9595331f958fd232f8"],
    },
  ];

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
    data: updateResponse,
    isPending: updateIsPending,
    mutate: server_updateStoreData,
  } = useMutation({
    mutationFn: AdminUpdateStoreData,
    onSuccess: (res) => {
      console.log(res);
      if(res?.success == false && res?.data?.error){
        toast({
          variant: "destructive",
          title: "Couldnt update account detail",
          description: <p>{res?.data?.error?.message}</p>,
        }); }else{ 
      setOpenDialog(false);
      toast({
        variant: "success",
        title: "Store data successfully updated",
        description: "Store data was updated successfully",
      });}
    },
   
  });

  async function fetchCategories() {
    const allData: any[] = [];

    if (featuredCategories === null || featuredCategories.length === 0) return;
    setIsLoading(true);
    await Promise.all(
      featuredCategories!.map(async (item) => {
        if ("name" in item) {
          const Categories = await Promise.all(
            item.categories!.map(async (categoryId) => {
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

        if ("section" in item ) {
          const sectionCategories = await Promise.all(
            item.categoriesId!.map(async (categoryId) => {
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
    setIsLoading(false);
    console.log("allData", allData);
    setFeaturedCategoriesData(allData);
  }
 
  // useEffect(() => {
  //   // fetchCategories();
  //   const req = { featuredCategories: defaultt };
  //   if (!updateIsPending) {
  //     server_updateStoreData(req);
  //   }
  // }, []);
  const sample = [
    {
      section: "Title 1",
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
      section: "Title 2",
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
    if (storeResponse?.data) {
      setFeaturedCategories(storeResponse?.data?.featuredCategories);
    }
  }, [isSuccess, storeResponse]);

  useEffect(() => {
    if (featuredCategories !== null) {
      fetchCategories();
    }
  }, [featuredCategories]);
  const onSubmit = async (data: any) => {
    let newFeaturedCategory: FeaturedCategories;
    data.type = data?.name ? "categoriesWithProducts" : "multipleCategories";
    const isExist = featuredCategories?.findIndex(
      (item) => item._id === data._id
    );
    if (isExist !== -1 && isExist !== undefined) {
      newFeaturedCategory = [
        ...featuredCategories?.slice(0, isExist)!,
        data,
        ...featuredCategories?.slice(isExist + 1)!,
      ];
      setFeaturedCategories(newFeaturedCategory);
    } else {
      newFeaturedCategory = [...featuredCategories!, data];
      setFeaturedCategories(newFeaturedCategory);
    }

    console.log("new featured category", newFeaturedCategory);
    const req = { featuredCategories: newFeaturedCategory };
    server_updateStoreData(req);
  };

  // useEffect(() => {
  //   console.log("featuredCategories", featuredCategories);
  // }, [featuredCategories]);
  async function handleCategoryDelete(id: string) {
    const newFeaturedCategories = featuredCategories!.filter(
      (item) => item._id !== id
    );
    setFeaturedCategories(newFeaturedCategories!);
    const req = { featuredCategories: newFeaturedCategories };
    server_updateStoreData(req);
  }

  function handleAddNewCategory() {
    setOpenDialog(true);
    setSelectedCategory({
      name: "",
      section: "",
      categories: [""],
      categoriesId: [""],
      type: "",
    });
  }
  return (
    <>
      <PageHeadingText
        pageHeading="Edit Featured Categories"
        description="Main attraction in the homeScreen be sure to use images of dimension 1240x760 "
      />{" "}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className=" max-w-xl w-full max-h-xl ">
          <DialogHeader>
            <DialogTitle>Edit Featured Categories</DialogTitle>
            <DialogDescription>
              This fields are very curcial, please fill in accurate categories
              Id if a wrong id or deleted category id is filled here it will not
              show the category
            </DialogDescription>
          </DialogHeader>
          <div className="w-full space-y-4 ">
            <span className="w-full flex flex-col">
              <h1 className="capitalize font-medium tracking-tight text-xl">
                Category group name
              </h1>
              <h2 className="text-[12px] my-1">
                {selectedCategory?.name
                  ? "This wont be visible to the users"
                  : "This would be boldly visible"}
              </h2>
              <Input
                value={selectedCategory?.name || selectedCategory?.section}
                onChange={(e) =>
                  setSelectedCategory((prev: any) => ({
                    ...prev,
                    [selectedCategory?.name ? "name" : "section"]:
                      e?.currentTarget?.value,
                  }))
                }
              />
            </span>
            <span className="w-full flex flex-col max-h-[200px] p-2 gap-2 overflow-y-auto">
              <h1 className="capitalize font-medium tracking-tight text-xl">
                Categories
              </h1>
              <h2 className="text-[12px]">
                Copy the category Id from Categories tab and paste it here
              </h2>
              {selectedCategory?.[
                selectedCategory?.name ? "categories" : "categoriesId"
              ]?.map((item: any, index: number) => {
                return (
                  <div className="w-full flex flex-col" key={index}>
                    <span className="w-full flex flex-col">
                      <h1 className="capitalize font-medium tracking-tight my-2 text-lg">
                        Category Id
                      </h1>
                      <Input
                        value={item}
                        onChange={(e) => {
                          setSelectedCategory((prev: any) => ({
                            ...prev,
                            [selectedCategory?.name
                              ? "categories"
                              : "categoriesId"]: [
                              ...prev?.[
                                selectedCategory?.name
                                  ? "categories"
                                  : "categoriesId"
                              ].slice(0, index),
                              e?.currentTarget?.value,
                              ...prev?.[
                                selectedCategory?.name
                                  ? "categories"
                                  : "categoriesId"
                              ].slice(index + 1),
                            ],
                          }));
                        }}
                      />
                    </span>
                  </div>
                );
              })}
              <Button
                className="my-2"
                variant={"outline"}
                onClick={() =>
                  setSelectedCategory((prev: any) => ({
                    ...prev,

                    [selectedCategory?.name ? "categories" : "categoriesId"]: [
                      ...prev?.[
                        selectedCategory?.name ? "categories" : "categoriesId"
                      ],
                      "",
                    ],
                  }))
                }
              >
                <PlusIcon className="w-4 h-4" /> Add Category
              </Button>
            </span>
            <Button
              className="w-full"
              disabled={
                selectedCategory?.[
                  selectedCategory?.name ? "categories" : "categoriesId"
                ]?.includes("") ||
                updateIsPending ||
                isPending ||
                isLoading ||
                selectedCategory?.[
                  selectedCategory?.name ? "name" : "section"
                ] === "" ||
                selectedCategory?.type === "" ||
                selectedCategory?.[
                  selectedCategory?.name ? "categories" : "categoriesId"
                ]?.length === 0
              }
              onClick={() => onSubmit(selectedCategory)}
            >
              {updateIsPending || isPending || isLoading ? (
                <ClipLoader color="#fff" size={21} />
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {isLoading || isPending || updateIsPending ? (
        <section className="flex items-center justify-center my-6">
          <ClipLoader />
        </section>
      ) : (
        <div>
          {featuredCategoriesData && featuredCategoriesData?.length > 0 ? (
            featuredCategoriesData.map((item: any, index: number) => {
              if ("name" in item) {
                const EditableData = featuredCategories!.find(
                  (i) => "name" in i && i.name === item.name
                );
                // console.log(EditableData);
                return (
                  <section key={index} className="relative">
                    <section
                      className="absolute top-10 items-center gap-2 transition-all  p-2 px-6 border-primary hover:scale-[105%] border rounded-md right-10 cursor-pointer inline-flex font-semibold tracking-tight "
                      onClick={() => {
                        setSelectedCategory(EditableData);
                        setOpenDialog(true);
                      }}
                    >
                      <PencilIcon className="" size={18} />
                      Edit
                    </section>
                    <section
                      className="absolute top-10 hover:scale-[105%] transition-all text-white p-2 px-4 gap-1 rounded-md bg-red-500 left-10 items-center cursor-pointer inline-flex tracking-tight "
                      onClick={() => {
                        handleCategoryDelete(EditableData!._id!);
                      }}
                    >
                      <Trash className="" color="#fff" size={18} />
                      Delete
                    </section>
                    <DisplayBySections
                     
                      defaultTabs={item.categories!}
                    />
                  </section>
                );
              }
              if ("section" in item) {
                const EditableData = featuredCategories!.find(
                  (i) => "section" in i && i.section === item.section
                );
                return (
                  <section  key={index} className="relative">
                    <section
                      className="absolute top-10 hover:scale-[105%] transition-all text-white p-2 px-4 gap-1 rounded-md bg-red-500 left-10 items-center cursor-pointer inline-flex tracking-tight "
                      onClick={() => {
                        handleCategoryDelete(EditableData!._id!);
                      }}
                    >
                      <Trash className="" color="#fff" size={18} />
                      Delete
                    </section>
                    <section
                      className="absolute top-10 items-center gap-2  p-2 px-6 border-primary hover:scale-[105%] border rounded-md right-10 cursor-pointer inline-flex font-semibold tracking-tight "
                      onClick={() => {
                        setSelectedCategory(EditableData);
                        setOpenDialog(true);
                      }}
                    >
                      <PencilIcon className="" size={18} />
                      Edit
                    </section>
                    <DisplayProductsByCategory  category={item} />
                  </section>
                );
              }
              return <div  key={index}></div>;
            })
          ) : (
            <p className="text-center w-full">
              Store home screen has no featured categories, this is bad, add
              something quickly
            </p>
          )}
          <section className="w-full inline-flex items-center">

          <Button className=" w-[50%] " onClick={handleAddNewCategory}>
            <Plus className="mr-2" size={24} /> Add New Category{" "}
          </Button>
          </section>
        </div>
      )}
    </>
  );
};

export default Page;
