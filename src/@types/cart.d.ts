import { ObjectId } from "mongodb";
import { Product } from "./products";

// Cart item type
export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  variant: string;
  totalPrice: number;
}
export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
  shippingAddress: string;
  paymentMethod: string;
  isPaid: boolean;
}
export interface CartItemForServer {
  product?: Product;
  productId?: string;
  offersData?:{
    code:string,
    quantity:number,
    productId:string;
  }[];
  quantity: number;
  size: string;
  variant: string;
  totalPrice: number;
}

// Cart type
export interface CartForServer {
  _id?:ObjectId;
  items: CartItemForServerm[];
  totalItems: number;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
  shippingAddress: string;
  paymentMethod: string;
  isPaid: boolean;
}

export type CartAction =
  | { type: "ADD_TO_CART"; payload: CartItem }
  | { type: "REMOVE_FROM_CART"; payload: CartItem }
  | { type: "INCREASE"; payload: CartItem }
  | { type: "DECREASE"; payload: CartItem };
