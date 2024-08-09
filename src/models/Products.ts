import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    slug: { type: String },
    salePrice: { type: Number },
    sizes: { type: [String], required: true },
    colors: { type: [String], required: true },
    images: { type: [String], required: true },
    rating: { type: Number, default: 0 },
    stock: { type: Number, required: true },
    isFeatured: { type: Boolean, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

productSchema.pre("save", async function (next) {
    if (this.slug) {
      next();
    }
    this.slug = this.name.replace(/\s+/g, "-").toLowerCase();
    next();
  });


  export default mongoose.models.Products || mongoose.model('Products', productSchema);

//  ProductModel = mongoose.model("Product", productSchema);

