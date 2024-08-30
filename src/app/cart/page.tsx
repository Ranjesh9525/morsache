"use client";
import HomeLayout from "@/components/layouts/HomeLayout";
import React, { useContext, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { CartContext } from "@/context/cartContext";
import Header from "./components/Header";
import CartItem from "./components/CartItem";
import EmptyCart from "./components/EmptyCart";
import CheckoutCard from "./components/CheckoutCard";
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
const Page = (props: Props) => {
  const { cart, dispatch } = useContext(CartContext)!;

  //note that when you're viewing your cart it should fetch these products from the server
  //so it can update them in the case of an item going out of stock
 // console.log(cart);
  return (
    <HomeLayout title="Cart - Morsache Clothing">
      <div className="min-h-screen md:p-9 p-5">
        <Header cart={cart} />
        {cart.items.length < 1 ? (
          <EmptyCart />
        ) : (
          <div className="md:grid md:grid-cols-10 flex flex-col py-4 gap-x-4">
            <section className="col-span-7 space-y-2">
              {cart.items.length > 0 &&
                cart.items.map((item, index) => (
                  <CartItem key={index} cartItem={item} />
                ))}
            </section>
            <section className="col-span-3">
              <CheckoutCard cart={cart} />
            </section>
          </div>
        )}
      </div>
    </HomeLayout>
  );
};

export default Page;
// <Link
//         href={`/products/${item.name.toLowerCase().replaceAll(" ", "-")}`}
//         className={`w-full flex flex-row  gap-1`}
//         //   className={`w-full ${
//         //     index % 2 === 0 ? "col-span-3 bg-red-200" : "col-span-2 bg-blue-200"
//         //   }`}
//       >
//         <div className="relative w-[250px] h-[310px] cursor-pointer">
//           <motion.div
//             initial={{ opacity: 1 }}
//             whileHover={{ opacity: 0 }}
//             transition={{ duration: 0.5 }}
//             className="absolute w-full h-full top-0 left-0"
//           >
//             <Image
//               src={item.images[0]}
//               alt={item.name}
//               width={200}
//               height={200}
//               className=""
//             />
//           </motion.div>
//           <motion.div
//             initial={{ opacity: 0 }}
//             whileHover={{ opacity: 1 }}
//             className="absolute w-full h-full top-0 left-0"
//           >
//             <Image
//               src={item.images[1]}
//               alt={item.name}
//               width={200}
//               height={200}
//               className=""
//             />
//           </motion.div>
//         </div>
//         <div className="flex flex-col gap-2">
//         <p className="capitalize">{item.name}</p>
//         {/* <p>{item.sizes.join(",")}</p></div> */}
//         <p>Quantity: <strong> 1</strong></p>
//         <p>Size: <strong> L</strong></p>
//         <p>INR {item.price}</p></div>
//       </Link>
