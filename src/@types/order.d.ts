import mongoose, { Document } from "mongoose";

interface Order extends Document {
  orderNumber: string;
  customer: mongoose.Schema.Types.ObjectId | string;
  items: CartItem[];
  totalItems: number | string;
  totalAmount: number | string;
  expectedDeliveryOrPickupDate1?:Date | string;
  expectedDeliveryOrPickupDate2?:Date | string;
  orderStatus: "pending" | "confirmed" | "shipped" | "delivered" | "ready" |"collected";
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  confirmedOn?:Date
  shippingPrice?: number | string;
  paymentMethod: {
    type: "creditCard" | "razorPay" | "stripe" | "payOnDelivery";
    cardNumber?: string;
    cardExpiry?: string;
    cardCVV?: string;
  };
  paymentStatus: "pending" | "paid";
  collectionMethod: "delivery" | "pickup";
  paidOn: Date | string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface OrderReviewData {
  products: {
    product: OptimizedProduct;
    quantity: number;
    size: string;
    variant: string;
    totalPrice: number;
  }[];
  paymentDetails: {
    totalAmount: number;
    paidOn: Date | null;
    paymentMethod: {
      type: "creditCard" | "razorPay" | "stripe" | "payOnDelivery";
      cardNumber?: string;
      cardExpiry?: string;
      cardCVV?: string;
    };
    paymentStatus: "pending" | "paid";
  };
  orderDetails: {
    totalAmount: number;
    createdAt?: Date;
    totalItems: number;
    orderStatus: "pending" | "confirmed" | "shipped" | "delivered" | "ready" |"collected";
  collectionMethod: "delivery" | "pickup";
    orderNumber: string;
    expectedDeliveryOrPickupDate1?:Date;
    expectedDeliveryOrPickupDate2?:Date;
  };
  customerDetails: {
    shippingAddress: string;
    firstName: string | undefined;
    lastName: string | undefined;
    email: string | undefined;
    phoneNumber: string | undefined;
  };
}

interface OptimizedOrder {
  createdAt: string;
  orderStatus: string;
  orderNumber: string;
  totalItems: number;
  totalAmount: number;
}
