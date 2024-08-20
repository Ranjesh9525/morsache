import { Document, Schema, model } from "mongoose";

// Define an interface for the User document
export interface UserDocument extends Document {
  _id?: Schema.Types.ObjectId;
  firstName?: string;
  lastName?: string;
  email: string;
  image?: string;
  emailVerified?: Date;
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }[];
  phoneNumber?: string;
  role?: "customer" | "admin";
  orders?: {
    orderId: Schema.Types.ObjectId;
    status: "pending" | "shipped" | "delivered";
  }[];
  wishlist?: {
    productId: Schema.Types.ObjectId;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}
