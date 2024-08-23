"use server";
import { ShippingAddress } from "@/@types/cart";
import { connectDB } from "@/utilities/DB";
import { Schema } from "mongoose";
import { getServerSession } from "next-auth";
import ProductsModel from "../models/Products";
import UsersModel from "../models/User";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import bcrypt from "bcryptjs"
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

export const UserIsNewUser = async () => {
  try {
    await connectDB();
    const session: any = await getServerSession(authOptions);
    const userId = session!?.user!?._id;
    const user = await UsersModel.findOne({ _id: userId });
    if (!user) {
      throw new Error("User not found");
    }
    if (user.firstName && user.lastName && user.password && user.phoneNumber) {
      return Response("User is not new", 200, true, {
        isNewUser: false,
      });
    }
    return Response("User is new", 200, true, { isNewUser: true });
  } catch (error) {
    console.error("Error checking if user is new:", error);
    throw new Error("Error checking if user is new");
  }
};

export const UserUpdateProfile = async ({
  firstName,
  lastName,
  phoneNumber,
  password
}: {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  password:string
}) => {
  try {
    await connectDB();
    const session: any = await getServerSession(authOptions);
    const userId= session!?.user!?._id;
    const user = await UsersModel.findOne({ _id: userId });
    const hashedPassword = await bcrypt.hash(password, 12)
    console.log("here", userId,
    firstName,
    lastName,
    hashedPassword,
    phoneNumber,)
    // if (userId?.toString() !== userIdFromServer?.toString()) {
    //   console.log("unauthorized")
    //   throw new Error("Unauthorized");
    // }
    if (!user) {
      console.log("user not found")
      throw new Error("User not found");
    }
    user.firstName = firstName;
    user.lastName = lastName;
    user.phoneNumber = phoneNumber;
    user.password = hashedPassword
    await user.save();
    console.log("profile updated")
    return { message: "Profile updated successfully", success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    throw new Error("Error updating profile");
  }
};
