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
import { Response } from "./responseClass";
import { Offer, OptimizedProduct, Product } from "@/@types/products";
import { category } from "@/@types/categories";
import { Order, OrderReviewData } from "@/@types/order";
import { Store } from "@/@types/store";
import Admin from "@/models/Admin";
import { CartItemForServer } from "@/@types/cart";
import { FetchSingleProductByIdOptimized } from "./_fetchActions";
import { sendOrderConfirmationEmail } from "./sendMail";
import { adminAction } from "./middlewares";

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
    throw error;
  }
};
export const AdminGetSingleUsers = async (id: string) => {
  try {
    await connectDB();
    await adminAction();
    const user = await UserModel.findOne({ _id: id }).select("-password");
    if (!user) {
      throw new Error("user not found");
    }
    // console.log(user);
    return Response("fetched user", 200, true, user);
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
    throw error;
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
    throw error;
  }
};
export const AdminGetSingleProduct = async (id: string) => {
  try {
    await connectDB();
    await adminAction();
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
    if (parseInt(data.discount) <= 0) {
      throw new Error("Invalid discount value");
    }

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
    await adminAction();
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
    await adminAction();
    const offers: Offer[] = await OffersModel.find().sort({ createdAt: -1 });
    return Response("Offers fetched successfully", 200, true, offers);
  } catch (error) {
    console.error("Error fetching offers:", error);
    throw error;
  }
};

export const AdminCreateCategory = async (data: category) => {
  try {
    await connectDB();
    await adminAction();
    // console.log(data)
    if (!data.tags || data.tags.length < 1) {
      throw new Error("Tags cannot be empty");
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
    throw error;
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
    throw error;
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
    throw error;
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
    throw error;
  }
};

export const AdminAddTeam = async ({ email }: { email: string }) => {
  try {
    await connectDB();
    await adminAction();
    const user = await UserModel.findOne({ email });

    if (!user) {
      throw new Error("User not found");
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
    throw new Error("Error adding teammate");
  }
};

export const AdminGetAllTeam = async () => {
  try {
    await connectDB();
    await adminAction();
    const Team = await UserModel.find({ role: "admin" }).sort({ email: 1 });
    return Response("Team fetched successfully", 200, true, Team);
  } catch (error) {
    console.error("Error adding teammate ");
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
  }
};

export const AdminGetAllOrders = async () => {
  try {
    await connectDB();
    await adminAction();
    const orders: Order[] = await OrdersModel.find().sort({ createdAt: -1 });
    return Response("Orders fetched successfully", 200, true, orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};
export const AdminUpdateOrder = async (orderNo: string) => {
  try {
    await connectDB();
    await adminAction();
    const order = await OrdersModel.findOne({ orderNumber: orderNo });
    if (!order) {
      throw new Error("Order not found");
    }
    order.orderStatus = "confirmed";
    await order.save();
    return Response("Order confirmed", 200, true);
  } catch (error) {
    console.error("Error confirming order", error);
    throw error;
  }
};

export const AdminUpdateStoreData = async (data: any) => {
  try {
    await connectDB();
    await adminAction();
    const fetchedData: any = await StoreModel.find({});
    const storeData = fetchedData[0];

    if (!storeData) {
      throw new Error("Store data not found");
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
    throw error;
  }
};

export const AdminData = async (data: any) => {
  try {
    await connectDB();
    await adminAction();
    const adminData = await AdminModel.find({});
    // const defaultConfirmOrders = adminData[0].defaultConfirmOrder
    if (!adminData) {
      // throw new Error("Couldnt retrieve admin data");
      await AdminModel.create({ defaultConfirmOrders: true });
    }
    const { defaultConfirmOrder } = data;
    if (defaultConfirmOrder) {
      adminData[0].defaultConfirmOrder = defaultConfirmOrder;
      await adminData[0].save();
    }
    return Response("Store data updated successfully", 200, true, adminData);
  } catch (Error) {
    console.log("Error fetching admin data", Error);
    throw Error;
  }
};

export const AdminDeleteProduct = async (id: string) => {
  try {
    await connectDB();
    await adminAction();
    await ProductsModel.findByIdAndDelete(id);
    return Response("Product deleted", 200, true);
  } catch (Error) {
    console.log("An error occured deleting product", Error);
    throw Error;
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
    console.log(cart);
    if (!cart) {
      throw new Error("Cart not found");
    }
    return Response("Cart found", 200, true, cart?.carts[0]);
  } catch (error) {
    console.log("An error occured finding cart", error);
    throw error;
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
      throw new Error("Order not found");
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
  } catch (err) {
    console.log("error getting order by id", err);
    throw err;
  }
};

export const AdminDeleteOrder = async (orderId: string) => {
  try {
    await connectDB();
    await adminAction();
    await OrdersModel.findByIdAndDelete(orderId);
    return Response("order Deleted successfully", 200, true);
  } catch (err) {
    console.log("Error Deleting order", err);
    throw err;
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
    console.log(updatedOrderData);
    if (updatedOrderData.orderStatus === "confirmed")
      updatedOrderData.confirmedOn = new Date(Date.now());

    const updatedOrder = await OrdersModel.findByIdAndUpdate(
      orderId,
      {
        $set: updatedOrderData,
      },
      { new: true }
    );
    const user = await UserModel.findById(updatedOrder?.customer);
    if (updatedOrderData.orderStatus === updatedOrder.orderStatus) {
      if (updatedOrder.orderStatus === "confirmed")
        sendOrderConfirmationEmail(
          updatedOrder,
          user.email,
          "Your order has been confirmed!",
          `Your order with order no ${updatedOrder.orderNumber} has been Confirmed. please check the delivery date`
        );
      if (updatedOrder.orderStatus === "shipped")
        sendOrderConfirmationEmail(
          updatedOrder,
          user.email,
          "Your order has been shipped!",
          `Your order with order no ${updatedOrder.orderNumber} has been Shipped and will be out for delivery soon. please check the delivery date`
        );
      if (updatedOrder.orderStatus === "delivered")
        sendOrderConfirmationEmail(
          updatedOrder,
          user.email,
          "Thanks for shopping with us",
          `Your order has been delivered successfully. please leave a review on your item`
        );
    }

    console.log("Updated Order:", updatedOrder);

    return Response("Order updated successfully", 200, true);
  } catch (err) {
    console.log("Error updating order", err);
    throw err;
  }
};
