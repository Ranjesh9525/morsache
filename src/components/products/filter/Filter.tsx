"use client";
import React, { useEffect } from "react";
import { category } from "@/@types/categories.d";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FetchCategoryData } from "@/serverlessActions/_fetchActions";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";

type Props = {
  category: string;
};
//make request to fetch the category
const Filter = ({ category }: Props) => {
  const [currentFilter, setCurrentFilter] = React.useState<
    { tag: string; values: string[] }[] | []
  >([]);
  const router = useRouter();
  const [categoryData, setCategoryData] = React.useState<category | null>(null);
  const handleFilter = (selectedFilter: { tag: string; value: string }) => {
    setCurrentFilter((prevFilter) => {
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
  //       setCurrentFilter([...filterInstance]);
  //     } else {
  //       filterInstance[specificTagExist].values = [
  //         ...(filterInstance[specificTagExist]?.values || []),
  //         selectedFilter.value,
  //       ];
  //       setCurrentFilter([...filterInstance]);
  //     }
  //   } else {
  //     setCurrentFilter([
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
    server_FetchCategoryData(category.toString().replaceAll("-", " "));
  }, []);
  useEffect(() => {
    if (isSuccess) {
      if (response?.data) {
        setCategoryData(response?.data);
      } else {
        router.push("/500");
      }
    }
    if (error) {
      console.log(error);
      router.push("/500");
    }
  }, [error, response]);
  return (
    <div id="filter-container" className="w-full sticky top-0">
      <div className=" bg-white h-screen  overflow-auto p-5 pl-10">
        {isPending ? (
        <ClipLoader className="mx-auto my-auto" />
        ) : categoryData ? (
          <>
            {" "}
            <section>
              {currentFilter.length > 0 && (
                <>
                  <div className="text-sm font-bold mb-3 inline-flex justify-between">
                    <h1>Filters</h1>{" "}
                    <h1
                      className="cursor-pointer"
                      onClick={() => setCurrentFilter([])}
                    >
                      Clear all
                    </h1>
                  </div>
                  <div className="flex flex-col gap-2 ">
                    {" "}
                    {currentFilter.map((item, index) => {
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
            <div id="categories">{categoryData!.name}</div>
            <div id="filters">
              <Accordion
                type="multiple"
                defaultValue={[...categoryData!.tags.map((i) => i.tag)]}
              >
                {categoryData!.tags.map((tag, index) => {
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
        ):<p>Something went wrong, please refresh</p>}
      </div>
    </div>
  );
};

export default Filter;
