import mongoose from "mongoose";

const shippingSchema = new mongoose.Schema(
  {
    locationBy: {
      type: String,
      enum: ["street", "city", "state", "postalCode", "country"],
    },
    name: String,
    price: Number,
  },
  { timestamps: true }
);

export default mongoose.models.ShippingPrices ||
  mongoose.model("ShippingPrices", shippingSchema);
