"use server";
import { connectDB } from "@/utilities/DB";
import { UserSearch } from "lucide-react";
import {v2 as cloudinary} from "cloudinary"
import UserModel from "../models/User";
import ProductsModel from "../models/Products";
import OffersModel from "../models/Offers";
import { Response } from "./responseClass";
import { Offer } from "@/@types/products";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY
})

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
export const AdminGetSingleUsers = async ({ id }: { id: string }) => {
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
            public_id: publicId
        });
          imageUrls.push(uploadedImage.secure_url);
      }
      data.images = imageUrls;
  }
    const SKU = SKUgenerator(6, data.name);
    data.SKU = SKU;
    const product = new ProductsModel(data);
    await product.save();

    return Response("Product uploaded successfully", 200, true, product);
  } catch (error) {
    console.error("Error uploading product:", error);
    throw error;
  }
};
// title: z.string(),
// description: z.string(),
// description2: z.string().optional(),
// discount: z.string(),
// code: z.string({
//   required_error:
//     "This code is important, its how users can access this offer",
// }),
// quantityEffect: z.string(),
// effect: z.enum(["flat", "percentage", "quantity"]),
// active: z.boolean(),

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
    console.log("creating offer...")
    await connectDB();
    const offer = new OffersModel(data);
    await offer.save();
    return Response("Offer created successfully", 200, true, offer);
  } catch (error) {
    console.error("Error creating offer:", error);
    throw error;
  }
};
