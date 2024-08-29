"use client";
import React, { useContext, useEffect, useState } from "react";
import Carousel from "./Carousel";
import { EmblaOptionsType } from "embla-carousel";
import { StoreContext } from "@/context/storeContext";

type Props = {};

const Slider = (props: Props) => {
  const {
    store,
    storeDataIsPending,
    storeDataError,
    storeDataIsError,
    refetchStoreData,
  } = useContext(StoreContext)!;
  const OPTIONS: EmblaOptionsType = { loop: true };
  const SLIDE_COUNT = 5;
  const SLIDES = Array.from(Array(SLIDE_COUNT).keys());
  const [images, setImages] = useState<string[] | null>(null);

  useEffect(() => {
    if (store) {
      setImages(store.carouselImages);
    }
  }, [store]);

  return (
    <div className="">
      {storeDataIsPending && !images ? (
        <div className="embla__viewport !relative lg:h-[120vh] md:h-[60vh] h-[40vh]">
          <div className="embla__container ">
            <div
              className="embla__slide lg:h-[120vh] md:h-[60vh] h-[40vh]"
            ></div>
          </div>
        </div>
      ) : (
        <Carousel slides={images!} options={OPTIONS} />
      )}
    </div>
  );
};

export default Slider;
