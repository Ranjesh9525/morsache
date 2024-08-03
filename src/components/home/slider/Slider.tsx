import React from "react";
import Carousel from "./Carousel";
import { EmblaOptionsType } from "embla-carousel";

type Props = {};

const Slider = (props: Props) => {
  const OPTIONS: EmblaOptionsType = { loop: true };
  const SLIDE_COUNT = 5;
  const SLIDES = Array.from(Array(SLIDE_COUNT).keys());
  const images = [
    "/slide/Slide1.jpg",
    "/slide/Slide2.jpg",
    "/slide/Slide3.jpg",
  ];
  // console.log(SLIDES)
  return (
    <div className="">
      <Carousel slides={images} options={OPTIONS} />
    </div>
  );
};

export default Slider;
