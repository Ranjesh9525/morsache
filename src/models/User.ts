import mongoose from "mongoose";
import { Document, Schema, model } from 'mongoose';

// Define an interface for the User document
export interface UserDocument extends Document {
    _id?:Schema.Types.ObjectId;
  firstName?: string;
  lastName?: string;
  email: string;
  image?:string;
  emailVerified?:Date;
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  phoneNumber?: string;
  role?: 'customer' | 'admin';
  orders?: {
    orderId: Schema.Types.ObjectId;
    status: 'pending' | 'shipped' | 'delivered';
  }[];
  wishlist?: {
    productId: Schema.Types.ObjectId;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}
export const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  quantity: {
    type: Number,
  },
  size: {
    type: String,
  },
  variant: {
    type: String,
  },
  totalPrice: {
    type: Number,
  },
});
const cartSchema = new mongoose.Schema({
  items: [cartItemSchema],
  totalItems: Number,
  totalAmount: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  shippingAddress: {
    street:String,
    city:  String,
    
    state:  String,
    
    zipCode:  String,
    
    country: String,
    
  },
  paymentMethod: {
    type: {
      type: String,
      enum: ['creditCard', 'razorPay', 'stripe', 'payOnDelivery' ],
    },
    cardNumber: {
      type: String,
    },
    cardExpiry: {
      type: String,
    },
    cardCVV: {
      type: String,
    },
    // paypalEmail: {
    //   type: String,
    // },
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
});

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: { type: String, unique: true },
    emailVerified: Date,
    image: String,
    address: {
      street:String,
      city:  String,
      
      state:  String,
      
      zipCode:  String,
      
      country: String,
      
    },
    phoneNumber: {
      type: String,
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
    orders: [
      {
        orderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Order",
        },
        status: {
          type: String,
          enum: ["pending", "shipped", "delivered"],
          default: "pending",
        },
      },
    ],
    carts: [cartSchema],
    wishlist: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
      },
    ],
    sessions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Session" }],
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
