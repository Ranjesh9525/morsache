"use client";
import React from "react";
import { SessionProvider } from "next-auth/react";
import CartProvider from "./cartContext";
// import { UserProvider } from './context/userContext';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ShippingProvider from "./shippingContext";
import StoreProvider from "./storeContext";
import GlobalProvider from "./globalContext";

const queryClient = new QueryClient();

const CombinedProvider = ({ children }: any) => (
  <QueryClientProvider client={queryClient}>
    <SessionProvider>
      <GlobalProvider>

      <ShippingProvider>
        <StoreProvider>
          <CartProvider>{children}</CartProvider>
        </StoreProvider>
      </ShippingProvider>
      </GlobalProvider>
    </SessionProvider>
  </QueryClientProvider>
);

//   <UserProvider>
//   </UserProvider>
export default CombinedProvider;
