"use client";
import React from "react";
import { SessionProvider } from "next-auth/react";
import CartProvider from "./cartContext";
// import { UserProvider } from './context/userContext';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const CombinedProvider = ({ children }: any) => (
  <QueryClientProvider client={queryClient}>
    <SessionProvider>
      <CartProvider>{children}</CartProvider>
    </SessionProvider>
  </QueryClientProvider>
);

//   <UserProvider>
//   </UserProvider>
export default CombinedProvider;
