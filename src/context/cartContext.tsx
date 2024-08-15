"use client";
import { Cart, CartAction } from "@/@types/cart";
import React, { useEffect, useReducer } from "react";
import { createContext, useState } from "react";
import { cartReducer } from "./reducers/cartReducer";

// const cartInitialState: Cart =
 const useLocalStorage = (key: string, defaultValue: Cart) => {
    const [value, setValue] = useState<Cart>(() => {
      if (typeof window !== 'undefined') {
        const savedValue = localStorage.getItem(key);
        return savedValue ? JSON.parse(savedValue) : defaultValue;
      } else {
        return defaultValue;
      }
    });
  
    useEffect(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(value));
      }
    }, [key, value]);
  
    return [value, setValue];
  };
  
export const CartContext = React.createContext<{
  cart: Cart;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
 
  // Usage
  const [cartInitialState, setCartInitialState] = useLocalStorage("cart", {
    items: [],
    totalItems: 0,
    totalAmount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    shippingAddress: "",
    paymentMethod: "",
    isPaid: false,
  });
  // useEffect(() => {
  //   const savedCart = localStorage.getItem("cart");
  //   if (savedCart) {
  //     setCartInitialState(JSON.parse(savedCart));
  //   }
  // }, []);
  const [cart, dispatch] = useReducer(cartReducer, cartInitialState as Cart);
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);
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
