"use client";
import React, { useCallback } from "react";
import { EmblaOptionsType, EmblaCarouselType } from "embla-carousel";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";

// type PropType = {
//   slides: string[];
//   options?: EmblaOptionsType;
// };

type Props = {};

const HeaderAds = (props: Props) => {
  // const { slides, options } = props;
  const options: EmblaOptionsType = { loop: true, duration: 20 };
  const slides = ["ieniverpv", "weorvoerv", "vrververver"];
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay()]);

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
    <section className="embla">
      <div className="overflow-hidden !relative h-[40px]" ref={emblaRef}>
        <div className="embla__container bg-primary-dark">
          {slides.map((item: string, index: number) => (
            <div
              className="transform   translate-x-0 translate-y-0  translate-z-0 flex-shrink-0 text-white flex flex-col md:flex-row md:items-center uppercase tracking-wider justify-center items-center md:text-[11.5px] text-center text-[0.55rem] p-3 flex-grow-0 flex-basis-[100%] bg-primary-dark w-screen h-[40px] "
              key={index}
            >
              {/* <div className="embla__slide__number">{index + 1}</div> */}
              {/* <Image src={item} alt={"img" + index} fill className="object-cover " /> */}
              Get 50% off on your first purchase {item}
              <Link href={"/search"} className="underline ml-2 cursor-pointer">
                Click here to begin
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeaderAds;
