"use client"
import { Cart, CartAction } from "@/@types/cart";
import React, { useReducer } from "react";
import { createContext, useState } from "react";
import { cartReducer } from "./reducers/cartReducer";

const cartInitialState: Cart = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
  shippingAddress: "",
  paymentMethod: "",
  isPaid: false,
};

export const CartContext = React.createContext<{
  cart: Cart;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // const [cart, setCarts] = useState<Cart | []>([]);
  const [cart, dispatch] = useReducer(cartReducer, cartInitialState);
  // const saveCart = (Cart: ICart) => {
  //   const newCart: ICart = {
  //     id: Math.random(), // not really unique - but fine for this example
  //     title: Cart.title,
  //     description: Cart.description,
  //     status: false,
  //   };
  //   setCarts([...Carts, newCart]);
  // };

  // const updateCart = (id: number) => {
  //   Carts.filter((Cart: ICart) => {
  //     if (Cart.id === id) {
  //       Cart.status = true;
  //       setCarts([...Carts]);
  //     }
  //   });
  // };

  return (
    <CartContext.Provider value={{ cart, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
