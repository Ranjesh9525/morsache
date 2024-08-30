"use client";
import React, { useEffect } from "react";
import { category } from "@/@types/categories.d";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  SheetClose,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { VscSettings } from "react-icons/vsc";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FetchCategoryData } from "@/serverlessActions/_fetchActions";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

type Props = {
  category?: string;
  amountOfProducts?: string | number;
  currentFilter?: { tag: string; values: string[] }[] | [];
  setCurrentFilter?: React.Dispatch<
    React.SetStateAction<{ tag: string; values: string[] }[] | []>
  >;
};
//make request to fetch the category
const Filter = ({ category, currentFilter, setCurrentFilter,amountOfProducts }: Props) => {
  const [currentFilterLocal, setCurrentFilterLocal] = React.useState<
    { tag: string; values: string[] }[] | []
  >([]);
  const setCurrentFilterGlobal = setCurrentFilter
    ? setCurrentFilter
    : setCurrentFilterLocal;
  const currentFilterGlobal = currentFilter
    ? currentFilter
    : currentFilterLocal;
  const router = useRouter();
  const [openDialog, setOpenDialog] = React.useState(false);
  const [categoryData, setCategoryData] = React.useState<
    category | { name: string; tags: { tag: string; values: string[] }[] }
  >();
  const handleFilter = (selectedFilter: { tag: string; value: string }) => {
    setCurrentFilterGlobal!((prevFilter) => {
      const specificTagExist = prevFilter.findIndex(
        (i) => i.tag === selectedFilter.tag
      );

      if (specificTagExist !== -1) {
        if (
          prevFilter[specificTagExist].values.includes(selectedFilter.value)
        ) {
          return prevFilter.map((item) => {
            if (item.tag === selectedFilter.tag) {
              return {
                ...item,
                values: item.values.filter(
                  (value) => value !== selectedFilter.value
                ),
              };
            }
            return item;
          });
        } else {
          return prevFilter.map((item) => {
            if (item.tag === selectedFilter.tag) {
              return {
                ...item,
                values: [...item.values, selectedFilter.value],
              };
            }
            return item;
          });
        }
      } else {
        return [
          ...prevFilter,
          { tag: selectedFilter.tag, values: [selectedFilter.value] },
        ];
      }
    });
  };

  // const handleFilter = (selectedFilter: { tag: string; value: string }) => {
  //   const specificTagExist = currentFilter.findIndex(
  //     (i) => i.tag === selectedFilter.tag
  //   );
  //   const filterInstance = currentFilter;
  //   if (filterInstance[specificTagExist]?.values.length > 0) {
  //     if (
  //       filterInstance[specificTagExist]?.values.includes(selectedFilter.value)
  //     ) {
  //       filterInstance[specificTagExist].values = filterInstance[
  //         specificTagExist
  //       ].values.filter((i) => i !== selectedFilter.value);
  //       setCurrentFilterGlobal([...filterInstance]);
  //     } else {
  //       filterInstance[specificTagExist].values = [
  //         ...(filterInstance[specificTagExist]?.values || []),
  //         selectedFilter.value,
  //       ];
  //       setCurrentFilterGlobal([...filterInstance]);
  //     }
  //   } else {
  //     setCurrentFilterGlobal([
  //       ...filterInstance,
  //       { tag: selectedFilter.tag, values: [selectedFilter.value] },
  //     ]);
  //   }
  // };

  // console.log(currentFilter);
  // const {isPending,data:response,error,isError}=useQuery({
  //   queryKey: ["categories-data"],
  //   queryFn: () => FetchAllCategories(),
  // })
  // console.log([...categoryData?.tags.map((i) => i.tag)])
  const clearAllFilters = () => {
    // Uncheck all checkboxes
    const checkboxes = document.querySelectorAll('[data-state="checked"]');
    checkboxes.forEach((checkbox) => {
      checkbox.setAttribute("data-state", "unchecked");
      //checkbox.classList.remove('data-[state=checked]:bg-primary', 'data-[state=checked]:text-primary-foreground');
      checkbox!.querySelector(".flex.items-center.justify-center.text-current")
        ? (checkbox!.querySelector(
            ".flex.items-center.justify-center.text-current"
          )!.innerHTML = "")
        : null;
    });
    setCurrentFilterGlobal([]);
  };
  const {
    isPending,
    isSuccess,
    data: response,
    error,
    isError,
    mutate: server_FetchCategoryData,
  } = useMutation({
    mutationFn: FetchCategoryData,
  });
  useEffect(() => {
    if (category) {
      server_FetchCategoryData(category.toString().replaceAll("-", " "));
    } else {
      setCategoryData({
        name: "",
        tags: [
          {
            tag: "size",
            values: ["S", "M", "L", "XL", "XXL"],
          },

          {
            tag: "color",
            values: ["red", "blue", "green"],
          },
          {
            tag: "material",
            values: ["cotton", "polyester"],
          },
          {
            tag: "gender",
            values: ["men", "women", "unisex"],
          },
          {
            tag: "season",
            values: ["spring", "summer", "autumn", "winter"],
          },
          {
            tag: "style",
            values: ["casual", "sport", "formal"],
          },
          {
            tag: "fit",
            values: ["slim", "regular", "oversize"],
          },
        ],
      });
    }
  }, []);
  useEffect(() => {
    if (isSuccess) {
      if (response?.data) {
        setCategoryData(response?.data);
      }
    }
    if (error) {
      console.log(error);
      router.push("/serverError");
    }
  }, [error, response]);
  return (
    <div id="filter-container" className="w-full md:sticky  md:top-0">
      <Sheet open={openDialog} onOpenChange={setOpenDialog}>
      
      <SheetContent className=" overflow-auto z-[121]">
        <SheetHeader>
          <SheetTitle></SheetTitle>
        </SheetHeader>   <div className=" bg-white h-screen  ">
            {isPending ? (
              <div className="relative flex flex-col  bg-white">
                <Skeleton className="h-[20px] w-[50%] mb-5 rounded-lg" />
                <Skeleton className="h-[40px] w-full my-2 rounded-lg" />
                <Skeleton className="h-[30px] w-[80%] rounded-lg " />
                <Skeleton className="h-[40px] w-full my-2 rounded-lg" />
                <Skeleton className="h-[30px] w-[80%] rounded-lg " />
                <Skeleton className="h-[40px] w-full my-2 rounded-lg" />
                <Skeleton className="h-[30px] w-[80%] rounded-lg " />
                <Skeleton className="h-[40px] w-full my-2 rounded-lg" />
                <Skeleton className="h-[30px] w-[80%] rounded-lg " />
                <Skeleton className="h-[40px] w-full my-2 rounded-lg" />
                <Skeleton className="h-[30px] w-[80%] rounded-lg " />
              </div>
            ) : //  <span className="mx-auto my-[50%] inline-flex items-center w-full justify-center"><ClipLoader className="" /></span>
            categoryData ? (
              <>
                {" "}
                <section>
                  {currentFilterGlobal?.length > 0 && (
                    <>
                      <div className="text-sm font-bold  items-center inline-flex justify-between w-full">
                        <h1>Filters</h1>{" "}
                        <h1
                          className="font-light p-1 rounded px-3 hover:bg-gray-100 cursor-pointer"
                          onClick={clearAllFilters}
                        >
                          Clear all
                        </h1>
                      </div>
                      <div className="flex flex-col gap-2 mb-6 mt-3">
                        {" "}
                        {currentFilterGlobal?.map((item, index) => {
                          if (item.values.length > 0) {
                            return (
                              <span
                                key={index}
                                className="inline-flex items-center"
                              >
                                <h1 className="font-medium">{item.tag}</h1>:{" "}
                                {item.values.join(",")}
                              </span>
                            );
                          }
                        })}
                      </div>
                    </>
                  )}
                </section>
                {categoryData?.name && (
                  <div id="categories" className="capitalize">
                    {categoryData?.name}
                  </div>
                )}
                <div id="filters">
                  <Accordion
                    type="multiple"
                    defaultValue={[...categoryData?.tags.map((i) => i.tag)]}
                  >
                    {categoryData?.tags.map((tag, index) => {
                      return (
                        <AccordionItem value={tag.tag} key={index}>
                          <AccordionTrigger className="capitalize hover:no-underline">
                            {tag.tag}
                          </AccordionTrigger>
                          <AccordionContent>
                            {tag.values.map((value, subindex) => (
                              <div
                                key={subindex}
                                className="flex items-center capitalize gap-2"
                              >
                                <Checkbox
                                  onCheckedChange={() =>
                                    handleFilter({ tag: tag.tag, value })
                                  }
                                  className="w-4 h-4 rounded-none"
                                />
                                {value}
                              </div>
                            ))}
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>{" "}
                </div>
              </>
            ) : (
              <div className="relative flex flex-col  bg-white">
                <Skeleton className="h-[20px] w-[50%] mb-5 rounded-lg" />
                <Skeleton className="h-[40px] w-full my-2 rounded-lg" />
                <Skeleton className="h-[30px] w-[80%] rounded-lg " />
                <Skeleton className="h-[40px] w-full my-2 rounded-lg" />
                <Skeleton className="h-[30px] w-[80%] rounded-lg " />
                <Skeleton className="h-[40px] w-full my-2 rounded-lg" />
                <Skeleton className="h-[30px] w-[80%] rounded-lg " />
                <Skeleton className="h-[40px] w-full my-2 rounded-lg" />
                <Skeleton className="h-[30px] w-[80%] rounded-lg " />
                <Skeleton className="h-[40px] w-full my-2 rounded-lg" />
                <Skeleton className="h-[30px] w-[80%] rounded-lg " />
              </div>
              //  <span className="mx-auto my-[50%] inline-flex items-center w-full justify-center"><ClipLoader className="" /></span>
            )}
          </div>
      </SheetContent>
    </Sheet>
            <div className="md:hidden flex justify-between w-full items-center p-4 py-2 border-b "> <h1 className="font-normal text-[12.4px]">Showing {amountOfProducts || 0} results</h1><Button className="h-auto p-3 py-2" onClick={()=>setOpenDialog(true)}><VscSettings size={21} color="#ffffff"/></Button></div> 
        <div className=" bg-white h-screen  overflow-auto p-5 pl-10 md:block hidden">
        {isPending ? (
          <div className="relative flex flex-col  bg-white">
            <Skeleton className="h-[20px] w-[50%] mb-5 rounded-lg" />
            <Skeleton className="h-[40px] w-full my-2 rounded-lg" />
            <Skeleton className="h-[30px] w-[80%] rounded-lg " />
            <Skeleton className="h-[40px] w-full my-2 rounded-lg" />
            <Skeleton className="h-[30px] w-[80%] rounded-lg " />
            <Skeleton className="h-[40px] w-full my-2 rounded-lg" />
            <Skeleton className="h-[30px] w-[80%] rounded-lg " />
            <Skeleton className="h-[40px] w-full my-2 rounded-lg" />
            <Skeleton className="h-[30px] w-[80%] rounded-lg " />
            <Skeleton className="h-[40px] w-full my-2 rounded-lg" />
            <Skeleton className="h-[30px] w-[80%] rounded-lg " />
          </div>
        ) : //  <span className="mx-auto my-[50%] inline-flex items-center w-full justify-center"><ClipLoader className="" /></span>
        categoryData ? (
          <>
            {" "}
            <section>
              {currentFilterGlobal?.length > 0 && (
                <>
                  <div className="text-sm font-bold  items-center inline-flex justify-between w-full">
                    <h1>Filters</h1>{" "}
                    <h1
                      className="font-light p-1 rounded px-3 hover:bg-gray-100 cursor-pointer"
                      onClick={clearAllFilters}
                    >
                      Clear all
                    </h1>
                  </div>
                  <div className="flex flex-col gap-2 mb-6 mt-3">
                    {" "}
                    {currentFilterGlobal?.map((item, index) => {
                      if (item.values.length > 0) {
                        return (
                          <span
                            key={index}
                            className="inline-flex items-center"
                          >
                            <h1 className="font-medium">{item.tag}</h1>:{" "}
                            {item.values.join(",")}
                          </span>
                        );
                      }
                    })}
                  </div>
                </>
              )}
            </section>
            {categoryData?.name && (
              <div id="categories" className="capitalize">
                {categoryData?.name}
              </div>
            )}
            <div id="filters">
              <Accordion
                type="multiple"
                defaultValue={[...categoryData?.tags.map((i) => i.tag)]}
              >
                {categoryData?.tags.map((tag, index) => {
                  return (
                    <AccordionItem value={tag.tag} key={index}>
                      <AccordionTrigger className="capitalize hover:no-underline">
                        {tag.tag}
                      </AccordionTrigger>
                      <AccordionContent>
                        {tag.values.map((value, subindex) => (
                          <div
                            key={subindex}
                            className="flex items-center capitalize gap-2"
                          >
                            <Checkbox
                              onCheckedChange={() =>
                                handleFilter({ tag: tag.tag, value })
                              }
                              className="w-4 h-4 rounded-none"
                            />
                            {value}
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>{" "}
            </div>
          </>
        ) : (
          <div className="relative flex flex-col  bg-white">
            <Skeleton className="h-[20px] w-[50%] mb-5 rounded-lg" />
            <Skeleton className="h-[40px] w-full my-2 rounded-lg" />
            <Skeleton className="h-[30px] w-[80%] rounded-lg " />
            <Skeleton className="h-[40px] w-full my-2 rounded-lg" />
            <Skeleton className="h-[30px] w-[80%] rounded-lg " />
            <Skeleton className="h-[40px] w-full my-2 rounded-lg" />
            <Skeleton className="h-[30px] w-[80%] rounded-lg " />
            <Skeleton className="h-[40px] w-full my-2 rounded-lg" />
            <Skeleton className="h-[30px] w-[80%] rounded-lg " />
            <Skeleton className="h-[40px] w-full my-2 rounded-lg" />
            <Skeleton className="h-[30px] w-[80%] rounded-lg " />
          </div>
          //  <span className="mx-auto my-[50%] inline-flex items-center w-full justify-center"><ClipLoader className="" /></span>
        )}
      </div>
   
   
    </div>
  );
};

export default Filter;
