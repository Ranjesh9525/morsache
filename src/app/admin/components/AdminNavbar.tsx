"use client";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { signOut, useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  Box,
  UserPlus,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation } from "@tanstack/react-query";
import { FaUpload } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import { AdminUploadProduct } from "@/serverlessActions/_adminActions";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ClipLoader } from "react-spinners";
import { useToast } from "@/components/ui/use-toast";
import { Product } from "@/@types/products";

type Props = {
  scrolling: boolean;
};

const scrollingVariants = {
  fixed: {
    position: "fixed" as any,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    transition: {
      type: "spring",
      stiffness: 700,
      damping: 30,
    },
    backdropFilter: "blur(10px)",
  },
  static: {
    position: "static" as any,
  },
};

const AdminNavbar = ({ scrolling }: Props) => {
  const { data: Session } = useSession() as any;
  const [savedProduct, setSavedProduct] = useState<Product | null>(null);
  const router = useRouter();
  const {
    isPending,
    isError,
    data,
    isSuccess,
    error,
    mutate: uploadProduct,
  } = useMutation({
    mutationFn: AdminUploadProduct,
  });
  const { toast } = useToast();
  const discardProduct = () => {
    toast({
      variant: "destructive",
      title: `Product discarded`,
    });
    localStorage.removeItem("product-draft");
    setSavedProduct(null);
    router.push("/admin/products/create");
    router.refresh();
  };
  const pathname = usePathname();
  const lastPartPathName = pathname?.split("/").pop();
  const isPreview = useSearchParams()?.get("preview");
  useEffect(() => {
    if (isSuccess) {
      toast({
        variant: "success",
        title: `Product uploaded`,
      });
      localStorage.removeItem("product-draft");
      setSavedProduct(null);
      router.push("/admin/products/create");
    }
    if (isError) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: <p>{error?.message}</p>,
      });
    }
    if (data) {
      console.log(data);
    }
  }, [data, isError, isSuccess]);

  useEffect(() => {
    if (localStorage.getItem("product-draft") && isPreview) {
      setSavedProduct(JSON.parse(localStorage.getItem("product-draft")!));
    }
  }, [isPreview]);

  return (
   <motion.div
      // variants={scrollingVariants}
      // animate={scrolling ? "fixed" : "static"}
      id="nav-wrapper"
      className="w-full sticky top-0 z-50"
    >
      <nav
        id="nav-body"
        className="w-full bg-white border-b border-b-gray-100 "
      >
        <div className="flex items-center justify-between w-full p-6 py-4">
          <section className="flex items-center gap-4 max-sm:flex-col max-sm:items-start ">
            <Link href="/admin" className="inline-flex items-end uppercase">
              <Image
                src="/morsache-clothing-logo-small.png"
                alt="logo"
                width={40}
                height={40}
              />
              <h1 className="font-medium text-[#474747] text-2xl">
                orsache - Admin
              </h1>
            </Link>

            <NavigationMenu className="z-40">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Store</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-fit gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                      {storeComponents.map((component) => (
                        <ListItem
                          key={component.title}
                          title={component.title}
                          href={component.href}
                        >
                          {component.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Offers</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-fit gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                      {offersComponents.map((component) => (
                        <ListItem
                          key={component.title}
                          title={component.title}
                          href={component.href}
                        >
                          {component.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/admin/team" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      Team
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </section>
          <section>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <span className="items-center inline-flex hover:bg-accent cursor-pointer p-[0.25rem] px-2 text-[14px] font-medium space-x-1.5 rounded-full">
                  <Image
                    src={Session?.user?.image || "https://picsum.photos/200"}
                    alt="pfp"
                    width={35}
                    height={35}
                    className="rounded-full"
                  />
                  <h1>{Session?.user?.firstName || Session?.user?.email}</h1>{" "}
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <Link href="/account/">Edit Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span
                      onClick={() =>
                        signOut({ redirect: false, callbackUrl: "/" })
                      }
                    >
                      Log out
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </section>
        </div>
        <Separator />
        <div className="w-full flex justify-between items-center max-sm:flex-col">
          <div className="p-2">
            <NavigationMenu>
              <NavigationMenuList className="flex flex-wrap" >
                <NavigationMenuItem>
                  <Link href="/admin/users" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      {/* <Users size={20} className="mr-2"/>  */}
                      Users
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="">
                    {/* <Box size={20} className="mr-2" /> */}
                    Orders
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-fit gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                      {ordersComponents.map((component) => (
                        <ListItem
                          key={component.title}
                          title={component.title}
                          href={component.href}
                        >
                          {component.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/admin/shipping" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      {/* <Users size={20} className="mr-2"/>  */}
                      Shipping
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    {/* <Cloud size={20} className="mr-2"/> */}
                    Categories
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-fit gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                      {categoriesComponents.map((component) => (
                        <ListItem
                          key={component.title}
                          title={component.title}
                          href={component.href}
                        >
                          {component.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    {/* <LifeBuoy size={20} className="mr-2" /> */}
                    Products
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-fit gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                      {productsComponents.map((component) => (
                        <ListItem
                          key={component.title}
                          title={component.title}
                          href={component.href}
                        >
                          {component.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="space-x-2">
                    {/* <Mail size={20}/> */}
                    <h1>Pages</h1>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-fit gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                      {pagesComponents.map((component) => (
                        <ListItem
                          key={component.title}
                          title={component.title}
                          href={component.href}
                        >
                          {component.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>{" "}
          </div>
          {(pathname === "/admin/products/create" ||
            `/admin/products/${lastPartPathName}`) &&
            savedProduct && (
              <div id="action-btns">
                <Button
                  type="button"
                  variant="secondary"
                  disabled={isPending}
                  onClick={() => discardProduct()}
                  className="mr-8 gap-4 border border-[#665a47] text-black tracking-wider hover:bg-[#e6e6e6]"
                >
                  Discard
                  <FaTimes color="red" />
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  disabled={isPending}
                  onClick={() => uploadProduct(savedProduct)}
                  className="mr-8 gap-4 bg-primary-dark text-white tracking-wider hover:bg-primary "
                >
                  Upload Product
                  {!isPending ? (
                    <FaUpload color="#fff" />
                  ) : (
                    <ClipLoader color="#fff" />
                  )}
                </Button>
              </div>
            )}
        </div>
      </nav>
    </motion.div>
  )
}
  

export default AdminNavbar;

const pagesComponents: { title: string; href: string; description: string }[] =
  [
    {
      title: "Return Policy page",
      href: "/admin/pages/return-policy",
      description: "Edit the return policy page of the morsache store",
    },
  ];
const storeComponents: { title: string; href: string; description: string }[] =
  [
    {
      title: "Edit Slider",
      href: "/admin/store/slider",
      description: "Edit the home page slide carousel, add or remove images",
    },
    {
      title: "Featured Categories",
      href: "/admin/store/featured",
      description: "Style the homepage featured categories",
    },
    {
      title: "Footer",
      href: "/admin/store/footer",
      description: "Edit the footer, change details shown in the footer",
    },
    {
      title: "Edit offer image",
      href: "/admin/store/offer",
      description: "Change the offer image in the homePage or deactivate it",
    },
  ];
const offersComponents: { title: string; href: string; description: string }[] =
  [
    {
      title: "View all offers",
      href: "/admin/offers",
      description:
        "See all active offers and their functions, create or delete offers",
    },
    {
      title: "Edit sliding offers",
      href: "/admin/store/sliding-offers",
      description:
        "Edit the sliding offers that appear at the top of the pages or deactivate it",
    },
  ];
const ordersComponents: { title: string; href: string; description: string }[] =
  [
    {
      title: "All orders",
      href: "/admin/orders",
      description:
        "View all orders made on the store, change the status or cancel it",
    },
    {
      title: "Pending",
      href: "/admin/orders/?status=pending",
      description: "View all offers with a status of pending",
    },
    {
      title: "Cancelled",
      href: "/admin/orders/?status=cancelled",
      description: "View all offers with a status of cancelled",
    },
    {
      title: "Ready",
      href: "/admin/orders/?status=ready",
      description: "View all offers with a status of ready",
    },
    {
      title: "Shipped",
      href: "/admin/orders/?status=shipped",
      description: "View all offers with a status of shipped",
    },
    {
      title: "Confirmed",
      href: "/admin/orders/?status=confirmed",
      description: "View all offers with a status of confirmed",
    },
    {
      title: "Delivered",
      href: "/admin/orders/?status=delivered",
      description: "View all offers with a status of delivered",
    },
  ];
const categoriesComponents: {
  title: string;
  href: string;
  description: string;
}[] = [
  {
    title: "View all categories",
    href: "/admin/categories",
    description: "View all active categories, delete or edit",
  },
  {
    title: "Create Categories",
    href: "/admin/categories/create",
    description: "Create new categories to be added to morsache store",
  },
];
const productsComponents: {
  title: string;
  href: string;
  description: string;
}[] = [
  {
    title: "View all products",
    href: "/admin/products",
    description:
      "View all products available on the morsache store, edit or delete",
  },
  {
    title: "Create new product",
    href: "/admin/products/create",
    description:
      "Create new products to be added to the store, availiable to everyone",
  },
];

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title,href, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
         <Link href={href!} className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
        <div className="text-sm font-medium leading-none">{title}</div>
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
      </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

