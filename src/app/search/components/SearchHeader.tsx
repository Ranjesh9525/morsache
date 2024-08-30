import React from "react";

type Props = {
  result: any;
};

const SearchHeader = ({ result }: Props) => {
  return (
    <div className="w-full  justify-between items-center p-9 hidden md:flex">
      <h1 className={ result > 1 ? "text-black font-semibold":"text-gray-500 font-semibold"}>Products {` (${result || 0})`}</h1>
      <h1 className="font-normal">Showing {result || 0} results</h1>
    </div>
  );
};

export default SearchHeader;
