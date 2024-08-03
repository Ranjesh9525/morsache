import HomeLayout from "@/components/layouts/HomeLayout";
import { StarIcon } from "lucide-react";
import Image from "next/image";
import React from "react";
import { CiDiscount1 } from "react-icons/ci";

type Props = {
  params: { id: string };
};

const page = ({ params }: Props) => {
 // console.log(params?.id);
  return (
    <HomeLayout>
      <title>{`Buy ${params.id.toString().replaceAll("-"," ")} - Morsache`}</title>
      <div className="grid grid-cols-2 p-9 min-h-screen gap-x-16 !mt-5 relative">
        <div className="grid grid-cols-5 gap-x-2 sticky ">
          <div className="col-span-1 flex flex-col gap-6 pl-5 ">
            <Image
              src="/items/brush-stroke-red-shirt1.jpg"
              alt=""
              width={80}
              height={200}
              className="cursor-pointer border-2 border-black "
            />
            <Image
              src="/items/brush-stroke-red-shirt2.jpg"
              alt=""
              width={80}
              height={200}
              className="cursor-pointer"
            />
          </div>
          <div className="col-span-4 pr-5">
            <Image
              src="/items/brush-stroke-red-shirt1.jpg"
              alt=""
              width={700}
              height={400}
              className="cursor-zoom-in"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2  h-[200vh]">
          <h1 className="text-3xl font-medium ">
            {params.id.toString().toUpperCase().replaceAll("-", " ")}
          </h1>
          <div className="flex text-[13px] items-center">
            <StarIcon fill="#f8d122" stroke="0" className="border-0" />
            <StarIcon fill="#f8d122" stroke="0" className="border-none" />
            <StarIcon fill="#f8d122" stroke="0" />
            <StarIcon fill="#f8d122" stroke="0" />
            <StarIcon fill="#f8d122" stroke="0" />
            {" 129 reviews "}
          </div>
          <div className="mt-5">
            <h1 className="w-full text-[17px]">INR 1,499</h1>
            <p className="w-full text-[15px]">{"(incl. of all taxes)"}</p>
          </div>
          <div id="discounts" className="w-[280px] mt-5 ">
            <div className="flex items-center justify-center gap-3 mb-3">
              <CiDiscount1 color="#fea12f" size={35} />
              <p className="w-full text-[12px]">
                Get this for <b>INR 1,199</b> <br />
                Buy 5 {"&"} Get Flat 20% Off! Code:<b>BUY5</b>{" "}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 mb-3">
              <CiDiscount1 color="#fea12f" size={35} />
              <p className="w-full text-[12px]">
                Get this for <b>INR 1,199</b> <br />
                Buy 5 {"&"} Get Flat 20% Off! Code:<b>BUY5</b>{" "}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 mb-3">
              <CiDiscount1 color="#fea12f" size={35} />
              <p className="w-full text-[12px]">
                Get this for <b>INR 1,199</b> <br />
                Buy 5 {"&"} Get Flat 20% Off! <br /> Code:<b>BUY5</b>{" "}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 mb-3">
              <CiDiscount1 color="#fea12f" size={35} />
              <p className="w-full text-[12px]">
                Get this for <b>INR 1,199</b> <br />
                Buy 5 {"&"} Get Flat 20% Off! Code:<b>BUY5</b>{" "}
              </p>
            </div>
          </div>
          <hr className="my-4"/>
          <div id="variants" className="flex items-center gap-4"> 
          <Image
              src="/items/brush-stroke-red-shirt2.jpg"
              alt=""
              width={50}
              height={50}
              className="cursor-pointer rounded-lg "
            />
          <Image
              src="/items/brush-stroke-red-shirt2.jpg"
              alt=""
              width={50}
              height={50}
              className="cursor-pointer rounded-lg border border-black "
            />
          <Image
              src="/items/brush-stroke-red-shirt2.jpg"
              alt=""
              width={50}
              height={50}
              className="cursor-pointer rounded-lg"
            />
          <Image
              src="/items/brush-stroke-red-shirt2.jpg"
              alt=""
              width={50}
              height={50}
              className="cursor-pointer rounded-lg"
            />
          <Image
              src="/items/brush-stroke-red-shirt2.jpg"
              alt=""
              width={50}
              height={50}
              className="cursor-pointer rounded-lg"
            />
          <Image
              src="/items/brush-stroke-red-shirt2.jpg"
              alt=""
              width={50}
              height={50}
              className="cursor-pointer rounded-lg"
            />
          <Image
              src="/items/brush-stroke-red-shirt2.jpg"
              alt=""
              width={50}
              height={50}
              className="cursor-pointer rounded-lg"
            />
          </div>
        </div>
      </div>
    </HomeLayout>
  );
};

export default page;
