import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";
import { format } from "../products/ProductInfo";

type Props = {
  item: any;
  index: number;
  isLoading?: boolean;
  nameOnly?: true;
  showPriceWhenNameOnly?: true;
};

const ProductCard = ({ item, index, isLoading, nameOnly,showPriceWhenNameOnly }: Props) => {
  if (isLoading) {
    return (
      <div className="relative flex flex-col  bg-white">
        <Skeleton className="h-[250px] w-[200px] rounded-xl" />
        <Skeleton className="h-[30px] w-[160px] my-3 rounded-xl" />
        <Skeleton className="h-[30px] w-[100px] rounded-xl " />
      </div>
    );
  }
  return (
    <Link
      href={`/products/${item.name.toLowerCase().replaceAll(" ", "-")}`}
      key={index}
      scroll={true}
      className={`w-full flex flex-col lg:max-w-[300px] lg:gap-2 sm:gap-1`}
      //   className={`w-full ${
      //     index % 2 === 0 ? "col-span-3 bg-red-200" : "col-span-2 bg-blue-200"
      //   }`}
      // {!nameOnly ?   <div className="relative w-full h-[370px]  cursor-pointer">
      // <motion.div
      //     initial={{ opacity: 1 }}
      //     whileHover={{ opacity: 0 }}
      //     transition={{ duration: 0.5 }}
      //     className="absolute w-full h-full top-0 left-0"
      //   >
      //     <Image
      //       src={item.images[0]}
      //       alt={item.name}
      //       width={300}
      //       height={300}
      //       className=""
      //     />
      //   </motion.div>
      //md:h-[320px] h-[240px] lg:h-[370px]
    >
      {!nameOnly ? (
        <div className="relative  pb-[150%] cursor-pointer">
          <motion.div
            initial={{ opacity: 1 }}
            whileHover={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute w-full h-full top-0 left-0"
          >
            <Image
              src={item.images[0]}
              alt={item.name}
              // width={300}
              // height={300}
              fill
              className="object-cover w-full h-full"
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
              // width={300}
              // height={300}
              fill
              className="object-cover w-full h-full"
            />
          </motion.div>
        </div>
      ) : (
        <div className="relative  pb-[150%] cursor-pointer">
       
          <Image
            src={item.images[1] || item.images[0]}
            alt={item.name}
            // width={300}
            // height={300}
            fill
            className="object-cover w-full h-full"
          />
   
        </div>
      )}
      <div className="min-w-[123px] py-2 lg:py-0">
      <p className="capitalize xl:text-base md:text-base text-[0.75rem] whitespace-break-spaces w-full lg:whitespace-pre-line">
        {item.name}
      </p>
     
 
          {!nameOnly || showPriceWhenNameOnly && <p className=" xl:text-base md:text-base text-[0.82rem]">INR {format(parseInt(item.price))}</p> }
          {!nameOnly && ( <p className="font-light tracking-[0.15em] lg:text-[14px] text-[0.78rem] uppercase text-gray-600">
            {item.sizes.join(",")}
          </p>
    
      )}</div>
    </Link>
  );
};

export default ProductCard;
