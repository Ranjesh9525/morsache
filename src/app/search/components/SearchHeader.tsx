import React from "react";

type Props = {
  result: any;
};

const SearchHeader = ({ result }: Props) => {
  return (
    <div className="w-full flex justify-between items-center p-9">
      <h1 className={ result.total > 1 ? "text-black font-semibold":"text-gray-500 font-semibold"}>Products {` (${result.total || 0})`}</h1>
      <h1 className="font-normal">Showing {result.total || 0} results</h1>
    </div>
  );
};

export default SearchHeader;
