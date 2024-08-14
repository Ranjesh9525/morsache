import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { DataTable } from "../components/DataTable";
import PageHeadingText from "../components/PageHeadingText";

type Props = {};
const randomShippingData = (length: number) => {
  const result = [];
  const location = ["street", "city", "state", "postalCode", "country"];
  for (let i; (i = 0); i < length) {
    let value = {
      id: Math.random().toString(36).substring(2, 9),
      locationBy: location[Math.random() * location.length],
      name: Math.random().toString(36).substring(7),
      price: Math.floor(Math.random() * 5000),
    };
    result.push(value);
  }
  return result;
};

export type ShippingData = {
  id: string;
  name: string;
  locationBy: string;
  price: number;
};

// Generate 5 random users
export const columns: ColumnDef<ShippingData>[] = [
  {
    accessorKey: "id",
    header: "id",
  },
  {
    accessorKey: "name",
    header: "name",
  },
  {
    accessorKey: "locationBy",
    header: "location By",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
];
const page = (props: Props) => {
  const randomData = randomShippingData(9);
  console.log(randomData)

  return (
    <>
      <PageHeadingText
        pageHeading="Shipping Data"
        description="Here a list of all active shipping price list, users would be charged for shipping based on this information, if you add a location for a state and city and also street and the user fills in all these places they'd be charged according to the location with the highest price"
      />
      <div className="container mx-auto min-h-[70vh] py-10">
        <DataTable columns={columns} data={randomData} />
      </div>
    </>
  );
};

export default page;
