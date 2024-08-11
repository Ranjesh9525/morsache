"use server";
import { connectDB } from "@/utilities/DB";
import { UserSearch } from "lucide-react";
import UserModel from "../models/User";
import ProductsModel from "../models/Products";
import { Response } from "./responseClass";

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

export const AdminUploadProduct = async (data: any) => {
  try {
    await connectDB();
    // console.log(data);
    const product = new ProductsModel(data);
    await product.save();
    // console.log(product)
    return Response("Product uploaded successfully", 200, true, product);
  } catch (error) {
    console.error("Error uploading product:", error);
    throw error;
  }
};

