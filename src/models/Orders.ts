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
    expectedDeliveryOrPickupDate1:Date,
    expectedDeliveryOrPickupDate2:Date,
    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered","cancelled", "ready" ,"collected"],
      default: "pending",
    },
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
    shippingPrice: {
      type: Number,
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
    paidOn: {
      type: Date,
      default: null,
    },
   confirmedOn: {
      type: Date,
      default: null,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    collectionMethod:{
      type: String,
      enum: ["pickup", "delivery"],
      required:true
    }
  },
  { timestamps: true }
);

export default mongoose.models.Order  || mongoose.model("Order", orderSchema);
