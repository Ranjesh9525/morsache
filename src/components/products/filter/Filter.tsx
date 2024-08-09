"use client";
import React from "react";
import { tShirtCategory } from "@/@types/categories.d";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";

type Props = {
  category: string;
};
//make request to fetch the category
const Filter = ({ category }: Props) => {
  const [currentFilter, setCurrentFilter] = React.useState<
    { tag: string; values: string[] }[] | []
  >([]);

  const handleFilter = (selectedFilter: {tag: string, value: string}) => {
    setCurrentFilter(prevFilter => {
        const specificTagExist = prevFilter.findIndex((i) => i.tag === selectedFilter.tag);

        if (specificTagExist !== -1) {
            if (prevFilter[specificTagExist].values.includes(selectedFilter.value)) {
                return prevFilter.map(item => {
                    if (item.tag === selectedFilter.tag) {
                        return {
                            ...item,
                            values: item.values.filter(value => value !== selectedFilter.value)
                        };
                    }
                    return item;
                });
            } else {
                return prevFilter.map(item => {
                    if (item.tag === selectedFilter.tag) {
                        return {
                            ...item,
                            values: [...item.values, selectedFilter.value]
                        };
                    }
                    return item;
                });
            }
        } else {
            return [...prevFilter, {tag: selectedFilter.tag, values: [selectedFilter.value]}];
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

  console.log(currentFilter);

  return (
    <div id="filter-container" className="w-full sticky top-0">
      <div className=" bg-white h-screen  overflow-auto p-5 pl-10">
        <section>
          {currentFilter.length > 0 && (
            <>
              <div className="text-sm font-bold mb-3 inline-flex justify-between"><h1>Filters</h1> <h1 className="cursor-pointer" onClick={()=> setCurrentFilter([])}>Clear all</h1></div>
              <div className="flex flex-col gap-2 "> {currentFilter.map((item, index) => {
                if(item.values.length > 0){ 
                 return  <span key={index} className="inline-flex items-center">
                    <h1 className="font-medium">{item.tag}</h1>: {item.values.join(",")}
                  </span>
                }
              })}</div>
             
            </>
          )}
        </section>
        <div id="categories">{tShirtCategory.name}</div>
        <div id="filters">
          <Accordion
            type="multiple"
            defaultValue={...tShirtCategory.tags.map((i) => i.tag)}
          >
            {tShirtCategory.tags.map((tag, index) => {
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
      </div>
    </div>
  );
};

export default Filter;
