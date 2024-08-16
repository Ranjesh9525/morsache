"use server";
import { connectDB } from "@/utilities/DB";
import ProductsModel from "../models/Products";
import UsersModel from "../models/User";

import { Response } from "./responseClass";

export const UserAddToWishList = async (userId: string, productId: string) => {
  try {
    await connectDB();
    const product = await ProductsModel.findOne({ _id: productId });
    if (!product) {
      throw new Error("Product not found");
    }
    const user = await UsersModel.findOne({ _id: userId });
    if (!user) {
      throw new Error("User not found");
    }
    if (user.wishList.includes(productId)) {
      throw new Error("Product already in wishlist");
    }
    user.wishList.push(productId);
    await user.save();
    return {message:"Product added to wishlist successfully", success: true}
  } catch (error) {
    console.error("Error adding product to wishlist:", error);
    throw error;
  }
};

