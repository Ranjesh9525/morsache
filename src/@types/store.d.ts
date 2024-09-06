import { Document, ObjectId } from "mongoose";

interface Store extends Document  {
  carouselImages: string[];
  featuredCategories: {
    _id?: string;
    type: {
      type: string;
      enum: ["categoriesWithProducts", "multipleCategories"];
      required: true;
    };
    name?: string;
    section?: string;
    categories?: string[];
    categoriesId?: string[];
  }[];
  offerImage: string;
  slidingOffers: {
    offerTitle: string;
    link: string;
    linkTitle: string;
  }[];
  footerData: {
    openTime: string;
    socials: {
      whatsapp: string;
      instagram: string;
      youtube: string;
      twitter: string;
      linkedin: string;
      facebook: string;
    };
    storeLocationLink: string;
  };
};
