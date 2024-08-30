"use client";
import React, { useEffect, useState } from "react";
import ProductGallery from "../ProductGallery";
import ProductInfo from "../ProductInfo";
import Recommendation from "../Recommendation";
import { Offer, Product } from "@/@types/products.d";
import { redirect } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { FetchSingleProduct } from "@/serverlessActions/_fetchActions";
import { ClipLoader } from "react-spinners";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  slug: string;
};

function generateRandomTitle() {
  const titles = [
    "Special Offer",
    "Discount Deal",
    "Limited Time Offer",
    "Big Sale",
    "Seasonal Discount",
  ];
  return titles[Math.floor(Math.random() * titles.length)];
}

function generateRandomDescription() {
  const descriptions = [
    "Great discount on selected items",
    "Buy one get one free",
    "Exclusive offer for members",
  ];
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

function generateRandomImage() {
  const images = [
    "https://picsum.photos/200",
    "https://picsum.photos/250",
    "https://picsum.photos/260",
    "https://picsum.photos/270",
    "https://picsum.photos/190",
    "https://picsum.photos/220",
    "https://picsum.photos/240",
    "https://picsum.photos/230",
  ];
  return images[Math.floor(Math.random() * images.length)];
}

function generateRandomOffer(numberOfOffers: number): Offer[] {
  function offers() {
    return {
      title: generateRandomTitle(),
      id: Math.random().toString(36).substring(2, 9),
      description: generateRandomDescription(),
      description2: "Additional description here",
      discount: Math.floor(Math.random() * 51).toString(), // Generate random discount between 0 and 50
      code: Math.random().toString(36).substring(2, 9),
      image: generateRandomImage(),
      quantityEffect: (Math.floor(Math.random() * 10) + 1).toString(), // Generate random quantity effect between 1 and 10
      effect: ["flat", "percentage", "quantity"][
        Math.floor(Math.random() * 3)
      ] as "flat" | "percentage" | "quantity",
      active: Math.random() > 0.5, // Randomly set active to true or false
    };
  }
  const randomOffers: Offer[] = Array.from({ length: numberOfOffers }, offers);
  return randomOffers;
}

// Generate multiple random offers
// Define the number of random offers to generate

// console.log(randomOffers);
export const sampleProducts: Product[] = [
  {
    id: "23",
    name: "elementary magenta plain pure linen shirt",
    description: "Description for elementary magenta plain pure linen shirt",
    price: " 20.0",
    offers: generateRandomOffer(5),
    category: ["tshirt", "plain"],
    tags: [
      "tshirt",
      "casual",
      "unisex",
      "magenta",
      "plain",
      "pure",
      "linen",
      "summer",
    ],
    variants: [
      {
        variant: "red",
        image: "/items/elementary-magenta-plain-pure-linen-shirt2.webp",
      },
      {
        variant: "blue",
        image: "/items/elementary-magenta-plain-pure-linen-shirt2.webp",
      },
      {
        variant: "green",
        image: "/items/elementary-magenta-plain-pure-linen-shirt2.webp",
      },
      {
        variant: "black",
        image: "/items/elementary-magenta-plain-pure-linen-shirt2.webp",
      },
      {
        variant: "white",
        image: "/items/elementary-magenta-plain-pure-linen-shirt2.webp",
      },
    ],
    slug: "elementary-magenta-plain-pure-linen-shirt",

    stock: "13",
    purchaseQuantity: 10,
    SKU: "PQWONEFK",
    sizes: ["S", "M", "L", "XL"],
    images: [
      "/items/elementary-magenta-plain-pure-linen-shirt1.webp",
      "/items/elementary-magenta-plain-pure-linen-shirt2.webp",
    ],
  },
  {
    id: "14",
    name: "Matteo Grey Checks Shirt",
    price: " 20.0",
    offers: generateRandomOffer(5),
    category: ["tshirt", "casual", "unisex"],
    stock: "100",

    SKU: "CSBDWONUDF",
    slug: "matteo-grey-checks-shirt",
    description: "Description for Matteo Grey Checks Shirt",
    purchaseQuantity: 10,
    variants: [
      { variant: "grey", image: "/items/matteo-grey-checks-shirt2.webp" },
      { variant: "orange", image: "/items/matteo-grey-checks-shirt2.webp" },
      { variant: "white", image: "/items/matteo-grey-checks-shirt2.webp" },
    ],
    tags: ["polo", "casual", "unisex", "checks", "regular"],
    sizes: ["S", "M", "L", "XL"],
    images: [
      "/items/Matteo-Grey-Checks-Shirt-1.webp",
      "/items/matteo-grey-checks-shirt2.webp",
    ],
  },
  {
    id: "15",
    name: "Matteo Light Blue Checks Shirt",
    price: " 35.0",
    sizes: ["S", "M", "L"],
    offers: generateRandomOffer(5),
    category: ["tshirt", "casual", "unisex"],
    stock: "100",

    SKU: "MCALSKDWPD",
    slug: "matteo-light-blue-checks-shirt",
    description: "Description for Matteo Light Blue Checks Shirt",
    purchaseQuantity: 10,
    variants: [
      { variant: "blue", image: "/items/Matteo-Light-Blue-Checks-Shirt2.webp" },
      {
        variant: "yellow",
        image: "/items/Matteo-Light-Blue-Checks-Shirt2.webp",
      },
      { variant: "red", image: "/items/Matteo-Light-Blue-Checks-Shirt2.webp" },
      {
        variant: "black",
        image: "/items/Matteo-Light-Blue-Checks-Shirt2.webp",
      },
    ],
    tags: ["polo", "casual", "unisex", "checks", "oversize"],
    images: [
      "/items/Matteo-Light-Blue-Checks-Shirt1.webp",
      "/items/Matteo-Light-Blue-Checks-Shirt2.webp",
    ],
  },
  {
    id: "16",
    name: "brush stroke red shirt",
    price: " 25.0",
    sizes: ["S", "M", "L"],
    offers: generateRandomOffer(3),
    category: ["tshirt", "casual", "unisex"],
    stock: "100",

    SKU: "VDJSOWNEAL",
    slug: "brush-stroke-red-shirt",
    description: "Description for Matteo Light Blue Checks Shirt",
    purchaseQuantity: 10,
    variants: [
      { variant: "blue", image: "/items/brush-stroke-red-shirt1.jpg" },
      { variant: "black", image: "/items/brush-stroke-red-shirt1.jpg" },
    ],
    tags: ["polo", "casual", "unisex", "checks", "oversize"],
    images: [
      "/items/brush-stroke-red-shirt1.jpg",
      "/items/brush-stroke-red-shirt2.jpg",
    ],
  },
  {
    id: "17",
    name: "Carmine mauve knitted shirt",
    price: " 30.0",
    offers: generateRandomOffer(5),
    category: ["tshirt", "plain"],
    tags: [
      "tshirt",
      "casual",
      "unisex",
      "magenta",
      "plain",
      "pure",
      "linen",
      "summer",
    ],
    description:
      " Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores necessitatibus temporibus omnis natus exercitationem, animi optio placeat officiis vero illum ut, tempora quis modi atque nisi reprehenderit laborum veritatis recusandae? ",
    variants: [
      { variant: "red", image: "/items/carmine-mauve-knitted-shirt2.webp" },
      { variant: "blue", image: "/items/carmine-mauve-knitted-shirt2.webp" },
      { variant: "green", image: "/items/carmine-mauve-knitted-shirt2.webp" },
      { variant: "black", image: "/items/carmine-mauve-knitted-shirt2.webp" },
    ],
    slug: "carmine-mauve-knitted-shirt",

    stock: "13",
    purchaseQuantity: 10,
    SKU: "JWENEPWMQ",
    sizes: ["M", "L", "XL"],
    images: [
      "/items/carmine-mauve-knitted-shirt1.webp",
      "/items/carmine-mauve-knitted-shirt2.webp",
    ],
  },
  {
    id: "27",
    name: "Box Stripe Black Shirt",
    price: " 35.0",
    offers: generateRandomOffer(4),
    category: ["tshirt", "plain"],
    tags: [
      "tshirt",
      "casual",
      "unisex",
      "magenta",
      "plain",
      "pure",
      "linen",
      "summer",
    ],
    variants: [
      { variant: "red", image: "/items/Matteo-Grey-Checks-Shirt-1.webp" },
      { variant: "blue", image: "/items/Matteo-Grey-Checks-Shirt-1.webp" },
      { variant: "green", image: "/items/Matteo-Grey-Checks-Shirt-1.webp" },
      { variant: "black", image: "/items/Matteo-Grey-Checks-Shirt-1.webp" },
    ],
    slug: "box-stripe-black-shirt",

    stock: "13",
    purchaseQuantity: 10,
    SKU: "MQWKEEMFEC",
    sizes: ["S", "L", "XXL"],
    description:
      " Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores necessitatibus temporibus omnis natus exercitationem, animi optio placeat officiis vero illum ut, tempora quis modi atque nisi reprehenderit laborum veritatis recusandae? ",
    images: [
      "/items/matteo-grey-checks-shirt2.webp",
      "/items/Matteo-Grey-Checks-Shirt-1.webp",
    ],
  },

  {
    id: "28",
    name: "Double Cuff Royal Blue Shirt",
    price: " 40.0",
    description:
      " Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores necessitatibus temporibus omnis natus exercitationem, animi optio placeat officiis vero illum ut, tempora quis modi atque nisi reprehenderit laborum veritatis recusandae? ",
    offers: generateRandomOffer(5),
    category: ["tshirt", "plain"],
    tags: [
      "tshirt",
      "casual",
      "unisex",
      "magenta",
      "plain",
      "pure",
      "linen",
      "summer",
    ],
    variants: [
      { variant: "red", image: "/items/carmine-mauve-knitted-shirt2.webp" },
      { variant: "blue", image: "/items/carmine-mauve-knitted-shirt2.webp" },
      { variant: "green", image: "/items/carmine-mauve-knitted-shirt2.webp" },
      { variant: "black", image: "/items/carmine-mauve-knitted-shirt2.webp" },
    ],
    slug: "double-cuff-royal-blue-shirt",

    stock: "13",
    purchaseQuantity: 10,
    SKU: "KRMNWDD",
    sizes: ["S", "M", "XL"],
    images: [
      "/items/carmine-mauve-knitted-shirt2.webp",
      "/items/carmine-mauve-knitted-shirt1.webp",
    ],
  },
  {
    id: "29",
    name: "Doric Red Shirt",
    price: " 30.0",
    offers: generateRandomOffer(5),
    category: ["tshirt", "plain"],
    tags: [
      "tshirt",
      "casual",
      "unisex",
      "magenta",
      "plain",
      "pure",
      "linen",
      "summer",
    ],
    variants: [
      {
        variant: "grey",
        image: "/items/elementary-magenta-plain-pure-linen-shirt2.webp",
      },
      {
        variant: "orange",
        image: "/items/elementary-magenta-plain-pure-linen-shirt2.webp",
      },
      {
        variant: "white",
        image: "/items/elementary-magenta-plain-pure-linen-shirt2.webp",
      },
      {
        variant: "red",
        image: "/items/elementary-magenta-plain-pure-linen-shirt2.webp",
      },
      {
        variant: "black",
        image: "/items/elementary-magenta-plain-pure-linen-shirt2.webp",
      },
    ],
    slug: "doric-red-shirt",

    stock: "13",
    purchaseQuantity: 10,
    SKU: "NMMLECOD",
    sizes: ["S", "M", "XL", "XXL"],
    images: [
      "/items/elementary-magenta-plain-pure-linen-shirt2.webp",
      "/items/elementary-magenta-plain-pure-linen-shirt1.webp",
    ],
    description:
      " Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores necessitatibus temporibus omnis natus exercitationem, animi optio placeat officiis vero illum ut, tempora quis modi atque nisi reprehenderit laborum veritatis recusandae? ",
  },
  {
    id: "30",
    name: "Matteo Grey Checks Shirt",
    price: " 45.0",
    offers: generateRandomOffer(5),
    category: ["tshirt", "plain"],
    description:
      " Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores necessitatibus temporibus omnis natus exercitationem, animi optio placeat officiis vero illum ut, tempora quis modi atque nisi reprehenderit laborum veritatis recusandae? ",
    SKU: "SPMEINI",
    tags: [
      "tshirt",
      "casual",
      "unisex",
      "magenta",
      "plain",
      "pure",
      "linen",
      "summer",
    ],
    variants: [
      { variant: "blue", image: "/items/Matteo-Light-Blue-Checks-Shirt1.webp" },
      {
        variant: "white",
        image: "/items/Matteo-Light-Blue-Checks-Shirt1.webp",
      },
      { variant: "red", image: "/items/Matteo-Light-Blue-Checks-Shirt1.webp" },
      {
        variant: "black",
        image: "/items/Matteo-Light-Blue-Checks-Shirt1.webp",
      },
    ],
    slug: "matteo-grey-checks-shirt-2",

    stock: "13",
    purchaseQuantity: 10,

    sizes: ["M", "L"],
    images: [
      "/items/Matteo-Light-Blue-Checks-Shirt1.webp",
      "/items/Matteo-Light-Blue-Checks-Shirt2.webp",
    ],
  },
  {
    id: "31",
    name: "Box Stripe White Shirt",
    description:
      " Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores necessitatibus temporibus omnis natus exercitationem, animi optio placeat officiis vero illum ut, tempora quis modi atque nisi reprehenderit laborum veritatis recusandae? ",
    price: " 45.0",
    offers: generateRandomOffer(5),
    category: ["tshirt", "plain"],
    tags: [
      "tshirt",
      "casual",
      "unisex",
      "magenta",
      "plain",
      "pure",
      "linen",
      "summer",
    ],
    variants: [
      { variant: "blue", image: "/items/brush-stroke-red-shirt2.jpg" },
      { variant: "white", image: "/items/brush-stroke-red-shirt2.jpg" },
      { variant: "red", image: "/items/brush-stroke-red-shirt2.jpg" },
      { variant: "green", image: "/items/brush-stroke-red-shirt2.jpg" },
      { variant: "black", image: "/items/brush-stroke-red-shirt2.jpg" },
    ],
    SKU: "SPMECOD",
    slug: "box-stripe-white-shirt",

    stock: "13",
    purchaseQuantity: 10,

    sizes: ["M", "L"],
    images: [
      "/items/brush-stroke-red-shirt2.jpg",
      "/items/brush-stroke-red-shirt1.jpg",
    ],
  },
];
export const saveRecentlyViewedProduct = (product: any) => {
  if (product) {
    const recent = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");

    // Check if the product is already in the list of recently viewed products
    const index = recent.findIndex((item: any) => item.id === product.id);
    if (index !== -1) {
      // If product is already in the list, update viewedOn and bring it to the top
      recent[index].viewedOn = Date.now();
      const updatedRecentlyViewed = [
        recent[index],
        ...recent.slice(0, index),
        ...recent.slice(index + 1),
      ];
      localStorage.setItem(
        "recentlyViewed",
        JSON.stringify(updatedRecentlyViewed)
      );
    } else {
      // If product is not in the list.. add it to the top
      product.viewedOn = Date.now();
      const updatedRecentlyViewed = [product, ...recent];
      localStorage.setItem(
        "recentlyViewed",
        JSON.stringify(updatedRecentlyViewed)
      );
    }
  }
  return null;
};
const ProductPage = ({ slug }: Props) => {
  const [product, setProduct] = useState<Product | null>(null);
  // console.log(slug)
  const {
    isPending,
    isError,
    isSuccess,
    data: response,
    error,
    mutate: server_fetchProduct,
  } = useMutation({
    mutationFn: FetchSingleProduct,
  });
  useEffect(() => {
    server_fetchProduct(slug);
  }, []);

  useEffect(() => {
    if (response) {
      setProduct(response.data);
      // console.log(response);
    }
    if (isError) {
      console.log(error);
      redirect("/404");
    }
  }, [isError, isSuccess, response]);

  // if (!product && !isPending) {
  //   redirect("/404");
  // }
  useEffect(() => {
    if (product) {
      saveRecentlyViewedProduct(product);
    }
  }, [product]);
  return (
    <>
      {product ? (
        <>
          <div className="grid md:grid-cols-2 md:p-9 p-5 min-h-screen gap-x-16 !mt-5">
            <ProductGallery product={product!} />
            <ProductInfo product={product!} />
          </div>
          <Recommendation tags={product!?.tags!} />
        </>
      ) : (
        <div className="grid md:grid-cols-2 md:p-9 p-5 min-h-screen gap-x-16 !mt-5 bg-white">
          <div className="relative flex gap-3">
            <div className="flex flex-col gap-4 flex-[3]">
              <Skeleton className="h-[160px] w-[100%]  rounded-lg" />
              <Skeleton className="h-[160px] w-[100%] rounded-lg" />{" "}
            </div>
            <Skeleton className="h-[450px] w-full rounded-lg flex-[9]" />
          </div>
          <div className="relative flex flex-col">
            <Skeleton className="h-[50px] w-full rounded-lg" />
            <Skeleton className="h-[30px] w-[160px] my-3 rounded-lg" />
            <Skeleton className="h-[30px] w-full my-3 rounded-lg" />
            <Skeleton className="h-[60px] mt-6 w-[40%] rounded-lg" />
            <Skeleton className="h-[60px] mt-2 w-[40%] rounded-lg" />
            <Skeleton className="h-[60px] mt-2 w-[40%] rounded-lg" />
            <Skeleton className="h-[60px] mb-6 mt-2 w-[40%] rounded-lg" />
            <Skeleton className="h-[41px] w-full rounded-lg" />
            <Skeleton className="h-[41px] mt-3 w-full rounded-lg" />
          </div>
        </div>
      )}
    </>
  );
};

export default ProductPage;
