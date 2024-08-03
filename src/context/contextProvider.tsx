
import React from "react";
import CartProvider from "./cartContext";
// import { UserProvider } from './context/userContext';

const CombinedProvider = ({ children }: any) => (
  //   <UserProvider>
  <CartProvider>{children}</CartProvider>
  //   </UserProvider>
);

export default CombinedProvider;
