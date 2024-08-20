import mongoose from "mongoose";
import { Document, Schema, model } from "mongoose";

export const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  offersData: [
    {
      code: String,
      productId: String,
      quantity: Number,
    },
  ],
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
export const cartSchema = new mongoose.Schema(
  {
    items: [cartItemSchema],
    totalItems: Number,
    totalAmount: Number,
    shippingAddress: [
      {
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
        defaultAddress: {
          type: Boolean,
        },
      },
    ],
    paymentMethod: {
      type: {
        type: String,
        enum: ["razorPay", "stripe", "payOnDelivery"],
      },
      // cardNumber: {
      //   type: String,
      // },
      // cardExpiry: {
      //   type: String,
      // },
      // cardCVV: {
      //   type: String,
      // },
      // paypalEmail: {
      //   type: String,
      // },
    },
    recieveBy: {
      type: String,
      enum: ["delivery", "pickup"],
    },
    shippingPrice: {
      type: Number,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

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
    address: [
      {
        street: String,
        city: String,

        state: String,

        postalCode: String,

        country: String,
        defaultAddress: {
          type: Boolean,
          default: false,
        },
      },
    ],
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
