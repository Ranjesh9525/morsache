"use client";
import Image from "next/image";
import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import ProductCard from "@/components/general/ProductCard";

type DefaultTabs = {
  category: string;
  items: {
    id: string;
    name: string;
    price: string;
    sizes: string[];
    images: string[];
  }[];
}[];
type Props = {
  defaultTabs: DefaultTabs;
};
const DisplayBySections = ({ defaultTabs }: Props) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div id="products-display-container" className="">
      <div id="products-display" className="w-full sm:p-3 md:p-6 lg:p-9">
        <div
          id="tabs"
          className="w-full flex flex-row items-center justify-center gap-3 my-5"
        >
          {defaultTabs.map((item: (typeof defaultTabs)[0], index: number) => (
            <span
            key={index}
              className={` border-gray-500 rounded-full  capitalize p-2 text-[13.5px] lg:text-[15px] border cursor-pointer px-4 lg:px-6  ${
                index === activeTab
                  ? "bg-slate-900 border-none text-white "
                  : ""
              }`}
              onClick={() => setActiveTab(index)}
            >
              {" "}
              {item.category}
            </span>
          ))}
        </div>
        <div id="tab-content" className="w-full overflow-x-auto mb-8">
    <div className=" gap-x-4 items-start flex whitespace-nowrap ml-[17px] lg:ml-0" style={{ scrollSnapType: "x mandatory" }}>
        {defaultTabs[activeTab].items.map(
            (item: (typeof defaultTabs)[0]["items"][0], index: number) => (
                <ProductCard key={index} item={item} index={index} />
            )
        )}
    </div>
</div>
        <span className="w-full inline-flex items-center justify-center ">
          <Link
            href={`/products/category/${defaultTabs[activeTab].category
              .toLowerCase()
              .replaceAll(" ", "-")}`}
            className="border border-slate-400 p-2 px-4 text-[15px] lg:text-base lg:px-6 mb-6 w-fit justify-self-center self-center items-center block text-center"
          >
            See More
          </Link>
        </span>
      </div>
    </div>
  );
};

export default DisplayBySections;
