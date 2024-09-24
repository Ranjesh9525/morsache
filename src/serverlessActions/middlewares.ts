
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { connectDB } from "@/utilities/DB";
import { getServerSession } from "next-auth";
import UsersModel from "../models/User";
import { AppError, ErrorResponse } from "./responseClass";

export const authAction = async () => {
  try {
    await connectDB();
    const session: any = await getServerSession(authOptions);
    const userId = session?.user?._id;

    if (!userId) {
      throw new AppError('User not logged in',402);
    }

    let user = await UsersModel.findOne({ _id: userId });

    if (!user) {
      // Fetch user from database if not found in session
    //   user = await UsersModel.findOne({ _id: userId });
    throw new AppError('User not found',404); 
    }

    return user;
  } catch (error) {
    console.error('Error in auth action:', error);
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


export const adminAction = async () => {
  try {
    await connectDB();
    const session: any = await getServerSession(authOptions);
    const userId = session?.user?._id;

    if (!userId) {
      throw new AppError('User not logged in',402);
    }

    let user = await UsersModel.findOne({ _id: userId });

    if (!user) {

    throw new AppError('User not found',404); 
    }
    if (user.role !== "admin") {

    throw new AppError('Unauthorized access',401); 
    }

    return user;
  } catch (error) {
    console.error('Error in admin authorization', error);
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

export default authAction;