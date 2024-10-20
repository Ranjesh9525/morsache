import { ObjectId } from "mongodb";
import { Product } from "./products";
interface PaymentMethod {
  type: "razorPay" | "stripe" | "payOnDelivery";
}

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  defaultAddress?: boolean;
}
// Cart item type
export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  variant: string;
  totalPrice: number;
  discountedPrice?: number;
}
export interface Cart {
  _id?: string;
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  subtotal: number;
  createdAt: Date;
  updatedAt: Date;
  shippingPrice?: string;
  shippingAddress: ShippingAddress[];
  paymentMethod?: PaymentMethod;
  receiveBy?: "pickup" | "delivery";
  isPaid: boolean;
}
export interface CartItemForServer {
  _id?: string;
  product?: Product;
  productId?: any;
  offersData?: {
    offerId: string;
    quantity: number;
    productId: string;
  }[];
  quantity: number;
  size: string;

  variant: string;
  totalPrice: number;
  discountedPrice?: number;
}

// interface CartSchema  {
//   items: CartItem[];
//   totalItems: number;
//   totalAmount: number;

//   isPaid: boolean;
// }

// Cart type
export interface CartForServer {
  _id?: ObjectId | string;
  items: CartItemForServer[];
  totalItems: number;
  totalAmount: number;
  subtotal: number;
  shippingAddress?: ShippingAddress[];
  paymentMethod?: PaymentMethod;
  shippingPrice?: string;
  receiveBy?: "pickup" | "delivery";
  isPaid: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CartAction =
  | { type: "ADD_TO_CART"; payload: CartItem }
  | { type: "REMOVE_FROM_CART"; payload: CartItem }
  | { type: "INCREASE"; payload: CartItem }
  | { type: "DECREASE"; payload: CartItem }
  | { type: "CLEAR_CART" };
