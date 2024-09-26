"use client";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

type Props = {
  category: { section: string; items: { name: string; image: string }[] };
};

const DisplayProductsByCategory = ({ category }: Props) => {
  return (
    <div id="products-category-display-container" className="p-4 md:p-6 lg:p-9">
      <h1 className="text-center w-full text-xl lg:text-2xl font-semibold capitalize my-6">
        {category.section}
      </h1>
      <div
        id="products-wrapper"
        className="grid lg:grid-cols-4  grid-cols-2 gap-6   "
      >
        {category.items.map((item, index) => (
          <Link href={`/products/category/${item.name}`}>
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              id="product-item"
              className=" relative cursor-pointer"
            >
              <div id="product-image " className="pt-[150%]  relative  ">
                <Image
                  src={item.image}
                  alt=""
                  fill
                  className="rounded-xl shadow-lg w-full h-full object-cover absolute"
                />
                <div className="absolute inset-0 bg-black opacity-[12%] rounded-xl"></div>
              </div>
              <div
                id="product-name"
                className="absolute text-xl font-medium uppercase bottom-[20px] tracking-wider left-[10px] text-white"
              >
                {" "}
                {item.name}
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DisplayProductsByCategory;
