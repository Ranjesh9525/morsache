import mongoose from "mongoose";
import { cartItemSchema } from "./User";

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [cartItemSchema],
    totalItems: Number,
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered"],
      default: "pending",
    },
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
    paymentMethod: {
      type: {
        type: String,
        enum: ["creditCard", "razorPay", "stripe", "payOnDelivery"],
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
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Orders = mongoose.model("Order", orderSchema);
