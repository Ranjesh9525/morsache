import {
  Heart,
  MenuIcon,
  Search,
  ShoppingBagIcon,
  TreePineIcon,
  User,
} from "lucide-react";
import Image from "next/image";
import { useMediaQuery } from "@react-hook/media-query";
import Link from "next/link";
import React, { useContext } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { AiOutlineUser } from "react-icons/ai";
import { CartContext } from "@/context/cartContext";
import { cn } from "@/lib/utils";

type Props = {
  scrolling: boolean;
  setSideNav: React.Dispatch<React.SetStateAction<{ open: boolean }>>;
};
type CustomPosition = "static" | "relative" | "absolute" | "sticky" | "fixed";

const Navbar = ({ scrolling, setSideNav }: Props) => {
   const isMobile = useMediaQuery("only screen and (max-width: 768px)");
  //  const mobile = window.matchMedia("(max-width: 768px)").matches;
  
  const navbarScrollVariants = {
    scroll: {
      position: "fixed" as CustomPosition,
      top: -40,
      width: "99vw",
      y: 40,
      transition: {
        y: { type: "tween", duration: 0.5 },
      },
    },
    noScroll: {
      position: "static" as CustomPosition,
      y: 0,
      transition: {},
    },
  };

  const { data: session }: any = useSession();
  const { cart, dispatch } = useContext(CartContext)!;
  // console.log(session);
  // console.log("session from client",session)
  return (
    <div className="min-h-[36px]">
      <motion.div
        variants={navbarScrollVariants}
        initial={"noScroll"}
        id="navbar-container"
        className="bg-white border-b z-[120] border-b-gray-100"
        animate={scrolling ? "scroll" : "noScroll"}
      >
        <div
          id="navbar"
          className="lg:p-5 p-3 flex justify-between items-center"
        >
          <span className=" w-full text-left ">
            <MenuIcon
              className="cursor-pointer"
              onClick={() => setSideNav({ open: true })}
            />
          </span>
          {session?.user?.role === "admin" ? (
            <Link href="/admin" className="inline-flex items-end uppercase">
              <Image
                src="/morsache-clothing-logo-small.png"
                alt="logo"
                width={40}
                height={40}
              />
              <h1 className="font-medium whitespace-nowrap text-[#474747] text-2xl">
                orsache - Admin
              </h1>
            </Link>
          ) : (
            <Link
              scroll={true}
              href="/"
              className="relative justify-center  inline-flex flex-row uppercase lg:gap-1 w-full items-end justify-self-center tracking-wider cursor-pointer text-[#474747]"
            >
              {/* <TreePineIcon size={34} /> */}
              {/* <span className={"lg:w-[50px] lg:h-[50px] w-[20px] h-[20px] "}> */}
                <Image
                  src="/morsache-clothing-logo-small.png"
                  width={45}
                  height={45}
                  className={"object-contain  relative  "}
                  alt="logo"
                />
              {/* </span> */}
              <p className="md:text-4xl text-lg font-medium">orsache</p>
            </Link>
          )}
          <span
            id="icons"
            className="flex  items-center justify-end md:gap-4 gap-2 w-full "
          >
            {session?.user ? (
              <Link scroll={true} href={"/account"}>
                <AiOutlineUser className="bg-gray-200 p-[0.35rem] h-[30px] w-[30px] rounded-[50%]" />{" "}
              </Link>
            ) : (
              <Link href={"/auth/login"}>
                <User className="w-4 h-4 lg:h-6 lg:w-6" />{" "}
              </Link>
            )}

            <Link scroll={true} href={"/search"} className="md:block hidden">
              <Search className="w-4 h-4 lg:h-6 lg:w-6" />
            </Link>
            <Link scroll={true} href={"/account/wishlist"}  className="md:block hidden">
              <Heart className="w-4 h-4 lg:h-6 lg:w-6" />
            </Link>
            <Link
              scroll={true}
              href={"/cart"}
              data-content={cart.totalItems}
              className={cn(
                "relative ",
                cart?.totalItems > 0 &&
                  `after:bg-red-500 lg:after:p-[0.15rem] after:p-[0.08rem] lg:after:px-[0.45rem] after:px-[0.30rem] after:absolute after:text-white lg:after:top-[-12px] after:top-[-9px] after:right-[-10.5px] lg:after:right-[-12.5px] lg:after:text-[11px] after:text-[9px] after:rounded-full lg:after:width-1 after:width-[0.3px] after:height-[0.3px] lg:after:height-1 after:content-[attr(data-content)]`
              )}
            >
              <ShoppingBagIcon className="w-4 h-4 lg:h-6 lg:w-6" />
            </Link>
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default Navbar;
