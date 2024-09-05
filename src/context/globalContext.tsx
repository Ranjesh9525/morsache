"use client";
import { Store } from "@/@types/store";
import { FetchStoreData } from "@/serverlessActions/_fetchActions";
import { useQuery } from "@tanstack/react-query";
import { getSession } from "next-auth/react";
// import { Store, StoreAction } from "@/@types/Store";
import React, { useEffect, useReducer } from "react";
import { createContext, useState } from "react";
export const GlobalContext = React.createContext<{
  scrolling: boolean;
  setScrolling: React.Dispatch<React.SetStateAction<boolean>>;
  userDataLoading: boolean;
  userData: any;
  fetchUserData: () => void
} | null>(null);

const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [scrolling, setScrolling] = useState<boolean>(false);
  const [userData, setUserData] = useState<any | null>(null);
  const [userDataLoading, setUserDataLoading] = useState<boolean>(false);

  async function fetchUserData() {
    try {
      setUserDataLoading(true);
      const session = await getSession();
      setUserData(session!.user);
      setUserDataLoading(false);
    } catch (error) {
      setUserDataLoading(false);
      console.error(error);
    }
  }

  useEffect(() => {
    fetchUserData();
  }, []);

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
      value={{ scrolling, setScrolling, userDataLoading, userData ,fetchUserData}}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
