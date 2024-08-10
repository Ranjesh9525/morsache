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
    zipCode: string;
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
      street: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      zipCode: {
        type: String,
      },
      country: {
        type: String,
      },
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
