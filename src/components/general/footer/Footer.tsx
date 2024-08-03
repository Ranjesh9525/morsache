import Link from "next/link";
import React from "react";
import { FaInstagram,FaFacebook,FaYoutube,FaLinkedinIn,FaTwitter } from "react-icons/fa6";

type Props = {};

const Footer = (props: Props) => {
  return (
    <div className="min-h-[40vh]  bg-white border-t border-t-gray-200">
      <div className="p-9">
        <section className="grid grid-cols-4 gap-6 py-4">
          <span>
            <h1 className="text-[14px] uppercase tracking-wider mb-4">Offline Store</h1>
            <ul className="text-[12px] tracking-wide">
              <li className="mb-2">
                <Link href="#">Find Stores Near Me</Link>
              </li>
            </ul>
          </span>
          <span>
            <h1 className="text-[14px] uppercase tracking-wider mb-4">Get to know us</h1>
            <ul className="text-[12px] tracking-wide">
              <li className="mb-2">
                <Link href="#">Contact Us</Link>
              </li>
              <li className="mb-2">
                <Link href="#">FAQ's</Link>
              </li>
              <li className="mb-2">
                <Link href="#"></Link>
              </li>
              <li className="mb-2">
                <Link href="#">Terms {"&"}Conditions</Link>
              </li>
            </ul>
          </span>
          <span>
            <h1 className="text-[14px] uppercase tracking-wider mb-4">TRACK OR RETURN/EXCHANGE ORDER</h1>
            <ul className="text-[12px] tracking-wide">
              <li className="mb-2">
                <Link href="#"> TRACK ORDER</Link>
              </li>
              <li className="mb-2">
                <Link href="#"> PLACE RETURN/EXCHANGE REQUEST</Link>
              </li>
              <li className="mb-2">
                <Link href="#"> RETURNS/EXCHANGE POLICY</Link>
              </li>
            </ul>
          </span>
          <span>
            <h1 className="text-[14px] uppercase tracking-wider mb-4">CUSTOMER CARE</h1>
            <ul className="text-[12px] tracking-wide">
              <li className="mb-2">Timings: 10 AM - 7 PM (Mon - Sat)</li>
              <li className="mb-2">
                Whatsapp :<Link href="#"> +91 6364430801</Link>
              </li>
              <li className="mb-2">Instagram: @snitch.co.in</li>
            </ul>
          </span>
        </section>

        <section className="my-6">
          <span>
            <h1 className="text-[15px] uppercase tracking-wider mb-4"> Sign up and save</h1>
            <p className="text-[11.5px]">
              Sign up now and be the first to know about exclusive offers,
              latest fashion trends {"&"} style tips!
            </p>
          </span>
          <div id="email">
            
          </div>

          <div id="socials" className="flex gap-3 my-4">
            <FaInstagram size={28}/>
            <FaFacebook size={28} />
            <FaYoutube size={28} />
            <FaTwitter size={28} />
            <FaLinkedinIn size={28} />
          </div>
        </section>
        <section className="w-full flex items-center justify-center flex-col my-6 text-[12px]">
         
            <h1 >© 2024 MORSACHE</h1>
            <h1 className="font-medium">Made in India, for the World 🌍</h1>
       
        </section>
      </div>
    </div>
  );
};

export default Footer;
