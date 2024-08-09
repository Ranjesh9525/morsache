import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";

type Props = {
  item: any;
  index: number;
  isLoading?:boolean;
  nameOnly?:true
};

const ProductCard = ({ item, index,isLoading,nameOnly }: Props) => {
  if(isLoading){
    return  (
      <div className="relative flex flex-col  bg-white">
      <Skeleton className="h-[250px] w-[200px] rounded-lg" />
      <Skeleton className="h-[30px] w-[160px] my-3 rounded-lg" />
      <Skeleton className="h-[30px] w-[100px] rounded-lg " />
      </div>
      )
  }
  return (
    <Link
      href={`/products/${item.name.toLowerCase().replaceAll(" ", "-")}`}
      key={index}
      className={`w-full flex flex-col gap-1`}
      //   className={`w-full ${
      //     index % 2 === 0 ? "col-span-3 bg-red-200" : "col-span-2 bg-blue-200"
      //   }`}
    >
      {!nameOnly ?   <div className="relative w-full h-[370px] cursor-pointer">
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
        </motion.div>     </div>
        : <div>
          <Image
            src={item.images[1]}
            alt={item.name}
            width={300}
            height={300}
            className=""
          />
        </div>
        }
  
      <p className="capitalize">{item.name}</p>
      { !nameOnly && <>
      <p>INR {item.price}</p>
      <p>{item.sizes.join(",")}</p>
      </>}
    </Link>
  );
};

export default ProductCard;
