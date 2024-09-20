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
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@react-hook/media-query";

type Props = {
  category?: string;
  searchFilterData: { tag: string; values: string[] }[] | [];
  setProductsAmount: React.Dispatch<React.SetStateAction<number>>;
};
type Checked = DropdownMenuCheckboxItemProps["checked"];

const DisplayProducts = ({
  category,
  searchFilterData,
  setProductsAmount,
}: Props) => {
  const [showStatusBar, setShowStatusBar] = React.useState<Checked>(true);
  const [showActivityBar, setShowActivityBar] = React.useState<Checked>(false);
  const [showPanel, setShowPanel] = React.useState<Checked>(false);
  const isMobile = useMediaQuery("only screen and (max-width: 768px)");
  const isTablet = useMediaQuery("only screen and (max-width: 1024px)");
  const [viewAs, setViewAs] = React.useState<number>(!isMobile ? 4 : 2);
  const [productsData, setProductsData] = React.useState([]);
  const router = useRouter();

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
      // console.log("data", response);
      setProductsAmount(response?.data?.length);
      // console.log(response?.data?.length);
      setProductsData(response?.data);
    }
    if (error) {
      console.log("error", error);
      router.push("/serverError");
    }
    if (!productsFromFilterIsError && productsFromFilterResponse?.data) {
      // console.log("data", productsFromFilterResponse);/
      setProductsAmount(productsFromFilterResponse?.data?.length);
      // console.log(productsFromFilterResponse?.data?.length);
      setProductsData(productsFromFilterResponse?.data);
    }
    if (productsFromFilterError) {
      console.log("error", productsFromFilterError);
      router.push("/serverError");
    }
  }, [
    isError,
    response,
    error,
    productsFromFilterIsError,
    productsFromFilterResponse,
    productsFromFilterError,
  ]);
  return (
    <div>
      <section
        id="basic-filter-setting"
        className="flex items-center justify-between w-full mb-7"
      >
        <section className="text-[14px] flex items-center gap-2">
          <h1 className="md:block hidden"> View as</h1>
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
          {!isMobile && (
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
          )}
        </section>
        <section>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <span className="md:w-44 cursor-pointer border p-3 py-[0.40rem] md:py-[0.65rem] rounded-sm text-[12px] md:text-[13px] border-gray-300 justify-between gap-6 inline-flex items-center ">
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
          : Array.from({ length: 10 }).map((_, index) => (
              <ProductCard
                item={null}
                index={index}
                key={index}
                isLoading={true}
              />
            ))}
      </section>
    </div>
  );
};

export default DisplayProducts;
