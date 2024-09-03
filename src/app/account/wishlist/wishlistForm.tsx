"use client";
import React, { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, StarIcon } from "lucide-react";
import Image from "next/image";
import { CiDiscount1 } from "react-icons/ci";
import { FaCartPlus, FaCartShopping } from "react-icons/fa6";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CartContext } from "@/context/cartContext";
import { Product } from "@/@types/products.d";
import { CartItem } from "@/@types/cart.d";
import { cn } from "@/lib/utils";
import { MdOutlineDiscount } from "react-icons/md";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  UserAddToWishList,
  UserGetWishlists,
} from "@/serverlessActions/_userActions";
import { ClipLoader } from "react-spinners";
import ProductCard from "@/components/general/ProductCard";
type Props = {};

const WishlistForm = (props: Props) => {
  const [wishLists, setwishLists] = useState<any>(null);
  const { data: session }: any = useSession();
  const router = useRouter();
  const {
    isPending,
    isError,
    isSuccess,
    data: response,
    error,
  } = useQuery({
    queryKey: ["wishlists"],
    queryFn: () => UserGetWishlists(),
  });
  useEffect(() => {
    if (response?.data) {
      console.log(response?.data);
      setwishLists(response?.data);
    }
  }, [isSuccess, response]);

  useEffect(() => {
    if (isError) {
      console.log(error);
    }
  }, [isError, error]);
  return (
       
       <>  {isPending ? <p className="text-center w-full"> <ClipLoader /></p> : wishLists && wishLists?.length > 0 ? ( 
       <section
      id="wishlist-items-container"
      className={`grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-7`}
    >
     
       { wishLists?.map((item: Product, index: number) => (
          <div key={index} className="flex flex-col gap-2">
           
            <ProductCard
              item={item}
              index={index}
              
              nameOnly
              showPriceWhenNameOnly
              isLoading={isPending}
            />
            <p className="hidden cursor-pointer text-[12.8px] md:text-[14px] text-red-400">
              Remove
            </p>
          </div>
        ))
       }
    </section> ) : (
<p className="text-center">You&apos;ve no items in your wishlist </p>
)}
</>
  );
};

export default WishlistForm;
