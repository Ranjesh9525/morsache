"use server";
import { ShippingAddress } from "@/@types/cart";
import { connectDB } from "@/utilities/DB";
import { Schema } from "mongoose";
import { getServerSession } from "next-auth";
import ProductsModel from "../models/Products";
import OrdersModel from "../models/Orders";
import UsersModel from "../models/User";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import bcrypt from "bcryptjs";
import { AppError, ErrorResponse, Response } from "./responseClass";
import { FetchSingleProductByIdOptimized } from "./_fetchActions";
import { authAction } from "./middlewares";
import { Order } from "@/@types/order";
import { cloudinaryDelete, cloudinaryUpload } from "@/utilities/config";

export const UserAddToWishList = async ({
  productId,
}: {
  productId: string;
}) => {
  try {
    await connectDB();
    const product = await ProductsModel.findOne({ _id: productId });
    if (!product) {
      throw new AppError("Product not found",404);
    }
       const user = await authAction();
    if (!user) {
      throw new AppError("User not found",404);
    }
    const wishlistIsExist = user?.wishlist.find((item: any) => {
      return item.productId === productId;
    });
    if (user?.wishlist && wishlistIsExist) {
      return {
        message: "You already have this in your wishlist",
        success: true,
      };
    }
    const prodId = { productId: productId };
    user.wishlist = [prodId, ...user?.wishlist];
    // console.log(user);
    await user.save();

    return { message: "Added to wishlist ❤", success: true };
  } catch (error) {
    console.error("Error adding product to wishlist:", error);
    if (error instanceof AppError) {
      return ErrorResponse(error);
    }

    // For unexpected errors, return a generic error message
    return ErrorResponse({
      message: "Error adding product to wishlist",
      statusCode: 500,
    });
  
  }
};

export const UserGetWishlists = async () => {
  try {
    await connectDB();
       const user = await authAction();
    if (!user) {
      throw new AppError("User not found",404);
    }
    const products = await Promise.all(
      (user?.wishlist || []).map(async (item: any) => {
        const product = await FetchSingleProductByIdOptimized(item?.productId);
        return product.data;
      })
    );
  
    return Response("wishlist fetched", 200, true, products);
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    if (error instanceof AppError) {
      return ErrorResponse(error);
    }

    // For unexpected errors, return a generic error message
    return ErrorResponse({
      message: "An unexpected error occurred",
      statusCode: 500,
    });
  
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
      throw new AppError("User not found",404);
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
    if (error instanceof AppError) {
      return ErrorResponse(error);
    }

    // For unexpected errors, return a generic error message
    return ErrorResponse({
      message: "Error updating shipping address",
      statusCode: 500,
    });
  
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
       const user = await authAction();
    if (!user) {
      throw new AppError("User not found",404);
    }
    if (user.firstName && user.lastName && user.password && user.phoneNumber) {
      return Response("User is not new", 200, true, {
        isNewUser: false,
      });
    }
    return Response("User is new", 200, true, { isNewUser: true });
  } catch (error) {
    console.error("Error checking if user is new:", error);
    if (error instanceof AppError) {
      return ErrorResponse(error);
    }

    // For unexpected errors, return a generic error message
    return ErrorResponse({
      message: "An unexpected error occurred",
      statusCode: 500,
    });
  
  }
};

export const Account = async ({
  firstName,
  lastName,
  phoneNumber,
  password,
}: {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  password: string;
}) => {
  try {
    await connectDB();
       const user = await authAction();
    const hashedPassword = await bcrypt.hash(password, 12);
    // console.log("here", userId,
    // firstName,
    // lastName,
    // hashedPassword,
    // phoneNumber,)
    // if (userId?.toString() !== userIdFromServer?.toString()) {
    //   console.log("unauthorized")
    //   throw new AppError("Unauthorized");
    // }
    if (!user) {
      // console.log("user not found",404);
      throw new AppError("User not found",404);
    }
    user.firstName = firstName;
    user.lastName = lastName;
    user.phoneNumber = phoneNumber;
    user.password = hashedPassword;
    await user.save();
    // console.log("profile updated");
    return { message: "Profile updated successfully", success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    throw new AppError("Error updating profile");
  }
};

export const UserGetAllOrders = async () => {
  try {
    await connectDB();
    const user = await authAction();
    // const orders = user?.orders
    const orders = await OrdersModel.find({ customer: user?._id }).sort({
      createdAt: -1,
    });
    // console.log(orders)
    const optimizedOrders = orders?.map((i: any) => {
      return {
        createdAt: i.createdAt,
        orderStatus: i.orderStatus,
        orderNumber: i.orderNumber,
        totalItems: i.totalItems,
        totalAmount: i.totalAmount,
      };
    });

    return Response(
      "fetched all orders successfully",
      200,
      true,
      optimizedOrders
    );
  } catch (error) {
    console.log("Error getting all user orders", error);
       if (error instanceof AppError) {
      return ErrorResponse(error);
    }

    // For unexpected errors, return a generic error message
    return ErrorResponse({
      message: "An unexpected error occurred",
      statusCode: 500,
    });
  }
  
};

export const UserTrackOrder = async (orderNo: string) => {
  try {
    await connectDB();
    const user = await authAction();
    const order = await OrdersModel.findOne({ orderNumber: orderNo });
    if (!order) {
      throw new AppError("Order not found",404);
    }
    const isUserOrder = user.orders.some(
      (i: { orderId: string; status: string }) => i.orderId === order?._id
    );
    if (!isUserOrder && user.role !== "admin") {
      throw new AppError("Unauthorized access");
    }
    //pickup between 4-7 days , delivery between 7-12 days
    const confirmedDate = order.confirmedOn
      ? new Date(order.confirmedOn)
      : new Date(order.createdAt);
    const ReturnData = {
      orderNumber: order.orderNumber,
      packageSize:
        order.totalItems >= 5
          ? order.totalItems >= 10
            ? "Very large"
            : "large"
          : "Small",
      orderPlacedOn: order.createdAt,
      cancelled: {
        message: "yikes! this order didnt follow through",
        cancelled: order.orderStatus === "cancelled" ? true : false,
      },
      status: order.orderStatus,
      methodOfCollection: order.collectionMethod || "delivery",
      expectedCollectionDate1: order.expectedDeliveryDate1
        ? new Date(order.expectedDeliveryOrPickupDate1)
        : new Date(confirmedDate.getTime() + 7 * 24 * 60 * 60 * 1000),
      expectedCollectionDate2: order.expectedDeliveryDate2
        ? new Date(order.expectedDeliveryOrPickupDate2)
        : new Date(confirmedDate.getTime() + 12 * 24 * 60 * 60 * 1000),
    };
    // console.log(ReturnData);
    return Response("order tracking results", 200, true, ReturnData);
  } catch (error) {
    console.error("Error Tracking order", error);
       if (error instanceof AppError) {
      return ErrorResponse(error);
    }

    // For unexpected errors, return a generic error message
    return ErrorResponse({
      message: "An unexpected error occurred",
      statusCode: 500,
    });
  }
  
};

export const UserUpdateAccountProfile = async (data: any) => {
  try {
    await connectDB();

    const user = await authAction();
    if (data.image) {
      if (user?.image) {
        const publicId = user.image.split("/").pop().split(".")[0];
        await cloudinaryDelete(publicId);
      }
      const cloudPhoto = await cloudinaryUpload(data.image, {
        folder: `profilePhotos/${user.email}`,
      });
      data.image = cloudPhoto.secure_url;
    }
    const updatedUser = await UsersModel.findByIdAndUpdate(
      user._id,
      {
        $set: data,
      },
      { new: true }
    );
    // console.log(updatedUser)
    return Response("updated user", 200, true);
  } catch (error) {
    console.log("Error Updating user profile", error);
    if (error instanceof AppError) {
      return ErrorResponse(error);
    }

    // For unexpected errors, return a generic error message
    return ErrorResponse({
      message: "An unexpected error occurred",
      statusCode: 500,
    });
  
  }
};
