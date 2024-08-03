"use client"
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion"

type Props = {
  category: { title: string; items: { name: string; image: string }[] };
};

const DisplayProductsByCategory = ({ category }: Props) => {
  return (
    <div id="products-category-display-container" className="sm:p-3 md:p-6 lg:p-9">
      <h1 className="text-center w-ful text-2xl font-semibold capitalize my-6">{category.title}</h1>
      <div id="products-wrapper" className="grid grid-cols-4 gap-x-6   ">
        {category.items.map((item, index) => (
          <motion.div key={index} whileHover={{scale:1.05}} id="product-item" className=" relative cursor-pointer">
            <div  id="product-image " className="h-[450px]  relative  " >
              <Image src={item.image} alt="" width={280} height={280} className="rounded-xl shadow-lg w-full h-full object-cover absolute" />
              <div className="absolute inset-0 bg-black opacity-[12%] rounded-xl"></div>
            </div>
            <div id="product-name"  className="absolute text-xl font-medium uppercase bottom-[20px] tracking-wider left-[10px] text-white"> {item.name}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DisplayProductsByCategory;
