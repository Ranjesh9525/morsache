"use client";
import { Store } from "@/@types/store";
import { FetchStoreData } from "@/serverlessActions/_fetchActions";
import { useQuery } from "@tanstack/react-query";
// import { Store, StoreAction } from "@/@types/Store";
import React, { useEffect, useReducer } from "react";
import { createContext, useState } from "react";
export const StoreContext = React.createContext<{
  store: Store | null;
  storeDataIsPending: boolean;
  storeDataError: any;
  refetchStoreData: () => void;
  storeDataIsError:boolean;
} | null>(null);

const StoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [store, setStore] = useState<Store | null>(null);

  const {
    isPending: storeDataIsPending,
    data: storeDataResponse,
    refetch: refetchStoreData,
    isSuccess: storeDataIsSuccess,
    isError: storeDataIsError,
    error: storeDataError,
  } = useQuery({
    queryKey: ["fetchstore"],
    queryFn: () => FetchStoreData(),
  });

  useEffect(() => {
    if (storeDataIsSuccess && storeDataResponse.data) {
      console.log("store res",storeDataResponse)
        
      setStore(storeDataResponse.data);
    }
  }, [storeDataIsSuccess, storeDataResponse]);

  return (
    <StoreContext.Provider
      value={{ store, storeDataIsPending, storeDataError,storeDataIsError, refetchStoreData }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;
