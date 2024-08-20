import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

type props = {
  showBack: boolean;
  showNext: boolean;
  nextLink?: string;
  prevLink?: string;
};

const PrevAndNextBtn = ({ showBack, showNext, nextLink, prevLink }: props) => {
  return (
    <div className="w-full items-center container flex justify-between">
      {showBack ? <Link href={prevLink || ""}>Back</Link> : <span></span>}
      {showNext ? <Link href={nextLink || ""}>Next</Link> : <span></span>}
    </div>
  );
};

export default PrevAndNextBtn;
