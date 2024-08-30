"use client";
import Image from "next/image";
import React, { useState } from "react";
import EmblaCarousel from "./carousel/ImageGalleryCarousel";
import { EmblaOptionsType } from "embla-carousel";
// import './carousel/ImageGalleryStyle.css'

type Props = {
  product: any;
};

{
  /* 
i

 */
}

const ProductGallery = ({ product }: Props) => {
  // const OPTIONS: EmblaOptionsType = { axis: 'y' }
  // const SLIDE_COUNT = 5
  // const SLIDES = Array.from(Array(SLIDE_COUNT).keys())
  const [imageIndex, setImageIndex] = useState(0);
  return (
    <div id="product-gallery" className=" relative ">
      <div className="md:grid md:grid-cols-5 flex flex-col-reverse gap-2 mb-6 md:mb-0 sticky top-0">
        <section className="md:col-span-1  flex md:flex-col gap-6 md:pl-5 ">
          {product?.images.map((item: string, index: number) => {
            return (
              <Image
                key={index}
                src={item}
                alt=""
                width={80}
                height={200}
                className={`cursor-pointer ${
                  imageIndex === index && "border-2 border-black"
                } `}
                onClick={() => setImageIndex(index)}
              />
            );
          })}
        </section>
        <section className="md:col-span-4 row-span-4 pr-5">
          <Image
            src={product?.images[imageIndex]}
            alt=""
            width={700}
            height={400}
            className="cursor-zoom-in"
          />
          {/* <EmblaCarousel slides={SLIDES} options={OPTIONS} /> */}
        </section>
      </div>
    </div>
  );
};

export default ProductGallery;
