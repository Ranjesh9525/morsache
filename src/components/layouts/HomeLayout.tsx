"use client";
import React, { useState, useRef } from "react";
import Footer from "../general/footer/Footer";
import Navbar from "../general/navbar/Navbar";
import Sidebar from "../general/navbar/Sidebar";
import HeaderAds from "../home/HeaderAds";
import { useScroll, useMotionValueEvent } from "framer-motion";

type Props = {
  children: React.ReactNode;
};

const HomeLayout = (props: Props) => {
  const [scrolling, setScrolling] = useState<boolean>(false);
  const [sideNav, setSideNav] = useState({
    open: false,
  });
  const ref = useRef(null);
  const { scrollY, scrollYProgress } = useScroll({
    container: ref,
  });

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 230) setScrolling(true);
    if (latest < 230) setScrolling(false);
  });

  return (
    <div>
      <Sidebar sideNav={sideNav} setSideNav={setSideNav} />
      <div className="min-h-screen w-full relative">
        <HeaderAds />
        <Navbar scrolling={scrolling} setSideNav={setSideNav} />
        <main className="relative ">{props.children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default HomeLayout;
