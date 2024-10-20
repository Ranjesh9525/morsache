"use client";
import React, { useState, useRef,useEffect, useContext } from "react";
import Footer from "../general/footer/Footer";
import Navbar from "../general/navbar/Navbar";
import Sidebar from "../general/navbar/Sidebar";
import HeaderAds from "../home/HeaderAds";
import { useScroll, useMotionValueEvent } from "framer-motion";
import Heading from "@/utilities/Heading";
import { useToast } from "../ui/use-toast";
import { useSearchParams } from "next/navigation";
import { GlobalContext } from "@/context/globalContext";

type Props = {
  children: React.ReactNode;
  title:string;
  description?:string;
  keywords?:string
};
  export const Exceptions = [
    {
        title: "404 Not Found",
        description: "The server can't find the requested resource. This could be due to a mistyped URL, a removed page, or a resource that is temporarily unavailable."
    },
    {
        title: "400 Bad Request",
        description: "The server cannot process the request due to a client error, such as invalid syntax or missing required parameters in the request."
    },
    {
        title: "500 Internal Server Error",
        description: "The server encountered an unexpected condition that prevented it from fulfilling the request."
    },
    {
        title: "401 Unauthorized",
        description: "The request requires user authentication. The client must provide valid credentials to access the resource."
    },
    {
        title: "403 Forbidden",
        description: "The server understood the request but refuses to authorize it. The client does not have permission to access the requested resource."
    }
];

const HomeLayout = ({title,description,keywords,children}: Props) => {
  const {toast} = useToast()
  const searchParams = useSearchParams();
  const error:any = searchParams!.get("error") 
  const {scrolling:scrollingGlobal,setScrolling:setScrollingGlobal} = useContext(GlobalContext)!
  const [scrolling, setScrolling] = useState<boolean>(false);
  const [sideNav, setSideNav] = useState({
    open: false,
  });
  const ref = useRef(null);
  const { scrollY } = useScroll({
    container: ref,
  });

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 230){
      setScrollingGlobal(true)
       setScrolling(true)}
    if (latest < 230){
      setScrollingGlobal(false)
       setScrolling(false)}
  });

  useEffect(()=>{
    if (error) {
      if (error === '404') {
          toast({
              variant: "destructive",
              title: Exceptions[0].title,
              description: Exceptions[0].description
          });
      } else if (error === '400') {
          toast({
              variant: "destructive",
              title: Exceptions[1].title,
              description: Exceptions[1].description
          });
      } else if (error === '500') {
          toast({
              variant: "destructive",
              title: Exceptions[2].title,
              description: Exceptions[2].description
          });
      } else if (error === '401') {
          toast({
              variant: "destructive",
              title: Exceptions[3].title,
              description: Exceptions[3].description
          });
      } else if (error === '403') {
          toast({
              variant: "destructive",
              title: Exceptions[4].title,
              description: Exceptions[4].description
          });
      }
  }

  },[error])

  return (
    <>
      {" "}
      <Heading
        title={title}
        description={description || "Morasache clothing store"}
        keywords={keywords || "online store,e-commerece,shop,trade,clothing,bodywear,cloths"}
      />
      <div>
        <Sidebar sideNav={sideNav} setSideNav={setSideNav} />
        <div className="min-h-screen w-full relative overflow-hidden">
          <HeaderAds />
          <Navbar scrolling={scrolling} setSideNav={setSideNav} />
          <main className="relative overflow-hidden">{children}</main>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default HomeLayout;
