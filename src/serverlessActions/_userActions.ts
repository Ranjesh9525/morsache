"use server";
import { ShippingAddress } from "@/@types/cart";
import { connectDB } from "@/utilities/DB";
import { Schema } from "mongoose";
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
    return { message: "Product added to wishlist successfully", success: true };
  } catch (error) {
    console.error("Error adding product to wishlist:", error);
    throw new Error("Error adding product to wishlist:");
  }
};

export const UserUpdateShippingAddress = async ({
  userId,
  address,
}: {
  userId: Schema.Types.ObjectId;
  address: ShippingAddress;
}) => {
  try {
    await connectDB();
    const user = await UsersModel.findOne({ _id: userId });
    if (!user) {
      throw new Error("User not found");
    }
    // console.log(user);
    //this function will destroy this whole action if user address array is empty
    const prevShippingAddress = user?.address.find(
      (a: any) => a.defaultAddress === true
    );
    if (prevShippingAddress) {
      prevShippingAddress.defaultAddress = false;
    }
    const existingAddress = user?.address.findIndex(
      (a: any) =>
        a.street === address.street &&
        a.city === address.city &&
        a.state === address.state
    );
    if (existingAddress !== -1) {
      user.address[existingAddress].defaultAddress = true;
      await user.save();
      return {
        message: "Shipping address updated successfully",
        success: true,
      };
    } else {
      address.defaultAddress = true;
      user.address.unshift(address);
      await user.save();
      return {
        message: "Shipping address Added successfully",
        success: true,
      };
    }
  } catch (error) {
    console.error("Error updating shipping address:", error);
    throw new Error("Error updating shipping address");
  }
};

// const {
//   isPending,
//   isError,
//   data,
//   error,
//   mutate: server_userUpdateShippingAddress,
// } = useMutation({
//   mutationFn: UserUpdateShippingAddress,
// });
