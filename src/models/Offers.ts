import mongoose from "mongoose";
const offersSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  description2: String,
  discount: { type: Number, default: 0 },
  image: String,
  code:String,
  quantityEffect: { type: Number, default: 5 },
  effect: {
    type: String,
    enum: ["flat", "percentage", "quantity"],
    default: "flat",
  },
  active: { type: Boolean, default: true },
});

export default mongoose.models.Offers || mongoose.model("Offers", offersSchema)