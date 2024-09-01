import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

type props = {
  showBack: boolean;
  showNext: boolean;
  nextLink?: string;
  prevLink?: string;
  onclickFunc?: any;
};

const PrevAndNextBtn = ({
  showBack,
  onclickFunc,
  showNext,
  nextLink,
  prevLink,
}: props) => {
  return (
    <div className="w-full items-center  mb-2 flex justify-between">
      {showBack ? (
        <Link
          className="text-sm text-white hover:bg-[#c6c5c5] bg-[#ababab] rounded-md px-4 py-2"
          href={prevLink || ""}
        >
          Back
        </Link>
      ) : (
        <span></span>
      )}
      {showNext ? (
        <span
          onClick={onclickFunc}
          className="text-sm cursor-pointer text-white hover:bg-[#c6c5c5] bg-[#ababab] rounded-md px-4 py-2"
          // href={nextLink || ""}
        >
          Next
        </span>
      ) : (
        <span></span>
      )}
    </div>
  );
};

export default PrevAndNextBtn;
