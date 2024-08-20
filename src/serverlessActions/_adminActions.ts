"use server";
import { connectDB } from "@/utilities/DB";
import { UserSearch } from "lucide-react";
import { v2 as cloudinary } from "cloudinary";
import UserModel from "../models/User";
import ProductsModel from "../models/Products";
import CategoryModel from "../models/Category";
import ShippingModel from "../models/Shipping";
import OffersModel from "../models/Offers";
import { Response } from "./responseClass";
import { Offer, Product } from "@/@types/products";
import { category } from "@/@types/categories";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function SKUgenerator(amount: number, characters: string) {
  let result = "";
  let formattedCharacters = characters.replaceAll(" ", "");
  const charactersLength = characters.length;
  for (let i = 0; i < amount; i++) {
    result += formattedCharacters.charAt(
      Math.floor(Math.random() * charactersLength)
    );
  }
  return result;
}

export const AdminGetAllUsers = async () => {
  try {
    await connectDB();
    const users = await UserModel.find();
    // console.log(users);
    return JSON.parse(JSON.stringify(users));
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
export const AdminGetSingleUsers = async (id: string) => {
  try {
    await connectDB();
    const user = await UserModel.find({ _id: id });
    if (!user) {
      return null;
    }
    // console.log(user);
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
//We delete previous image if user already have image
//   await cloudinary.v2.uploader.destroy(user?.profilePhoto?.public_id);
//   const cloudPhoto = await cloudinary.v2.uploader.upload(profilePhoto, {
//     folder: "profilePhotos",
//     width: 150,
//   });
//   user.profilePhoto = {
//     public_id: cloudPhoto.public_id,
//     url: cloudPhoto.secure_url,
//   };
// } else {
export const AdminUploadProduct = async (data: any) => {
  try {
    await connectDB();
    if (data.images && Array.isArray(data.images)) {
      const imageUrls = [];
      for (let i = 0; i < data.images.length; i++) {
        const base64Image = data.images[i];
        const publicId = `${data.slug || data.name}-${i}`;
        const uploadedImage = await cloudinary.uploader.upload(base64Image, {
          folder: `products/${data.slug || "unknown"}`,
          public_id: publicId,
        });
        imageUrls.push(uploadedImage.secure_url);
      }
      data.images = imageUrls;
    }
    if (data.variants && Array.isArray(data.variants)) {
      const varaintsModified: { variant: string; image: string }[] = [];
      data.variants.forEach(async (variant: any) => {
        const publicId = `${data.slug || data.name}-${variant.variant}`;
        const uploadedImage = await cloudinary.uploader.upload(variant.image, {
          folder: `products/${data.slug || "unknown"}/variants`,
          public_id: publicId,
        });
        varaintsModified.push({
          variant: variant.variant,
          image: uploadedImage.secure_url,
        });
      });
      data.variants = varaintsModified;
    }
    const SKU = await SKUgenerator(9, data.name);
    data.SKU = SKU.toUpperCase();
    const product = new ProductsModel(data);
    await product.save();

    return Response("Product uploaded successfully", 200, true, product);
  } catch (error) {
    console.error("Error uploading product:", error);
    throw error;
  }
};

export const AdminGetAllProducts = async () => {
  try {
    await connectDB();
    const products: Product[] = await ProductsModel.find();
    return Response("Products fetched successfully", 200, true, products);
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};
export const AdminGetSingleProduct = async (id: string) => {
  try {
    await connectDB();
    const product: Product = await ProductsModel.findOne({ _id: id });
    if (!product) {
      throw new Error("Product not found");
    }
    return Response("Product fetched successfully", 200, true, product);
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};
export const AdminCreateOffer = async (data: Offer) => {
  try {
    // Add your validation logic based on the offer properties
    if (parseInt(data.discount) <= 0) {
      throw new Error("Invalid discount value");
    }
    // Additional validation based on the effect type
    if (
      data.effect === "percentage" &&
      (parseInt(data.discount) <= 0 || parseInt(data.discount) > 100)
    ) {
      throw new Error("Invalid percentage discount");
    }
    if (parseInt(data.quantityEffect) <= 0 && data.effect === "quantity") {
      throw new Error(
        "Invalid quantity discount,quantity effect cannot be 0 or less than 0"
      );
    }
    console.log("creating offer...");
    await connectDB();
    const offer = new OffersModel(data);
    await offer.save();
    return Response("Offer created successfully", 200, true, offer);
  } catch (error) {
    console.error("Error creating offer:", error);
    throw error;
  }
};

export const AdminGetAllOffers = async () => {
  try {
    await connectDB();
    const offers: Offer[] = await OffersModel.find();
    return Response("Offers fetched successfully", 200, true, offers);
  } catch (error) {
    console.error("Error fetching offers:", error);
    throw error;
  }
};

export const AdminCreateCategory = async (data: category) => {
  try {
    await connectDB();
    // console.log(data)
    if (!data.tags || data.tags.length < 1) {
      throw new Error("Tags cannot be empty");
    }
    if (data.image) {
      const cloudPhoto = await cloudinary.uploader.upload(data.image, {
        folder: "categories",
        public_id: data.name,
        // width: 150,
      });
      data.image = cloudPhoto.secure_url;
    }
    const category = new CategoryModel({
      name: data.name,
      image: data.image,
      tags: data.tags,
    });
    // console.log(category)
    await category.save();
    return Response("Category created successfully", 200, true, category);
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

export const AdminGetAllCategories = async () => {
  try {
    await connectDB();
    const categories: category[] = await CategoryModel.find();
    return Response("Categories fetched successfully", 200, true, categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const AdminDeleteCategory = async (id: string) => {
  try {
    await connectDB();
    const category = await CategoryModel.findByIdAndDelete(id);
    return null;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

export const AdminAddShippingData = async (data:{locationBy:string,name:string,price:string | number}) => {
  try {
    await connectDB();
    data.price  = parseInt(data?.price as string);
    const Shipping = new ShippingModel(data);
    console.log(Shipping);
    await Shipping.save();
  } catch (error) {
    console.error("Error adding shipping data:", error);
    throw error;
  }
};

export const AdminAddTeam=async(email:string)=>{
  try{
    await connectDB();
    const user = await UserModel.findOneAndUpdate({email:email},{
      
    })
  }catch(error){
    console.error("Error adding teammate ")
  }
}
