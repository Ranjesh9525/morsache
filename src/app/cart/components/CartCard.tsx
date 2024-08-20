"use client";
import { CartItem } from "@/@types/cart";
import { Skeleton } from "@/components/ui/skeleton";
import { FetchSingleProductByIdOptimized } from "@/serverlessActions/_fetchActions";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";

type Props = {
  product: any;
};

const CartCard = ({ product }: Props) => {
  const {
    isPending,
    isError,
    data: response,
    error,
    mutate: server_fetchProduct,
  } = useMutation({ mutationFn: FetchSingleProductByIdOptimized });

  useEffect(() => {
    server_fetchProduct(product.productId);
  }, []);
  useEffect(() => {
    if (isError) {
      console.log(error);
    }
  }, [isError]);
  return (
    <>
      {response?.data ? (
        <div className="flex gap-2 mb-2 cursor-pointer">
          <section>
            <Image
              src={response?.data?.images[0] || ""}
              alt={response?.data?.name}
              width={65}
              height={65}
            />
          </section>
          <section>
            <h1 className="font-medium">{response?.data?.name}</h1>

           

            <span className="grid grid-cols-2 gap-1 text-[14px] ">
            <p className="text-[14px] text-grey-500">
              SKU:{response?.data?.SKU}
            </p>
              {product?.variant && <p>variant: {product?.variant}</p>}
              {product?.size && <p>size: {product?.size}</p>}
                <p>quantity:{product?.quantity}</p>
              {/* <Link
                  href={`/products/${?.slug}`}
                  className="text-[#545454] cursor-pointer hover:text-[#545454]/80"
                >
                  View Details
                </Link> */}
            </span>
          </section>
        </div>
      ) : (
        <div className="relative flex  gap-6">
          <Skeleton className="h-[110px] w-[80px] rounded-lg mb-3 bg-gray-300" />
          <div>
            <Skeleton className="h-[15px] w-[160px] bg-gray-200 mb-1 rounded-lg" />
            <Skeleton className="h-[15px] w-full bg-gray-200 mb-2 rounded-lg" />
            <Skeleton className="h-[32px] w-full bg-gray-200 mb-2 rounded-lg" />
            <Skeleton className="h-[15px] w-[200px] bg-gray-200 mb-1 rounded-lg" />
          </div>
        </div>
      )}
    </>
  );
};

export default CartCard;
