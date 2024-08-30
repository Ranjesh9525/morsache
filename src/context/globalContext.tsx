"use client";
import { Store } from "@/@types/store";
import { FetchStoreData } from "@/serverlessActions/_fetchActions";
import { useQuery } from "@tanstack/react-query";
// import { Store, StoreAction } from "@/@types/Store";
import React, { useEffect, useReducer } from "react";
import { createContext, useState } from "react";
export const GlobalContext = React.createContext<{
  scrolling:boolean
  setScrolling:React.Dispatch<React.SetStateAction<boolean>>
} | null>(null);

const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [scrolling, setScrolling] = useState<boolean>(false);

//   const {
//     isPending: storeDataIsPending,
//     data: storeDataResponse,
//     refetch: refetchStoreData,
//     isSuccess: storeDataIsSuccess,
//     isError: storeDataIsError,
//     error: storeDataError,
//   } = useQuery({
//     queryKey: ["fetchstore"],
//     queryFn: () => FetchStoreData(),
//   });


  return (
    <GlobalContext.Provider
      value={{ scrolling,setScrolling }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
