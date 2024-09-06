"use client";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { EmblaOptionsType, EmblaCarouselType } from "embla-carousel";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";
import { StoreContext } from "@/context/storeContext";
import { SlidingOffer } from "@/app/admin/store/sliding-offers/page";

// type PropType = {
//   slides: string[];
//   options?: EmblaOptionsType;
// };

type Props = {};

const HeaderAds = (props: Props) => {
  const {
    store,
    storeDataIsPending,
    storeDataError,
    storeDataIsError,
    refetchStoreData,
  } = useContext(StoreContext)!;
  const options: EmblaOptionsType = { loop: true, duration: 20 };
  const [offers, setOffers] = useState<SlidingOffer[] | null>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay()]);
  useEffect(() => {
    if (store) {
      setOffers(store?.slidingOffers);
    }
  }, [store]);
  // const onNavButtonClick = useCallback((emblaApi: EmblaCarouselType) => {
  //   const autoplay = emblaApi?.plugins()?.autoplay;
  //   if (!autoplay) return;

  //   const resetOrStop =
  //     autoplay.options.stopOnInteraction === false
  //       ? autoplay.reset
  //       : autoplay.stop;

  //   resetOrStop();
  // }, []);

  // const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(
  //   emblaApi,
  //   onNavButtonClick
  // );

  return (
    <section>
      {offers && offers.length > 0 ? (
        <section className="embla my-10">
          <div className="overflow-hidden !relative h-[40px]" ref={emblaRef}>
            <div className="embla__container bg-primary-dark">
              {offers.map((item: SlidingOffer, index: number) => (
                <div
                  className="transform   translate-x-0 translate-y-0  translate-z-0 flex-shrink-0 text-white flex flex-col md:flex-row md:items-center uppercase tracking-wider justify-center items-center md:text-[11.5px] text-center text-[0.55rem] p-3 flex-grow-0 flex-basis-[100%] bg-primary-dark w-screen h-[40px] "
                  key={index}
                >
                  {item.offerTitle}
                  {item?.link && (
                    <Link
                      href={item?.link || "/"}
                      className="underline ml-2 cursor-pointer"
                 
                    >
                      {item?.linkTitle || ""}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <div className="overflow-hidden !relative h-[40px] w-full bg-primary-dark">
          <div className="embla__container h-full bg-primary-dark "></div>
        </div>
      )}
    </section>
  );
};

export default HeaderAds;
