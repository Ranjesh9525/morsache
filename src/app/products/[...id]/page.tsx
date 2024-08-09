import HomeLayout from "@/components/layouts/HomeLayout";
import { Button } from "@/components/ui/button";
import { Heart, StarIcon } from "lucide-react";
import Image from "next/image";
import React from "react";
import { CiDiscount1 } from "react-icons/ci";
import { FaCartPlus, FaCartShopping } from "react-icons/fa6";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import RecentlyViewed from "@/components/general/RecentlyViewed";
import ProductGallery from "@/components/products/ProductGallery";
import ProductInfo from "@/components/products/ProductInfo";
import Recommendation from "@/components/products/Recommendation";
import ProductPage from "@/components/products/page/ProductPage";

type Props = {
  params: { id: string };
};
// id: "1",
// name: "Product 1",
// description: "Description for Product 1",
// category: "Category 1",
// price: 50,
// slug: "product-1",
// sizes: ["S", "M", "L"],
// colors: ["Red", "Blue"],
// images: [
//   "/items/elementary-magenta-plain-pure-linen-shirt1.webp",
//   "/items/elementary-magenta-plain-pure-linen-shirt2.webp",
// ],
// rating: 4.5,
// stock: 100,
// isFeatured: true,

const page = ({ params }: Props) => {
  // console.log(params?.id);
  return (
    <HomeLayout
      title={`Buy ${params.id.toString().replaceAll("-", " ")} - Morsache`}
    >
      <ProductPage slug={params.id.toString()} />
      <div id="recently-viewed">
        <RecentlyViewed />
      </div>
    </HomeLayout>
  );
};

export default page;
