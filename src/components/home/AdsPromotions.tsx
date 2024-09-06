"use client";
import { StoreContext } from "@/context/storeContext";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";

type Props = {};

const AdsPromotions = (props: Props) => {
  const [image, setImage] = useState<string | null>(null);
  const {
    store,
    storeDataIsPending,
    storeDataError,
    storeDataIsError,
    refetchStoreData,
  } = useContext(StoreContext)!;

  useEffect(() => {
    if (store) {
      setImage(store?.offerImage);
    }
  }, [store]);
  return (
    <>
      {storeDataIsPending ? (
        <div className="mx-9 w-full h-[70vh]"></div>
      ) : (
        <div className="px-9">
          {/* <Carousel slides={images} options={OPTIONS} /> */}
          <section className=" my-12 ">
            {image && (
              <div className="cursor-pointer w-full h-full">
                <Image
                  src={image}
                  alt=""
                  width={1000}
                  height={1000}
                  className="w-full cursor-pointer object-cover h-full"
                />
              </div>
            )}
          </section>
        </div>
      )}
    </>
  );
};

export default AdsPromotions;
