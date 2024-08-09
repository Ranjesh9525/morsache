"use client"
import HomeLayout from "@/components/layouts/HomeLayout";
import React, { useContext,useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { CartContext } from "@/context/cartContext";

type Props = {};
const item = {
  id: "31",
  name: "Box Stripe White Shirt",
  price: "1450",
  sizes: ["M", "L"],
  images: [
    "/items/brush-stroke-red-shirt2.jpg",
    "/items/brush-stroke-red-shirt1.jpg",
  ],
};
const page = (props: Props) => {

  const {cart,dispatch} = useContext(CartContext)!


  console.log(cart)
  return (
    <HomeLayout title="Cart - Morsache Clothing">
      <div className="min-h-screen   p-9">
        <h1 className="text-left text-3xl my-4 font-semibold">Your Cart</h1>
        <Link
          href={`/products/${item.name.toLowerCase().replaceAll(" ", "-")}`}
          className={`w-full flex flex-row  gap-1`}
          //   className={`w-full ${
          //     index % 2 === 0 ? "col-span-3 bg-red-200" : "col-span-2 bg-blue-200"
          //   }`}
        >
          <div className="relative w-[250px] h-[310px] cursor-pointer">
            <motion.div
              initial={{ opacity: 1 }}
              whileHover={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute w-full h-full top-0 left-0"
            >
              <Image
                src={item.images[0]}
                alt={item.name}
                width={200}
                height={200}
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
                width={200}
                height={200}
                className=""
              />
            </motion.div>
          </div>
          <div className="flex flex-col gap-2">
          <p className="capitalize">{item.name}</p>
          {/* <p>{item.sizes.join(",")}</p></div> */}
          <p>Quantity: <strong> 1</strong></p>
          <p>Size: <strong> L</strong></p>
          <p>INR {item.price}</p></div>
        </Link>
      </div>
    </HomeLayout>
  );
};

export default page;
