"use client";
// import { Shipping, ShippingAction } from "@/@types/Shipping";
import React, { useEffect, useReducer } from "react";
import { createContext, useState } from "react";
import  shippingReducer  from "./reducers/shippingReducer";

// const ShippingInitialState: Shipping =
  
export const ShippingContext = React.createContext<{
  Shipping: {choice: "pickup" | "delivery" | ""};
  dispatch: React.Dispatch<{type: "SET_SHIPPING_CHOICE"; payload: "pickup" | "delivery"}>;
} | null>(null);

const ShippingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
 
 
  const [Shipping, dispatch] = useReducer(shippingReducer, {choice: ""});

  return (
    <ShippingContext.Provider value={{ Shipping, dispatch }}>
      {children}
    </ShippingContext.Provider>
  );
};

export default ShippingProvider;
