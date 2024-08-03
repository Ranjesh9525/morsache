"use client";
import Image from "next/image";
import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

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
type Props = {
  defaultTabs: DefaultTabs;
};
const DisplayNewAndTrending = ({ defaultTabs }: Props) => {
  const [activeTab, setActiveTab] = useState(0);
 
  return (
    <div id="products-display-container" className="">
      <div id="products-display" className="w-full sm:p-3 md:p-6 lg:p-9">
        <div
          id="tabs"
          className="w-full flex items-center justify-center gap-3 mb-5"
        >
          {defaultTabs.map((item: (typeof defaultTabs)[0], index: number) => (
            <span
              className={` border-gray-500 rounded-full p-2 text-[15px] border cursor-pointer px-6  ${
                index === activeTab
                  ? "bg-slate-900 border-none text-white "
                  : ""
              }`}
              onClick={() => setActiveTab(index)}
            >
              {" "}
              {item.section}
            </span>
          ))}
        </div>
        <div id="tab-content" className="w-full grid gap-x-4 grid-cols-5 mb-8">
          {defaultTabs[activeTab].items.map(
            (item: (typeof defaultTabs)[0]["items"][0], index: number) => (
              <Link
              href={`/products/${item.name.toLowerCase().replaceAll(" ", "-")}`}
                key={index}
                className={`w-full flex flex-col gap-1`}
                //   className={`w-full ${
                //     index % 2 === 0 ? "col-span-3 bg-red-200" : "col-span-2 bg-blue-200"
                //   }`}
              >
                <div className="relative w-full h-[370px] cursor-pointer">
                  <motion.div
                    initial={{ opacity: 1 }}
                    whileHover={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute w-full h-full top-0 left-0"
                  >
                    <Image
                      src={item.images[0]}
                      alt={item.name}
                      width={300}
                      height={300}
                      className=""
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute w-full h-full top-0 left-0"
                  >
                    <Image
                      src={item.images[1]}
                      alt={item.name}
                      width={300}
                      height={300}
                      className=""
                    />
                  </motion.div>
                </div>
                <p className="capitalize">{item.name}</p>
                <p>{item.price}</p>
                <p>{item.sizes.join(",")}</p>
              </Link>
            )
          )}
        </div>
        <span className="w-full inline-flex items-center justify-center ">

       <Link href={`/products/category/${defaultTabs[activeTab].section.toLowerCase().replaceAll(" ","-")}`} className="border border-slate-400 p-2 px-6 mb-6 w-fit justify-self-center self-center items-center block text-center">See More</Link>
        </span>
      </div>
    </div>
  );
};

export default DisplayNewAndTrending;
