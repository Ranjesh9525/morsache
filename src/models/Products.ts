import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: [String], default: [] },
  price: { type: Number, required: true },
  slug: { type: String, required: true },
  salePrice: { type: Number },
  sizes: { type: [String], default: [] },
  tags: { type: [String], default: [] },
  variants: {
      type: [{
          variant: { type: String },
          image: { type: String }
      }],
      default: []
  },
  images: { type: [String], default: [] },
  rating: { type: Number ,default: 0},
  purchaseQuantity: { type: Number, required: true ,default: 0},
  stock: { type: Number },
  offers: {
      type: [{
          title: { type: String },
          description: { type: String },
          description2: { type: String },
          discount: { type: Number }
      }],
      default: []
  },
  exchangeAndReturnPolicy: { type: String },
  moreInformation: { type: String }

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

