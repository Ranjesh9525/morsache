"use client";
import React, { useState, useRef, useEffect } from "react";
import Footer from "../general/footer/Footer";
import Navbar from "../general/navbar/Navbar";
import Sidebar from "../general/navbar/Sidebar";
import HeaderAds from "../home/HeaderAds";
import { useScroll, useMotionValueEvent } from "framer-motion";
import Heading from "@/utilities/Heading";
import { useToast } from "../ui/use-toast";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import Image from "next/image";
import { clearParams } from "@/utilities/global";
type Props = {
  children: React.ReactNode;
  title: string;
  description?: string;
  keywords?: string;
};
export const Exceptions = [
  {
    title: "404 Not Found",
    description:
      "The server can't find the requested resource. This could be due to a mistyped URL, a removed page, or a resource that is temporarily unavailable.",
  },
  {
    title: "400 Bad Request",
    description:
      "The server cannot process the request due to a client error, such as invalid syntax or missing required parameters in the request.",
  },
  {
    title: "500 Internal Server Error",
    description:
      "The server encountered an unexpected condition that prevented it from fulfilling the request.",
  },
  {
    title: "401 Unauthorized",
    description:
      "The request requires user authentication. The client must provide valid credentials to access the resource.",
  },
  {
    title: "403 Forbidden",
    description:
      "The server understood the request but refuses to authorize it. The client does not have permission to access the requested resource.",
  },
];

const CheckoutLayout = ({ title, description, keywords, children }: Props) => {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const error: any = searchParams!.get("error");
  const router = useRouter()
  const [scrolling, setScrolling] = useState<boolean>(false);
  const [sideNav, setSideNav] = useState({
    open: false,
  });
  const ref = useRef(null);
  const { scrollY } = useScroll({
    container: ref,
  });

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 230) setScrolling(true);
    if (latest < 230) setScrolling(false);
  });

  useEffect(() => {
    if (error) {
      if (error === "404") {
        toast({
          variant: "destructive",
          title: Exceptions[0].title,
          description: Exceptions[0].description,
        });
        clearParams("error");
        router.push('/cart')
      } else if (error === "400") {
        toast({
          variant: "destructive",
          title: Exceptions[1].title,
          description: Exceptions[1].description,
        });
        clearParams("error");
        router.push('/cart')
      } else if (error === "500") {
        toast({
          variant: "destructive",
          title: Exceptions[2].title,
          description: Exceptions[2].description,
        });
        clearParams("error");
    router.push('/cart')
      } else if (error === "401") {
        toast({
          variant: "destructive",
          title: Exceptions[3].title,
          description: Exceptions[3].description,
        });
      clearParams("error");
      router.push('/cart')
      } else if (error === "403") {
        toast({
          variant: "destructive",
          title: Exceptions[4].title,
          description: Exceptions[4].description,
        });
        clearParams("error");
        router.push('/cart')
      }
    }
  }, [error]);

  const PathName = usePathname();
  const lastPartPathName = PathName?.split("/").pop();
  const PagesNames = [
    {
      name: "home",
      path: "/",
    },
    {
      name: "details",
      path: `/cart/checkout/${lastPartPathName}`,
    },
    {
      name: "shipping",
      path: `/cart/checkout/shipping/${lastPartPathName}`,
    },
    {
      name: "payment",
      path: `/cart/checkout/payment/${lastPartPathName}`,
    },
  ];

  return (
    <>
      {" "}
      <Heading
        title={title}
        description={description || "Morasache clothing store"}
        keywords={
          keywords ||
          "online store,e-commerece,shop,trade,clothing,bodywear,cloths"
        }
      />
      <div>
        {/* <Sidebar sideNav={sideNav} setSideNav={setSideNav} /> */}
        <div className="min-h-screen w-full relative overflow-hidden">
          {/* <HeaderAds /> */}
          {/* <Navbar scrolling={scrolling} setSideNav={setSideNav} /> */}
          <div className="container mt-9 space-y-3">
            <Link
              scroll={true}
              href="/"
              className="text-xl font-medium inline-flex uppercase  items-end tracking-wider cursor-pointer text-[#474747]"
            >
              {/* <TreePineIcon size={34} /> */}
              <Image
                src="/morsache-clothing-logo-small.png"
                width={200}
                height={200}
                className={"w-[30px] h-[30px]"}
                alt="logo"
              />
              orsache
            </Link>
            <Breadcrumb>
              <BreadcrumbList>
                {PathName === "/cart/checkout/review"
                  ? null
                  : PagesNames.map((page, index) => {
                      return (
                        <div key={index} className="flex items-center gap-2">
                          <BreadcrumbItem
                            className={
                              PathName === page.path
                                ? "text-[#303030] font-medium capitalize"
                                : "text-[#9F9F9F] font-medium capitalize"
                            }
                          >
                            {/* <BreadcrumbLink href={page.path}> */}
                              {page.name}
                            {/* </BreadcrumbLink> */}
                          </BreadcrumbItem>
                          {index + 1 !== PagesNames.length && (
                            <BreadcrumbSeparator />
                          )}
                        </div>
                      );
                    })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <main className="relative overflow-hidden">{children}</main>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default CheckoutLayout;
