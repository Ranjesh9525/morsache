"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { signOut } from "next-auth/react";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
  }[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col items-start  whitespace-nowrap w-full lg:space-x-0 lg:space-y-1",
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname === item.href
              ? "bg-[#545454c7] text-white hover:bg-[#545454c7] lg:w-full hover:text-white"
              : "hover:bg-transparent hover:underline ",
            "justify-start "
          )}
        >
          {item.title}
        </Link>
      ))}
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "hover:bg-transparent hover:underline hover:text-red-500",
          "justify-start text-red-500"
        )}
        onClick={() =>  signOut({ redirect: false, callbackUrl: "/" })}
      >
        {" "}
        Log Out
      </Link>
    </nav>
  );
}
