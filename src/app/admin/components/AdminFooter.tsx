import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {};

const AdminFooter = (props: Props) => {
  return (
    <div id="footer" className="p-9 space-y-3  mt-auto">
      <Link href="/admin" className="inline-flex items-end uppercase">
        <Image
          src="/morsache-clothing-logo-small.png"
          alt="logo"
          width={30}
          height={30}
        />
        <h1 className="font-medium text-[#474747] text-xl">orsache - Admin</h1>
      </Link>
      <Separator className="bg-gray-400" />
      <section
        id="footer-links"
        className="w-full flex  items-center justify-between"
      >
        <section className="flex  items-center gap-4">
          {" "}
          {links.map((link,index) => (
            <Link key={index} className="text-[12.5px]" href={link.href}>
              {link.title}
            </Link>
          ))}
        </section>
        <section className=" flex items-center justify-center flex-col text-[12px]">
          <h1>© {new Date().getFullYear()} MORSACHE</h1>
          <Link
            href="https://www.github.com/a-ww2-er"
            target={"_blank"}
            className="font-medium cursor-pointer"
          >
            Made By a-ww2-er
          </Link>
        </section>
      </section>
    </div>
  );
};

export default AdminFooter;

const links = [
  { title: "link1", href: "/admin" },
  { title: "link2", href: "/admin" },
  { title: "link3", href: "/admin" },
];
