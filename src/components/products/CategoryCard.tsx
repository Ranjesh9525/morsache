import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { category, tShirtCategory } from "@/@types/categories.d";

type Props = {
  category: category;
};

const CategoryCard = ({ category }: Props) => {
  return (
    <>
    <motion.div
      whileHover={{ scale: 1.05 }}
      id="product-item"
      className=" relative cursor-pointer"
    >
      <div id="product-image " className="h-[450px]  relative  ">
        <Image
          src={category.image}
          alt=""
          width={280}
          height={280}
          className="shadow-lg w-full h-full object-cover absolute"
        />
        <div className="absolute inset-0 bg-black opacity-[12%] "></div>
      </div>
      <div
        id="product-name"
        className="absolute text-xl font-medium uppercase bottom-[20px] tracking-wider left-[10px] text-white"
      >
        {" "}
        {category.name}
      </div>
    </motion.div></>
  );
};

export default CategoryCard;
