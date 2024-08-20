import { ObjectId } from "mongodb";
import { Product } from "./products";
interface PaymentMethod {
  type: 'razorPay' | 'stripe' | 'payOnDelivery';
}


interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
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
}
export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
  shippingAddress: ShippingAddress[];
  paymentMethod: PaymentMethod;
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



// interface CartSchema  {
//   items: CartItem[];
//   totalItems: number;
//   totalAmount: number;

//   isPaid: boolean;
// }


// Cart type
export interface CartForServer  {
  _id?:ObjectId;
  items: CartItemForServerm[];
  totalItems: number;
  totalAmount: number;
  shippingAddress?: ShippingAddress[];
  paymentMethod?: PaymentMethod;
  shippingPrice?: number;
  isPaid: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CartAction =
  | { type: "ADD_TO_CART"; payload: CartItem }
  | { type: "REMOVE_FROM_CART"; payload: CartItem }
  | { type: "INCREASE"; payload: CartItem }
  | { type: "DECREASE"; payload: CartItem };
