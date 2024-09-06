
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { connectDB } from "@/utilities/DB";
import { getServerSession } from "next-auth";
import UsersModel from "../models/User";

export const authAction = async () => {
  try {
    await connectDB();
    const session: any = await getServerSession(authOptions);
    const userId = session?.user?._id;

    if (!userId) {
      throw new Error('User not logged in');
    }

    let user = await UsersModel.findOne({ _id: userId });

    if (!user) {
      // Fetch user from database if not found in session
    //   user = await UsersModel.findOne({ _id: userId });
    throw new Error('User not found'); 
    }

    return user;
  } catch (error) {
    console.error('Error in auth action:', error);
    throw error
  }
};


export const adminAction = async () => {
  try {
    await connectDB();
    const session: any = await getServerSession(authOptions);
    const userId = session?.user?._id;

    if (!userId) {
      throw new Error('User not logged in');
    }

    let user = await UsersModel.findOne({ _id: userId });

    if (!user) {

    throw new Error('User not found'); 
    }
    if (user.role !== "admin") {

    throw new Error('Unauthorized access'); 
    }

    return user;
  } catch (error) {
    console.error('Error in admin authorization', error);
    throw error
  }
};

export default authAction;