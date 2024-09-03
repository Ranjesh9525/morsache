import mongoose, { Document } from 'mongoose';

interface Order extends Document {
    orderNumber: string;
    customer: mongoose.Schema.Types.ObjectId;
    items: CartItem[];
    totalItems: number;
    totalAmount: number;
    orderStatus: 'pending' | 'confirmed' | 'shipped' | 'delivered';
    shippingAddress: {
        street: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
    shippingPrice?: number;
    paymentMethod: {
        type: 'creditCard' | 'razorPay' | 'stripe' | 'payOnDelivery';
        cardNumber?: string;
        cardExpiry?: string;
        cardCVV?: string;
    };
    paymentStatus: 'pending' | 'paid';
    paidOn:Date | null;
    createdAt?:  Date ,
    updatedAt?:  Date ,
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
        type: 'creditCard' | 'razorPay' | 'stripe' | 'payOnDelivery';
        cardNumber?: string;
        cardExpiry?: string;
        cardCVV?: string;
      };
      paymentStatus: 'pending' | 'paid';
    }
    orderDetails: {
      totalAmount: number;
      createdAt?: Date;
      totalItems: number;
      orderStatus: 'pending' | 'confirmed' | 'shipped' | 'delivered';
      orderNumber: string;
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