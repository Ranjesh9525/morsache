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
  return (
    <div className="min-h-[36px]">
      <motion.div
        variants={navbarScrollVariants}
        initial={"noScroll"}
        id="navbar-container"
        className="bg-white border-b z-[120] border-b-gray-100"
        animate={scrolling ? "scroll" : "noScroll"}
      >
        <div id="navbar" className="p-5 flex justify-between items-center">
          <span className=" w-full text-left ">
            <MenuIcon
              className="cursor-pointer"
              onClick={() => setSideNav({ open: true })}
            />
          </span>
          <Link
            scroll={true}
            href="/"
            className="text-4xl font-medium inline-flex uppercase  items-end tracking-wider cursor-pointer text-[#474747]"
          >
            {/* <TreePineIcon size={34} /> */}
            <Image
              src="/morsache-clothing-logo-small.png"
              width={200}
              height={200}
              className={"w-[50px] h-[50px]"}
              alt="logo"
            />
            orsache
          </Link>
          <span
            id="icons"
            className="flex items-center justify-end gap-4 w-full"
          >
            {session?.user ? (
              <Link scroll={true} href={"/account"}>
                <AiOutlineUser className="bg-gray-200 p-[0.35rem] h-[30px] w-[30px] rounded-[50%]" />{" "}
              </Link>
            ) : (
              <Link href={"/auth/login"}>
                <User />{" "}
              </Link>
            )}

            <Link scroll={true} href={"/search"}>
              <Search />
            </Link>
            <Link scroll={true} href={"/account/wishlist"}>
              <Heart />
            </Link>
            <Link
              scroll={true}
              href={"/cart"}
              data-content={cart.totalItems}
              className={cn(
                "relative",
                cart?.totalItems > 0 &&
                  `after:bg-red-500 after:p-[0.15rem] after:px-[0.45rem] after:absolute after:text-white after:top-[-12px] after:right-[-12.5px] after:text-[11px] after:rounded-full after:width-1 after:height-1 after:content-[attr(data-content)]`
              )}
            >
              <ShoppingBagIcon />
            
            </Link>
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default Navbar;
