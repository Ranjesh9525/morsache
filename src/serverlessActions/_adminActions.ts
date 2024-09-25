"use server";
import { connectDB } from "@/utilities/DB";
import { UserSearch } from "lucide-react";
import { cloudinaryDelete, cloudinaryUpload } from "@/utilities/config";
import UserModel from "../models/User";
import ProductsModel from "../models/Products";
import AdminModel from "../models/Admin";
import CategoryModel from "../models/Category";
import ShippingModel from "../models/Shipping";
import StoreModel from "../models/Store";
import OffersModel from "../models/Offers";
import OrdersModel from "../models/Orders";
import { AppError, ErrorResponse, Response } from "./responseClass";
import { Offer, OptimizedProduct, Product } from "@/@types/products";
import { category } from "@/@types/categories";
import { Order, OrderReviewData } from "@/@types/order";
import { Store } from "@/@types/store";
import Admin from "@/models/Admin";
import { CartItemForServer } from "@/@types/cart";
import { FetchSingleProductByIdOptimized } from "./_fetchActions";
import { sendOrderConfirmationEmail } from "./sendMail";
import { adminAction } from "./middlewares";
import { startOfWeek, endOfWeek, subWeeks, format } from "date-fns";

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
    await adminAction();
    const users = await UserModel.find().sort({ createdAt: -1 });
    // console.log(users);
    return Response("fetched all users", 200, true, users);
  } catch (error) {
    console.error("Error fetching users:", error);
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
export const AdminGetSingleUsers = async (id: string) => {
  try {
    await connectDB();
    await adminAction();
    const user = await UserModel.findOne({ _id: id }).select("-password");
    if (!user) {
      throw new AppError("user not found", 404);
    }
    // console.log(user);
    return Response("fetched user", 200, true, user);
  } catch (error) {
    console.error("Error fetching users:", error);
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
export const AdminUploadProduct = async (data: Product) => {
  try {
    await connectDB();
    await adminAction();
    console.log(data);
    if (data._id) {
      if (data.images && Array.isArray(data.images)) {
        const imageUrls = [];
        for (let i = 0; i < data.images.length; i++) {
          const base64Image = data.images[i];
          if (!base64Image.includes("cloudinary")) {
            const publicId = `${data.slug || data.name}-${i}`;
            const uploadedImage = await cloudinaryUpload(base64Image, {
              folder: `products/${data.slug || "unknown"}`,
              public_id: publicId,
            });
            imageUrls.push(uploadedImage.secure_url);
          } else {
            imageUrls.push(base64Image);
          }
        }
        data.images = imageUrls;
      }
      if (data.variants && Array.isArray(data.variants)) {
        const varaintsModified: { variant: string; image: string }[] = [];
        data.variants.forEach(async (variant: any) => {
          if (!variant.image.includes("cloudinary")) {
            const publicId = `${data.slug || data.name}-${variant.variant}`;
            const uploadedImage = await cloudinaryUpload(variant.image, {
              folder: `products/${data.slug || "unknown"}/variants`,
              public_id: publicId,
            });
            varaintsModified.push({
              variant: variant.variant,
              image: uploadedImage.secure_url,
            });
          } else {
            varaintsModified.push({
              variant: variant.variant,
              image: variant.image,
            });
          }
        });
        data.variants = varaintsModified;
      }
      const updatedProduct = await ProductsModel.findByIdAndUpdate(
        data._id,
        {
          $set: data,
        },
        { new: true }
      );
      return Response(
        "Product updated successfully",
        200,
        true,
        updatedProduct
      );
    } else {
      if (data.images && Array.isArray(data.images)) {
        const imageUrls = [];
        for (let i = 0; i < data.images.length; i++) {
          const base64Image = data.images[i];
          const publicId = `${data.slug || data.name}-${i}`;
          const uploadedImage = await cloudinaryUpload(base64Image, {
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
          const uploadedImage = await cloudinaryUpload(variant.image, {
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
    }
  } catch (error) {
    console.error("Error uploading product:", error);
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

export const AdminGetAllProducts = async () => {
  try {
    await connectDB();
    await adminAction();
    const products: Product[] = await ProductsModel.find().sort({
      createdAt: -1,
    });
    return Response("Products fetched successfully", 200, true, products);
  } catch (error) {
    console.error("Error fetching products:", error);
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
export const AdminGetSingleProduct = async (id: string) => {
  try {
    await connectDB();
    await adminAction();
    const product: Product = await ProductsModel.findOne({ _id: id });
    if (!product) {
      throw new AppError("Product not found", 404);
    }
    return Response("Product fetched successfully", 200, true, product);
  } catch (error) {
    console.error("Error fetching product:", error);
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
export const AdminCreateOffer = async (data: Offer) => {
  try {
    if (parseInt(data.discount) <= 0) {
      throw new AppError("Invalid discount value");
    }

    if (
      data.effect === "percentage" &&
      (parseInt(data.discount) <= 0 || parseInt(data.discount) > 100)
    ) {
      throw new AppError("Invalid percentage discount");
    }
    if (parseInt(data.quantityEffect) <= 0 && data.effect === "quantity") {
      throw new AppError(
        "Invalid quantity discount,quantity effect cannot be 0 or less than 0"
      );
    }
    // console.log("creating offer...");
    await connectDB();
    await adminAction();
    const offer = new OffersModel(data);
    await offer.save();
    return Response("Offer created successfully", 200, true, offer);
  } catch (error) {
    console.error("Error creating offer:", error);
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

export const AdminGetAllOffers = async () => {
  try {
    await connectDB();
    await adminAction();
    const offers: Offer[] = await OffersModel.find().sort({ createdAt: -1 });
    return Response("Offers fetched successfully", 200, true, offers);
  } catch (error) {
    console.error("Error fetching offers:", error);
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
export const AdminDeleteOffer = async (id:string) => {
  try {
    await connectDB();
    await adminAction();
     await OffersModel.findByIdAndDelete(id)
    return Response("Offers deleted successfully", 200, true, null);
  } catch (error) {
    console.error("Error fetching offers:", error);
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

export const AdminCreateCategory = async (data: category) => {
  try {
    await connectDB();
    await adminAction();
    // console.log(data)
    if (!data.tags || data.tags.length < 1) {
      throw new AppError("Tags cannot be empty");
    }
    if (data.image) {
      const cloudPhoto = await cloudinaryUpload(data.image, {
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

export const AdminGetAllCategories = async () => {
  try {
    await connectDB();
    await adminAction();
    const categories: category[] = await CategoryModel.find().sort({
      createdAt: -1,
    });
    return Response("Categories fetched successfully", 200, true, categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
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

export const AdminDeleteCategory = async (id: string) => {
  try {
    await connectDB();
    await adminAction();
    const category = await CategoryModel.findByIdAndDelete(id);
    return null;
  } catch (error) {
    console.error("Error creating category:", error);
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

export const AdminAddShippingData = async (data: {
  locationBy: string;
  name: string;
  price: string | number;
}) => {
  try {
    await connectDB();
    await adminAction();
    data.price = parseInt(data?.price as string);
    const Shipping = new ShippingModel(data);
    console.log(Shipping);
    await Shipping.save();
  } catch (error) {
    console.error("Error adding shipping data:", error);
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

export const AdminAddTeam = async ({ email }: { email: string }) => {
  try {
    await connectDB();
    await adminAction();
    const user = await UserModel.findOne({ email });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    await UserModel.findOneAndUpdate(
      { email: email },
      {
        $set: {
          role: "admin",
        },
      }
    );

    return Response("Teammate added successfully", 200, true);
  } catch (error) {
    console.error("Error adding teammate:", error);
    throw new AppError("Error adding teammate");
  }
};

export const AdminGetAllTeam = async () => {
  try {
    await connectDB();
    await adminAction();
    const Team = await UserModel.find({ role: "admin" }).sort({ email: 1 });
    // return Response("Team fetched successfully", 200, true, Team);
    throw new AppError("failured")
    return null
  } catch (error) {
    console.error("Error adding teammate ");
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

export const AdminGetAllShippingData = async () => {
  try {
    await connectDB();
    await adminAction();
    const ShippingData = await ShippingModel.find({}).sort({ name: 1 });
    return Response("Shipping data fetched", 200, true, ShippingData);
  } catch (error) {
    console.error("Error adding teammate ");
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

export const AdminGetAllOrders = async (status: string) => {
  try {
    await connectDB();
    await adminAction();
    if (status) {
      const orders: Order[] = await OrdersModel.find({
        orderStatus: status,
      }).sort({ createdAt: -1 });
      return Response("Orders fetched successfully", 200, true, orders);
    } else {
      const orders: Order[] = await OrdersModel.find().sort({ createdAt: -1 });
      return Response("Orders fetched successfully", 200, true, orders);
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
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
export const AdminUpdateOrder = async (orderNo: string) => {
  try {
    await connectDB();
    await adminAction();
    const order = await OrdersModel.findOne({ orderNumber: orderNo });
    if (!order) {
      throw new AppError("Order not found", 404);
    }
    order.orderStatus = "confirmed";
    await order.save();
    return Response("Order confirmed", 200, true);
  } catch (error) {
    console.error("Error confirming order", error);
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

export const AdminUpdateStoreData = async (data: any) => {
  try {
    await connectDB();
    await adminAction();
    const fetchedData: any = await StoreModel.find({});
    const storeData = fetchedData[0];

    if (!storeData) {
      throw new AppError("Store data not found", 404);
    }

    const {
      carouselImages,
      featuredCategories,
      offerImage,
      slidingOffers,
      footerData,
    } = data;

    if (carouselImages) {
      const newImages: string[] = [];

      for (let i = 0; i < carouselImages.length; i++) {
        const image = carouselImages[i];
        const publicId = `image${i}`;

        if (!image.includes("cloudinary")) {
          const cloudPhoto = await cloudinaryUpload(image, {
            folder: "store/slider-images",
            public_id: publicId,
          });
          newImages.push(cloudPhoto.secure_url);
        } else {
          newImages.push(image);
        }
      }

      storeData.carouselImages = newImages;

      await storeData.save();
    }
    if (featuredCategories) {
      // console.log(featuredCategories);
      fetchedData[0].featuredCategories = featuredCategories;
      await fetchedData[0].save();
    }
    if (offerImage) {
      if (offerImage === "delete") {
        if (
          storeData.offerImage &&
          storeData.offerImage.includes("cloudinary")
        ) {
          const publicId = storeData.offerImage.split("/").pop().split(".")[0];

          await cloudinaryDelete(publicId);
          storeData.offerImage = "";
          await storeData.save();
          return Response("offer image deleted", 200, true);
        }
      }
      if (!offerImage.includes("cloudinary")) {
        const cloudPhoto = await cloudinaryUpload(offerImage, {
          folder: "store/offer-image",
        });
        storeData.offerImage = cloudPhoto.secure_url;
        await storeData.save();
      } else {
        storeData.offerImage = offerImage;
        await storeData.save();
      }
    }
    if (slidingOffers) {
      storeData.slidingOffers = slidingOffers;
      await storeData.save();
    }
    return Response("Store data updated successfully", 200, true);
  } catch (error) {
    console.error("Error updating store data", error);
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

export const AdminGetAdminData = async () => {
  try {
    await connectDB();
    await adminAction();
    const adminData = await AdminModel.find({});
    // const defaultConfirmOrders = adminData[0].defaultConfirmOrder
    if (!adminData) {
      throw new AppError("Couldnt retrieve admin data");
      // await AdminModel.create({ defaultConfirmOrders: true });
    }

    return Response("Admin data retrieved successfully", 200, true, adminData);
  } catch (error) {
    console.log("Error fetching admin data", error);
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

export const AdminUpdateAdminData = async (data: any) => {
  try {
    await connectDB();
    await adminAction();
    const adminData = await AdminModel.find();
    // const defaultConfirmOrders = adminData[0].defaultConfirmOrder
    if (!adminData) {
      throw new AppError("Couldnt retrieve admin data");
      // await AdminModel.create({ defaultConfirmOrders: true });
    }
    const { defaultConfirmOrders } = data;
    // console.log(data)

    adminData[0].defaultConfirmOrders = defaultConfirmOrders;
    await adminData[0].save();
    // console.log(adminData)
    return Response("Store data updated successfully", 200, true, adminData);
  } catch (Error) {
    console.log("Error updating admin data", Error);
    if (Error instanceof AppError) {
      return ErrorResponse(Error);
    }

    // For unexpected errors, return a generic error message
    return ErrorResponse({
      message: "An unexpected error occurred",
      statusCode: 500,
    });
  }
};

export const AdminDeleteProduct = async (id: string) => {
  try {
    await connectDB();
    await adminAction();
    await ProductsModel.findByIdAndDelete(id);
    return Response("Product deleted", 200, true);
  } catch (error) {
    console.log("An error occured deleting product", error);
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

export const AdminFindCart = async (cartId: string) => {
  try {
    await connectDB();
    await adminAction();
    const allUsers = await UserModel.find({});
    const cart = allUsers.find(
      (user: any) => user.carts[0]?._id.toString() === cartId
    );
    // console.log(cart);
    if (!cart) {
      throw new AppError("Cart not found", 404);
    }
    return Response("Cart found", 200, true, cart?.carts[0]);
  } catch (error) {
    console.log("An error occured finding cart", error);
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

export const AdminGetOrderById = async (orderId: string) => {
  try {
    await connectDB();
    await adminAction();
    // console.log(orderNo)
    // const user = await authAction();
    const order: Order = await OrdersModel.findById(orderId);
    if (!order) {
      throw new AppError("Order not found", 404);
    }
    const customer = await UserModel.findOne({ _id: order?.customer });

    const returnData: OrderReviewData | any = { products: [] };
    await Promise.all(
      order.items.map(async (item: CartItemForServer) => {
        const { quantity, size, variant, totalPrice } = item;
        const product: {
          success: string;
          statusCode: number;
          data: OptimizedProduct;
        } = await FetchSingleProductByIdOptimized(item.productId!);
        if (product) {
          // returnData.products = []
          returnData.products.push({
            product: product?.data,
            quantity,
            size,
            variant,
            totalPrice,
          });
        }
      })
    );
    const {
      totalItems,
      totalAmount,
      createdAt,
      paidOn,
      paymentStatus,
      paymentMethod,
      orderStatus,
      orderNumber,
      shippingAddress,
      expectedDeliveryOrPickupDate1,
      expectedDeliveryOrPickupDate2,
      collectionMethod,
    } = order;
    returnData.paymentDetails = {
      totalAmount,
      paidOn,
      paymentMethod,
      paymentStatus,
    };
    returnData.orderDetails = {
      totalAmount,
      createdAt,
      totalItems,
      orderStatus,
      orderNumber,
      expectedDeliveryOrPickupDate1,
      expectedDeliveryOrPickupDate2,
      collectionMethod,
    };
    const formattedShippingAddress = `${shippingAddress.street},${shippingAddress.city},${shippingAddress.state},${shippingAddress.country}. ${shippingAddress.postalCode}`;
    returnData.customerDetails = {
      shippingAddress: formattedShippingAddress,
      firstName: customer?.firstName,
      lastName: customer?.lastName,
      email: customer?.email,
      phoneNumber: customer?.phoneNumber,
    };

    return Response("order information", 200, true, {
      orderReview: returnData,
      order,
    });
  } catch (error) {
    console.log("error getting order by id", error);
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

export const AdminDeleteOrder = async (orderId: string) => {
  try {
    await connectDB();
    await adminAction();
    await OrdersModel.findByIdAndDelete(orderId);
    return Response("order Deleted successfully", 200, true);
  } catch (error) {
    console.log("Error Deleting order", error);
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

export const AdminEditOrder = async ({
  orderId,
  updatedOrderData,
}: {
  orderId: string;
  updatedOrderData: Partial<Order>;
}) => {
  try {
    await connectDB();
    await adminAction();
    // console.log(updatedOrderData);
    if (updatedOrderData.orderStatus === "confirmed")
      updatedOrderData.confirmedOn = new Date(Date.now());
    const originalOrder = await OrdersModel.findById(orderId);
    const updatedOrder = await OrdersModel.findByIdAndUpdate(
      orderId,
      {
        $set: updatedOrderData,
      },
      { new: true }
    );
    const user = await UserModel.findById(updatedOrder?.customer);
    const cartItems = originalOrder.items;
    const allProducts: any = [];
    for (const item of cartItems) {
      const product = await ProductsModel.findById(item.productId);
      if (
        updatedOrder.orderStatus === "delivered" ||
        updatedOrder.orderStatus === "collected"
      ) {
        product.purchaseQuantity = +1;
        await product.save();
      }
      allProducts.push({ item, product });
    }
    if (updatedOrder.orderStatus !== originalOrder.orderStatus) {
      if (updatedOrder.orderStatus === "confirmed")
        sendOrderConfirmationEmail(
          updatedOrder,
          user.email,
          "Your order has been confirmed!",
          `Your order with order no ${updatedOrder.orderNumber} has been Confirmed. please check the delivery date`,
          allProducts,
          user.firstName
        );
      if (updatedOrder.orderStatus === "shipped")
        sendOrderConfirmationEmail(
          updatedOrder,
          user.email,
          "Your order has been shipped!",
          `Your order with order no ${updatedOrder.orderNumber} has been Shipped and will be out for delivery soon. please check the delivery date`,
          allProducts,
          user.firstName
        );
      if (updatedOrder.orderStatus === "ready")
        sendOrderConfirmationEmail(
          updatedOrder,
          user.email,
          "Your order is ready for pickup!",
          `Your order with order no ${updatedOrder.orderNumber} is ready for pickup.`,
          allProducts,
          user.firstName
        );
      if (updatedOrder.orderStatus === "cancelled")
        sendOrderConfirmationEmail(
          updatedOrder,
          user.email,
          "Your order has been cancelled",
          `Your order with order no ${updatedOrder.orderNumber} has been cancelled , if you think there was a mistake please contact us`,
          allProducts,
          user.firstName
        );
      if (updatedOrder.orderStatus === "collected")
        sendOrderConfirmationEmail(
          updatedOrder,
          user.email,
          "Thanks for shopping with us",
          `Your order has been collected at our store. please leave a review on your item`,
          allProducts,
          user.firstName
        );
      if (updatedOrder.orderStatus === "delivered")
        sendOrderConfirmationEmail(
          updatedOrder,
          user.email,
          "Thanks for shopping with us",
          `Your order has been delivered successfully. please leave a review on your item`,
          allProducts,
          user.firstName
        );
    }

    // console.log("Updated Order:", updatedOrder);

    return Response("Order updated successfully", 200, true);
  } catch (error) {
    console.log("Error updating order", error);
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

interface ChartDataPoint {
  date: string;
  users: number;
}

export async function AdminGetUserChartData(numberOfWeeks: number = 12) {
  try {
    await connectDB();
    await adminAction();

    const chartData: ChartDataPoint[] = [];

    for (let i = 0; i < numberOfWeeks; i++) {
      const endDate = subWeeks(new Date(), i);
      const startDate = startOfWeek(endDate);
      const weekEndDate = endOfWeek(endDate);

      const users = await UserModel.countDocuments({
        createdAt: { $gte: startDate, $lte: weekEndDate },
      });

      chartData.unshift({
        date: format(startDate, "yyyy-MM-dd"),
        users,
      });
    }

    return chartData;
  } catch (error) {
    console.log("Error fetching statistics", error);
    if (error instanceof AppError) {
      return ErrorResponse(error);
    }

    // For unexpected errors, return a generic error message
    return ErrorResponse({
      message: "An unexpected error occurred",
      statusCode: 500,
    });
  }
}

export async function AdminGetTopCategories(): Promise<
  {
    label: string;
    value: number;
  }[]
> {
  try {
    await connectDB();
    await adminAction();

    const topProducts = await ProductsModel.find()
      .sort({ purchaseQuantity: -1 })
      .limit(10);

    const categoryCount = topProducts.reduce((acc, product) => {
      if (Array.isArray(product.category)) {
        product.category.forEach((cat: any) => {
          acc[cat] = (acc[cat] || 0) + 1;
        });
      } else if (typeof product.category === "string") {
        acc[product.category] = (acc[product.category] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const topCategories: any = Object.entries(categoryCount)
      .sort((a: any, b: any) => b[1] - a[1])
      .slice(0, 3)
      .map(([label, value]: any) => ({ label, value }));

    //  console.log("Top 3 categories:", topCategories);

    return topCategories;
  } catch (error) {
    console.error("Error fetching top categories statistics", error);
    throw new AppError("Failed to fetch top categories");
  }
}
export async function AdminGetTopProducts() {
  try {
    await connectDB();
    await adminAction();
    const topProducts = await ProductsModel.find()
      .sort({ purchaseQuantity: -1 })
      .limit(10);
    // console.log(topProducts);
    const chartData: {
      label: string;
      value: number;
    }[] = topProducts.map((product, index) => ({
      label: product.name,
      value: product.purchaseQuantity
    }));
    // console.log(chartData);
    return Response("charts data",200,true,chartData)
  } catch (error) {
    console.log("Error fetching top products statistics", error);
    if (error instanceof AppError) {
      return ErrorResponse(error);
    }

    // For unexpected errors, return a generic error message
    return ErrorResponse({
      message: "An unexpected error occurred",
      statusCode: 500,
    });
  }
}

type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "ready"
  | "collected";

interface OrderChartDataPoint {
  date: string;
  pending: number;
  confirmed: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  ready: number;
  collected: number;
}

export async function AdminGetOrderChartData(numberOfWeeks: number = 12) {
  try {
    await connectDB();
    await adminAction();

    const chartData: OrderChartDataPoint[] = [];

    for (let i = 0; i < numberOfWeeks; i++) {
      const endDate = subWeeks(new Date(), i);
      const startDate = startOfWeek(endDate);
      const weekEndDate = endOfWeek(endDate);

      const orderCounts = await OrdersModel.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: weekEndDate },
          },
        },
        {
          $group: {
            _id: "$orderStatus",
            count: { $sum: 1 },
          },
        },
      ]);

      // console.log(orderCounts)
      const statusCounts: Record<OrderStatus, number> = {
        pending: 0,
        confirmed: 0,
        shipped: 0,
        delivered: 0,
        ready: 0,
        collected: 0,
        cancelled: 0,
      };

      orderCounts.forEach((item: any) => {
        if (item._id in statusCounts) {
          statusCounts[item._id as OrderStatus] = item.count;
        }
      });

      chartData.unshift({
        date: format(startDate, "yyyy-MM-dd"),
        ...statusCounts,
      });
    }

    return Response("charts data",200,true,chartData)
  } catch (error) {
    console.log("Error fetching order statistics", error);
    if (error instanceof AppError) {
      return ErrorResponse(error);
    }

    // For unexpected errors, return a generic error message
    return ErrorResponse({
      message: "An unexpected error occurred",
      statusCode: 500,
    });
  }
}
