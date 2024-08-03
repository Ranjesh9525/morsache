import { Product } from "./products";

// Cart item type
export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  color: string;
  totalPrice: number;
}

// Cart type
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

export type CartAction =
  | { type: "ADD_TO_CART"; payload: CartItem }
  | { type: "REMOVE_FROM_CART"; payload: CartItem };
