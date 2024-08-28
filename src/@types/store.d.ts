import { Document } from "mongoose";

interface Store extends Document  {
  carouselImages: string[];
  featuredCategories: {
    section: string;
  } | {
    title: string;
    items: string[];
  }[];
  offerImage: string;
  slidingOffers: {
    title: string;
    link: string;
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
