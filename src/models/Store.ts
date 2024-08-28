import mongoose from "mongoose";

const StoreSchema = new mongoose.Schema({
  carouselImages: [String],
  featuredCategories: [
    {
      type: { type: String, enum: ["categoriesWithProducts", "multipleCategories"], required: true },
      name: String,
      section: String,
      categories: [{ type: String }],
      categoriesId: [{ type: String }],
    }
  ],
  offerImage: String,
  slidingOffers: [
    {
      title: String,
      link: String,
    },
  ],
  footerData: {
    openTime: String,
    socials: {
      whatsapp: String,
      instagram: String,
      youtube: String,
      twitter: String,
      linkedin: String,
      facebook: String,
    },
    storeLocationLink: String,
  },
});

export default mongoose.models.Store || mongoose.model("Store", StoreSchema);
