"use server";
import ProductsModel from "../models/Products";
import ShippingModel from "../models/Shipping";
import OrdersModel from "../models/Orders";
import UserModel, { cartSchema } from "../models/User";
// import CModel from "../models/Products";
import crypto from "crypto";
import { getServerSession } from "next-auth";
import { Cart, CartForServer, CartItemForServer } from "@/@types/cart.d";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
// Import the Offers model with the offersSchema
import Offers from "@/models/Offers";
import { AppError, ErrorResponse, Response } from "./responseClass";
import { connectDB } from "@/utilities/DB";
import { ObjectId } from "mongodb";
import { Document } from "mongoose";
import { sendOrderConfirmationEmail } from "./sendMail";
import { FetchSingleProductByIdOptimized } from "./_fetchActions";
import { Order, OrderReviewData } from "@/@types/order";
import { OptimizedProduct } from "@/@types/products";
import { authAction } from "./middlewares";
import { AdminFindCart, AdminGetOrderById } from "./_adminActions";
import AdminModel from "../models/Admin";
// import UserModel from "../models/User";

interface Shipping extends Document {
  locationBy: "street" | "city" | "state" | "postalCode" | "country";
  name: string;
  price: number;
}

export async function validateOffers(data: any) {
  try {
    const results = [];

    for (const { offerId, productId, quantity } of data) {
      const foundOffer = await Offers.findById(offerId);

      if (!foundOffer) {
        throw new AppError(`Invalid discount code `, 400);
      }

      if (foundOffer.active) {
        if (
          foundOffer.effect === "quantity" &&
          quantity < foundOffer.quantityEffect
        ) {
          throw new AppError("Quantity must be at least 1 for this offer", 400);
        }

        const product = await ProductsModel.findById(productId);
        if (!product) {
          throw new AppError(`Product with ID ${productId} not found`, 404);
        }

        const productPrice = product.salePrice
          ? product.salePrice
          : product.price;
        let offerDiscountPrice = productPrice;

        if (foundOffer.effect === "percentage") {
          const discountPercentage = foundOffer.discount / 100;
          offerDiscountPrice = productPrice - productPrice * discountPercentage;
        } else if (
          foundOffer.effect === "quantity" ||
          foundOffer.effect === "flat"
        ) {
          offerDiscountPrice = productPrice - foundOffer.discount;
        }
        const optimizedProduct = {
          _id: product._id,
          name: product.name,
          price: product.price,
          images: product.images,
          salePrice: product.salePrice || null,
          offerDiscountPrice: offerDiscountPrice,
        };
        results.push({ foundOffer, offerDiscountPrice, optimizedProduct });
      } else {
        throw new AppError(`Offer is no longer valid`, 400);
      }
    }
    //there is a general discounted price , be sure to sum up all dicounted prices and set them to that and use it
    return Response("Offers applied", 200, true, results);
  } catch (error) {
    console.log(`Error in validateOffers:`, error);
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

export const createCart = async (data: CartForServer) => {
  try {
    await connectDB();

    const user = await authAction();
    //save cart to user.cart array, but clear out any cart saved there first
    if (user) {
      user.carts = [];
      //   const newArray = [{ _id: cartId ,data}]
      // Generate a random _id for the cart

      const cartId = new ObjectId();
      data._id = cartId;
      // console.log(data);
      // Save new cart data into user.cart array
      user.carts.push(data);

      await user.save();

      const cartIdFromCart = user.carts[0]._id;
      if (!cartIdFromCart) {
        throw new AppError("no cart id");
      }
      // console.log(user);
      return Response("Cart initialized", 200, true, cartIdFromCart);
    } else {
      throw new AppError("No active session found. Unable to create cart.");
    }
  } catch (error) {
    console.log(`Error creating cart: ${error}`);
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

export const findUserCart = async (cartId: string) => {
  try {
    await connectDB();

    const user = await authAction();
    if (!user) {
      throw new AppError("Please login to continue", 401);
    }
    if (user.role === "admin") {
      const results = await AdminFindCart(cartId);
      if (results) {
        return Response("fetched cart", 200, true, results?.data);
      } else {
        throw new AppError("failed to fetch cart", 400);
      }
    } else {
      const cart = user.carts.find(
        (cart: any) => cart._id.toString() === cartId
      );
      if (!cart) {
        throw new AppError("Cart not found", 404);
      }
      if (cart.isPaid) {
        throw new AppError("Cart closed", 400);
      }
      return Response("Cart found", 200, true, cart);
    }
  } catch (error) {
    console.log(`Error finding cart: ${error}`);
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

export const FetchUserCartShippingData = async () => {
  try {
    await connectDB();
    const user = await authAction();
    if (!user) {
      throw new AppError("No User found", 404);
    }
    const cart = user.carts[0];
    if (!cart) {
      throw new AppError("Cart not found", 404);
    }
    const userShippingAddress = user
      .toObject()
      .address.find((address: any) => address.defaultAddress === true);

    // if (!userShippingAddress) {
    //   throw new AppError("No shipping address found",404);
    // }
    // const TotalShippingAddressData: Shipping[] = [];

    // for (const key in userShippingAddress) {
    //   const value = userShippingAddress[key];
    //   const morsacheShippingData: any = await ShippingModel.findOne({
    //     name: value,
    //   }).lean();
    //   if (morsacheShippingData) {
    //     TotalShippingAddressData.push(morsacheShippingData);
    //   }
    // }
    // // console.log(TotalShippingAddressData);
    // //shipping logic: send back the ShuppingObject with the highest price
    // const shippingData = TotalShippingAddressData.reduce((acc: any, curr) => {
    //   if (!acc || curr.price > acc.price) {
    //     return curr;
    //   } else {
    //     return acc;
    //   }
    // }, null);
    // // console.log(shippingData);
    // user.carts[0].shippingAddress = userShippingAddress;
    // user.carts[0].receiveBy = "delivery";
    // if (shippingData) {
    //   user.carts[0].shippingPrice = shippingData?.price;
    //   await user.save();
    //   return Response("shipping data", 200, true, shippingData);
    // }

    // if (!shippingData || shippingData?.length < 1) {
    //   const DefaultShippingData: any = await ShippingModel.findOne({
    //     name: "default",
    //   });
    //   if (!DefaultShippingData) {
    //     throw new AppError("No default shipping data found",404);
    //   } else {
    //     // console.log(DefaultShippingData);
    //     user.carts[0].shippingPrice = DefaultShippingData?.price;
    //     await user.save();
    //     return Response("shipping data", 200, true, DefaultShippingData);
    //   }
    // }

    if (user.carts[0].totalAmount >= 1000) {
      user.carts[0].shippingPrice = 0;
      await user.save();
      const responsePrice={price:0}

      return Response("shipping data", 200, true, responsePrice);
    } else {
      user.carts[0].shippingPrice = 120;
      await user.save();
      const responsePrice={price:120}
      return Response("shipping data", 200, true, responsePrice);
    }
  } catch (error) {
    console.error("Error fetching shipping data", error);
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

export const UpdateCartOrderRecieveBy = async (choice: string) => {
  try {
    await connectDB();
    const user = await authAction();
    if (!user) {
      throw new AppError("No User found", 404);
    }
    console.log(user.carts[0].subtotal);

    if (choice === "pickup" && user.carts[0].receiveBy !== choice) {
      user.carts[0].totalAmount =
        parseInt(user.carts[0].totalAmount) -
        parseInt(user.carts[0].shippingPrice || "0");
    }
    user.carts[0].receiveBy = choice;
    await user.save();
    return Response("shipping data", 200, true);
  } catch (err) {
    console.log("error updating Receive method", err);
    throw err;
  }
};
const generateRandomOrderNumber = () => {
  const randomValue = crypto.randomBytes(12).toString("hex");
  const hash = crypto.createHash("sha256").update(randomValue).digest("hex");

  const orderNumber = hash.substring(0, 24);

  return orderNumber;
};

export const InitializeOrder = async ({
  paymentMethod,
  order: responseFromGateway,
}: {
  paymentMethod: string;
  order: any;
}) => {
  try {
    await connectDB();
    const user = await authAction();
    const adminData = await AdminModel.find();
console.log(adminData)
    const DefaultShippingData: any = await ShippingModel.findOne({
      name: "default",
    });
    if (!user) {
      throw new AppError("No User found", 404);
    }
    const cart: CartForServer = user.carts[0];
    if (!cart) {
      throw new AppError("Cart not found", 404);
    }
    // console.log(cart);
    const cartItems = cart.items;
    const allProducts: any = [];
    for (const item of cartItems) {
      const product = await ProductsModel.findById(item.productId);

      allProducts.push({ item, product });
    }
    if (
      !cart.items ||
      !cart.totalItems ||
      !cart.shippingAddress ||
      cart.shippingPrice == null || cart.shippingPrice == undefined ||
!cart.receiveBy
    ) {
      if (cart.receiveBy === "pickup" && cart.items && cart.totalItems) {
      } else {
console.log(cart)
        throw new AppError(
          "Failed to place order. Order process is incomplete. Try again"
        );
      }
    }
    let allProductsAcceptPayOnDelivery = true;
    const productsNotAcceptingPayOnDelivery = [];

    for (const cartItem of cart.items) {
      const product = await ProductsModel.findOne({ _id: cartItem.productId });
      if (!product || !product.payOnDelivery) {
        allProductsAcceptPayOnDelivery = false;
        productsNotAcceptingPayOnDelivery.push(product?.name || "A product");
      }
    }
    if (!allProductsAcceptPayOnDelivery) {
      console.log(productsNotAcceptingPayOnDelivery);
      throw new AppError("Pay on delivery is not avaliable for this order");
    }

    if (paymentMethod === "razorPay") {
      // const razorPayRequest = await fetch("/api/razorpay", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ amount: cart.totalAmount, currency: "INR" }),
      // });
      // const {
      //   id: order_id,
      //   status,
      //   currency: order_currency,
      //   amount: order_amount,
      // } = await razorPayRequest.json();
      // console.log(razorPayRequest);
      if (responseFromGateway.status === "captured") {
        const order = new OrdersModel({
          orderNumber: responseFromGateway.id,
          customer: user?._id,
          items: cart.items,
          totalItems: cart.totalItems,
          totalAmount: responseFromGateway.amount,
          shippingPrice: cart.shippingPrice || 0,
          orderStatus: adminData[0]?.defaultConfirmOrders
            ? "confirmed"
            : "pending",
          collectionMethod: cart.receiveBy,
          shippingAddress: cart.shippingAddress || "",
          paymentMethod: {
            type: paymentMethod,
          },
          paymentStatus: "paid",
          paidOn: Date.now(),
        });
        await order.save();
        user.carts[0].paymentMethod = { type: paymentMethod };
        user.carts[0].isPaid = true;
        user.orders.push({
          orderId: order._id,
          status: order?.orderStatus,
        });
        await user.save();

        if (!adminData[0]?.defaultConfirmOrders) {
          sendOrderConfirmationEmail(
            order,
            user.email,
            "You placed an order!",
            `Your order with order Number ${order.orderNumber} has been placed and is awaiting confirmation`,
            allProducts,
            user.firstName
          );
        } else {
          sendOrderConfirmationEmail(
            order,
            user.email,
            "Your order has been confirmed!",
            `Your order with order no ${order.orderNumber} has been Confirmed. please check the delivery date`,
            allProducts,
            user.firstName
          );
        }

        return Response("Order created", 200, true, order?.orderNumber);
      } else {
        throw new AppError("Payment failed", 400);
      }
    }

    if (paymentMethod === "payOnDelivery") {
      const order = new OrdersModel({
        orderNumber: generateRandomOrderNumber(),
        customer: user?._id,
        items: cart.items,
        totalItems: cart.totalItems,
        totalAmount:
          cart.totalAmount +
          (cart.receiveBy === "delivery"
            ? parseInt(
                cart?.shippingPrice! || DefaultShippingData?.price || "0"
              )
            : 0),
        shippingPrice: cart.shippingPrice || 0,
        orderStatus: adminData[0]?.defaultConfirmOrders
          ? "confirmed"
          : "pending",
        shippingAddress: cart.shippingAddress || "",

        paymentMethod: {
          type: paymentMethod,
        },
        collectionMethod: cart.receiveBy,
        paymentStatus: "pending",
      });
     //  console.log("order", order);
      await order.save();
      user.carts[0].paymentMethod = { type: paymentMethod };
      user.carts[0].isPaid = true;
      user.orders.push({
        orderId: order._id,
        status: order?.orderStatus,
      });
      await user.save();

      if (!adminData[0]?.defaultConfirmOrders) {
        sendOrderConfirmationEmail(
          order,
          user.email,
          "You placed an order!",
          `Your order with order Number ${order.orderNumber} has been placed and is awaiting confirmation`,
          allProducts,
          user.firstName
        );
        return Response("Order created", 200, true, order?.orderNumber);
      } else {
        order.confirmedOn = new Date(Date.now());
        order.expectedDeliveryOrPickupDate1 = new Date(
          order?.confirmedOn.getTime() + 7 * 24 * 60 * 60 * 1000
        );
        order.expectedDeliveryOrPickupDate2 = new Date(
          order?.confirmedOn.getTime() + 12 * 24 * 60 * 60 * 1000
        );
        await order.save();
        sendOrderConfirmationEmail(
          order,
          user.email,
          "Your order has been confirmed!",
          `Your order with order no ${order.orderNumber} has been Confirmed. please check the delivery date`,
          allProducts,
          user.firstName
        );
        return Response("Order created", 200, true, order?.orderNumber);
      }
    }
  } catch (error) {
    console.error("Error creating order", error);
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

export const CartCheckPayOnDelivery = async () => {
  try {
    await connectDB();
    const user = await authAction();
    if (!user) {
      throw new AppError("No User found", 404);
    }
    const cart: CartForServer = user.carts[0];
    if (!cart) {
      throw new AppError("Cart not found", 404);
    }

    let allProductsAcceptPayOnDelivery = true;
    const productsNotAcceptingPayOnDelivery = [];

    for (const cartItem of cart.items) {
      const product = await ProductsModel.findOne({ _id: cartItem.productId });
      if (!product || !product.payOnDelivery) {
        allProductsAcceptPayOnDelivery = false;
        productsNotAcceptingPayOnDelivery.push(product?.name || "A product");
      }
    }

    const returnData = {
      payOnDelivery: allProductsAcceptPayOnDelivery,
      productsNotAcceptingPayOnDelivery,
    };

    return Response("validated products payment method", 200, true, returnData);
  } catch (error) {
    console.error("Error checking payment methods", error);
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

export const FetchOrderByOrderNo = async (orderNo: string) => {
  try {
    await connectDB();
    // console.log(orderNo)
    const user = await authAction();

    const order: Order = await OrdersModel.findOne({ orderNumber: orderNo });
    if (!order) {
      throw new AppError("Order not found", 404);
    }
    const customer = await UserModel.findOne({ _id: order?.customer });
    if (!user || (order.customer !== user?._id && user?.role !== "admin")) {
      throw new AppError("Unauthorized access");
    }
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
    return Response("order information", 200, true, returnData);
  } catch (error) {
    console.error("Error fetching order", error);
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
