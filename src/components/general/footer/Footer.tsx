import { Input } from "@/components/ui/input";
import { Send, SendHorizontal } from "lucide-react";
import Link from "next/link";
import React from "react";
import { CiMail } from "react-icons/ci";
import {
  FaInstagram,
  FaFacebook,
  FaYoutube,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa6";

type Props = {};

const Footer = (props: Props) => {
  return (
    <div className="min-h-[40vh]  bg-white border-t border-t-gray-200">
      <div className="p-9">
        <section className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 py-4">
          <span>
            <h1 className="text-[14px] uppercase  tracking-wider mb-4">
            
            </h1>
            <ul className="text-[12px] tracking-wide">
              <li className="mb-2">
                <Link href="#">Your Feedback</Link>
              </li>
            </ul>
          </span>
          <span>
            <h1 className="text-[14px]  uppercase tracking-wider mb-4">
              Get to know us
            </h1>
            <ul className="text-[12px] tracking-wide">
              <li className="mb-2">
                <Link href="/contact-us">Contact Us</Link>
              </li>
              <li className="mb-2">
                <Link href="/return-exchange-policy">FAQ&#39;s</Link>
              </li>
              <li className="mb-2">
                <Link href="#"></Link>
              </li>
              <li className="mb-2">
                <Link href="/return-exchange-policy">Terms {"&"}Conditions</Link>
              </li>
            </ul>
          </span>
          <span>
            <h1 className="text-[14px]  uppercase tracking-wider mb-4">
              TRACK OR RETURN/EXCHANGE ORDER
            </h1>
            <ul className="text-[12px] tracking-wide">
              <li className="mb-2">
                <Link href="/account/track"> TRACK ORDER</Link>
              </li>
              <li className="mb-2">
                <Link href="/return-exchange-policy"> PLACE RETURN/EXCHANGE REQUEST</Link>
              </li>
              <li className="mb-2">
                <Link href="/return-exchange-policy"> RETURNS/EXCHANGE POLICY</Link>
              </li>
            </ul>
          </span>
          <span>
            <h1 className="text-[14px]  uppercase tracking-wider mb-4">
              CUSTOMER CARE
            </h1>
            <ul className="text-[12px] tracking-wide">
              <li className="mb-2">Timings: 10 AM - 7 PM (Mon - Sat)</li>
              <li className="mb-2">
                Whatsapp :<Link href="#"> </Link>
              </li>
              <li className="mb-2">Instagram</li>
            </ul>
          </span>
        </section>

        <section className="my-6">
          <span>
            <h1 className="text-[15px]  uppercase tracking-wider mb-4">
              {" "}
              Sign up and save
            </h1>
            <p className="text-[11.5px]">
              Sign up now and be the first to know about exclusive offers,
              latest fashion trends {"&"} style tips!
            </p>
          </span>
          <div id="email" className="w-fit flex items-center my-3 relative">
            <Input
              type="text"
              placeholder="Enter your email"
              className="min-w-[280px] border-t-none border-x-none rounded-none border-t-0 pl-0 border-x-0 border-b-2 border-b-gray-900 focus-visible:outline-none focus-visible:ring-0 placeholder:text-[11.5px] "
            />{" "}
            <CiMail className="cursor-pointer absolute right-0" size={23} />
          </div>

          <div id="socials" className="flex gap-3 my-4">
            <FaInstagram size={28} />
            <FaFacebook size={28} />
            <FaYoutube size={28} />
            <FaTwitter size={28} />
            <FaLinkedinIn size={28} />
          </div>
        </section>
        <section className="w-full flex items-center justify-center flex-col my-6 text-[12px]">
          <Link href={``} target={"_blank"} >© {new Date().getFullYear()} MORSACHE</Link>
         
        </section>
      </div>
    </div>
  );
};

export default Footer;
