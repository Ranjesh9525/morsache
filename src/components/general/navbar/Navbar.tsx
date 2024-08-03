import {
  Heart,
  MenuIcon,
  Search,
  ShoppingBagIcon,
  TreePineIcon,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

type Props = {
  scrolling: boolean;
  setSideNav: React.Dispatch<React.SetStateAction<{ open: boolean }>>;
};
type CustomPosition = "static" | "relative" | "absolute" | "sticky" | "fixed";

const Navbar = ({ scrolling, setSideNav }: Props) => {
  const navbarScrollVariants = {
    scroll: {
      position: "fixed" as CustomPosition,
      top: -40,
      width: "99vw",
      y: 40,
      transition: {
        y: { type: "tween", duration:0.5 },
      },

    },
    noScroll: {
      position: "static" as CustomPosition,
      y: 0,
      transition: {},
    },

  };

  return (
    <div className="min-h-[40px]">
    <motion.div
      variants={navbarScrollVariants}
      initial={"noScroll"}
      id="navbar-container"
      className="bg-white border-b z-[120] border-b-gray-100"
      animate={scrolling ? "scroll" : "noScroll"}
    >
      <div id="navbar" className="p-5 flex justify-between items-center">
        <span className=" w-full text-left ">
          <MenuIcon className="cursor-pointer" onClick={() => setSideNav({ open: true })} />
        </span>
        <Link  href="/" className="text-4xl font-bold inline-flex  gap-2 items-center cursor-pointer">
          {/* <TreePineIcon size={34} /> */}
          <Image
            src="/morsache-clothing-logo-small.png"
            width={200}
            height={200}
            className={"w-[50px] h-[50px]"}
            alt="logo"
          />
          Morsache
        </Link>
        <span id="icons" className="flex items-center justify-end gap-4 w-full">
          <Link href={"/#"}>
            <User />
          </Link>
          <Link href={"/#"}>
            <Search />
          </Link>
          <Link href={"/#"}>
            <Heart />
          </Link>
          <Link href={"/cart"}>
            <ShoppingBagIcon />
          </Link>
        </span>
      </div>
    </motion.div></div>
  );
};

export default Navbar;
