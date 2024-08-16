"use client";
import React, { useEffect } from "react";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Product } from "@/@types/products.d";
import ProductCard from "../general/ProductCard";
import { ChevronDown, RectangleVertical } from "lucide-react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  GetProductsByCategory,
  FetchProductsFromFilterData,
} from "@/serverlessActions/_fetchActions";
import { sampleProducts } from "./page/ProductPage";

type Props = {
  category?: string;
  searchFilterData: any;
};
type Checked = DropdownMenuCheckboxItemProps["checked"];

const DisplayProducts = ({ category, searchFilterData }: Props) => {
  const [showStatusBar, setShowStatusBar] = React.useState<Checked>(true);
  const [showActivityBar, setShowActivityBar] = React.useState<Checked>(false);
  const [showPanel, setShowPanel] = React.useState<Checked>(false);
  const [viewAs, setViewAs] = React.useState<number>(4);
  const [productsData,setProductsData] = React.useState([])

  const items = [
    {
      id: "23",
      name: "elementary magenta plain pure linen shirt",
      price: "$20.00",
      road: 84,
      sizes: ["S", "M", "L", "XL"],
      images: [
        "/items/elementary-magenta-plain-pure-linen-shirt1.webp",
        "/items/elementary-magenta-plain-pure-linen-shirt2.webp",
      ],
    },
    {
      id: "14",
      name: "Matteo Grey Checks Shirt",
      price: "$20.00",
      sizes: ["S", "M", "L", "XL"],
      images: [
        "/items/Matteo-Grey-Checks-Shirt-1.webp",
        "/items/matteo-grey-checks-shirt2.webp",
      ],
    },
    {
      id: "15",
      name: "Matteo Light Blue Checks Shirt",
      price: "$35.00",
      sizes: ["S", "M", "L"],
      images: [
        "/items/Matteo-Light-Blue-Checks-Shirt1.webp",
        "/items/Matteo-Light-Blue-Checks-Shirt2.webp",
      ],
    },
    {
      id: "16",
      name: "brush stroke red shirt",
      price: "$25.00",
      sizes: ["S", "M", "L"],
      images: [
        "/items/brush-stroke-red-shirt1.jpg",
        "/items/brush-stroke-red-shirt2.jpg",
      ],
    },
    {
      id: "17",
      name: "Carmine mauve knitted shirt",
      price: "$30.00",
      sizes: ["M", "L", "XL"],
      images: [
        "/items/carmine-mauve-knitted-shirt1.webp",
        "/items/carmine-mauve-knitted-shirt2.webp",
      ],
    },
    {
      id: "27",
      name: "Box Stripe Black Shirt",
      price: "$35.00",
      sizes: ["S", "L", "XXL"],

      images: [
        "/items/matteo-grey-checks-shirt2.webp",
        "/items/Matteo-Grey-Checks-Shirt-1.webp",
      ],
    },

    {
      id: "28",
      name: "Double Cuff Royal Blue Shirt",
      price: "$40.00",
      sizes: ["S", "M", "XL"],
      images: [
        "/items/carmine-mauve-knitted-shirt2.webp",
        "/items/carmine-mauve-knitted-shirt1.webp",
      ],
    },
    {
      id: "29",
      name: "Doric Red Shirt",
      price: "$30.00",
      sizes: ["S", "M", "XL", "XXL"],
      images: [
        "/items/elementary-magenta-plain-pure-linen-shirt2.webp",
        "/items/elementary-magenta-plain-pure-linen-shirt1.webp",
      ],
    },
    {
      id: "30",
      name: "Matteo Grey Checks Shirt",
      price: "$45.00",
      sizes: ["M", "L"],
      images: [
        "/items/Matteo-Light-Blue-Checks-Shirt1.webp",
        "/items/Matteo-Light-Blue-Checks-Shirt2.webp",
      ],
    },
    {
      id: "31",
      name: "Box Stripe White Shirt",
      price: "$45.00",
      sizes: ["M", "L"],
      images: [
        "/items/brush-stroke-red-shirt2.jpg",
        "/items/brush-stroke-red-shirt1.jpg",
      ],
    },
  ];

  // const queryClient = useQueryClient()

  // Queries
  //   const { isPending, isError, data, error } = useQuery({
  //     queryKey: ["products"],
  //     queryFn: insertSampleProducts,
  //   });
  //  console.log(data);
  const {
    isPending,
    isError,
    data: response,
    error,
    mutate: server_getProductsByCategory,
  } = useMutation({
    mutationFn: GetProductsByCategory,
  });
  const {
    isPending: productsFromFilterIsPending,
    isError: productsFromFilterIsError,
    data: productsFromFilterResponse,
    error: productsFromFilterError,
    mutate: server_fetchProductsFromFilterData,
  } = useMutation({
    mutationFn: FetchProductsFromFilterData,
  });
  //  server_insertSampleProducts()
  //console.log(data);
  //const { isOpen, open, close } = useDropdownMenu({ id: "basic-filter-setting" });

  // console.log(data)
  useEffect(() => {
    if (category && category !== "") {
      server_getProductsByCategory(category);
    } else if (searchFilterData && searchFilterData.length > 0) {
      server_fetchProductsFromFilterData(searchFilterData);
    } else {
      server_fetchProductsFromFilterData([]);
    }
  }, []);
  useEffect(() => {
    if (!isError && response?.data) {
      console.log("data", response);
      setProductsData(response?.data)
    }
    if (error) {
      console.log("error", error);
    }
    if (!productsFromFilterIsError && productsFromFilterResponse?.data) {
      console.log("data", productsFromFilterResponse);
      setProductsData(productsFromFilterResponse?.data)
    }
    if ( productsFromFilterError) {
      console.log("error",  productsFromFilterError);
    }
  }, [isError, response, error,productsFromFilterIsError,productsFromFilterResponse, productsFromFilterError]);
  return (
    <div>
      <section
        id="basic-filter-setting"
        className="flex items-center justify-between w-full mb-7"
      >
        <section className="text-[14px] flex items-center gap-2">
          <h1> View as</h1>
          <span
            className="flex border p-[0.15rem] cursor-pointer"
            onClick={() => setViewAs(2)}
          >
            <RectangleVertical
              fill={viewAs === 2 ? "black" : "gray"}
              stroke={""}
              width={18}
            />
            <RectangleVertical
              fill={viewAs === 2 ? "black" : "gray"}
              stroke={""}
              width={18}
            />
          </span>
          <span
            className="flex border   p-[0.15rem] cursor-pointer"
            onClick={() => setViewAs(3)}
          >
            <RectangleVertical
              fill={viewAs === 3 ? "black" : "gray"}
              stroke={""}
              width={18}
            />
            <RectangleVertical
              fill={viewAs === 3 ? "black" : "gray"}
              stroke={""}
              width={18}
            />
            <RectangleVertical
              fill={viewAs === 3 ? "black" : "gray"}
              stroke={""}
              width={18}
            />
          </span>
          <span
            className="flex border   p-[0.15rem] cursor-pointer"
            onClick={() => setViewAs(4)}
          >
            <RectangleVertical
              fill={viewAs === 4 ? "black" : "gray"}
              stroke={""}
              width={18}
            />
            <RectangleVertical
              fill={viewAs === 4 ? "black" : "gray"}
              stroke={""}
              width={18}
            />
            <RectangleVertical
              fill={viewAs === 4 ? "black" : "gray"}
              stroke={""}
              width={18}
            />
            <RectangleVertical
              fill={viewAs === 4 ? "black" : "gray"}
              stroke={""}
              width={18}
            />
          </span>
        </section>
        <section>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <span className="w-44 cursor-pointer border p-3 py-[0.65rem] rounded-sm text-[13px] border-gray-300 justify-between gap-6 inline-flex items-center ">
                Sort <ChevronDown size={18} />
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Sort</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={showStatusBar}
                onCheckedChange={setShowStatusBar}
              >
                Newest
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={showActivityBar}
                onCheckedChange={setShowActivityBar}
              >
                Oldest
              </DropdownMenuCheckboxItem>
              {/* <DropdownMenuCheckboxItem
                checked={showPanel}
                onCheckedChange={setShowPanel}
              >
                
              </DropdownMenuCheckboxItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        </section>
      </section>
      <section
        id="products"
        className={`grid grid-cols-${viewAs} gap-x-4 gap-y-7`}
      >
        {productsData.length > 0
          ? productsData.map((item: Product, index: number) => (
              <ProductCard
                item={item}
                index={index}
                key={index}
                isLoading={isPending || productsFromFilterIsPending}
              />
            ))
          : sampleProducts.map((item, index) => (
              <ProductCard
                item={item}
                index={index}
                key={index}
                isLoading={isPending || productsFromFilterIsPending}
              />
            ))}
      </section>
    </div>
  );
};

export default DisplayProducts;
