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
import { Response } from "./responseClass";
import { connectDB } from "@/utilities/DB";
import { ObjectId } from "mongodb";
import { Document } from "mongoose";
import { sendOrderConfirmationEmail } from "./sendMail";
import { FetchSingleProductByIdOptimized } from "./_fetchActions";
import { Order, OrderReviewData } from "@/@types/order";
import { OptimizedProduct } from "@/@types/products";
import authAction from "./middlewares";
import { AdminFindCart, AdminGetOrderById } from "./_adminActions";
// import UserModel from "../models/User";

interface Shipping extends Document {
  locationBy: "street" | "city" | "state" | "postalCode" | "country";
  name: string;
  price: number;
}

export async function validateOffers(data: any) {
  try {
    const results = [];

    for (const { code, productId, quantity } of data) {
      const foundOffer = await Offers.findOne({ code: code });

      if (!foundOffer) {
        throw new Error(`Invalid discount code `);
      }

      if (foundOffer.active) {
        if (
          foundOffer.effect === "quantity" &&
          quantity < foundOffer.quantityEffect
        ) {
          throw new Error("Quantity must be at least 1 for this offer");
        }

        const product = await ProductsModel.findById(productId);
        if (!product) {
          throw new Error(`Product with ID ${productId} not found`);
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
        throw new Error(`Offer is no longer valid`);
      }
    }
    //there is a general discounted price , be sure to sum up all dicounted prices and set them to that and use it
    return Response("Offers applied", 200, true, results);
  } catch (error) {
    console.log(`Error in validateOffers:`, error);
    throw error;
  }
}
// export async function validateOffers(offerId, userId, productId, quantity) {
//     try {

//         const foundOffer = await Offers.findById(offerId);

//         if (!foundOffer) {
//             throw new Error('Offer not found');
//         }

//         if (foundOffer.active) {

//             if (foundOffer.effect === 'quantity' && quantity < foundOffer.quantityEffect) {
//                 throw new Error('Quantity must be at least 1 for this offer');
//             }

//             const product = await ProductsModel.findById(productId);
//             const productPrice = product.salePrice ? product.salePrice : product.price;
//             let offerDiscountPrice =  productPrice
//             if (!product) {
//                 throw new Error('Product not found');
//             }
//             if(foundOffer.effect === 'percentage'){
//                 const discountPercentage = foundOffer.discount / 100;
//                 offerDiscountPrice =  productPrice - ( productPrice * discountPercentage);
//             }
//             if(foundOffer.effect === 'quantity' || foundOffer.effect === 'flat'){
//                 offerDiscountPrice = productPrice - foundOffer.discount;
//             }

//             return Response('Offer applied', 200, true, {offerDiscountPrice: offerDiscountPrice});
//         } else {
//             throw new Error('Offer is not active');
//         }
//     } catch (error) {
//         console.log(`Error in validateOffers:`,error);
//         throw error;
//     }
// }13:32:25.535 | next.js server
//   {
//     items: [
//       {
//         product: {
//           name: 'A star wars Costume',
//           description: 'idsnhviknhewe',
//           category: [ 'men', 'unisex', 'women' ],
//           price: 2339,
//           slug: 'a-star-wars-costume',
//           salePrice: 1999,
//           sizes: [ 'xl', 'xxl', 'm', 'xs' ],
//           tags: [ 'casual', 'graphic', 'long sleeve', 'collared' ],
//           variants: [
//             {
//               variant: 'blue',
//               image: ' ... (length: 85359)',
//               _id: ' ... (length: 24)'
//             },
//             {
//               variant: ' ... (length: 5)',
//               image: ' ... (length: 97471)',
//               _id: ' ... (length: 24)'
//             }
//           ],
//           SKU: ' ... (length: 4)',
//           images: [ ' ... (length: 116)', ' ... (length: 116)' ],
//           rating: 0,
//           purchaseQuantity: 0,
//           stock: 19,
//           offers: [
//             {
//               title: ' ... (length: 7)',
//               description: ' ... (length: 46)',
//               description2: ' ... (length: 39)',
//               discount: 10,
//               _id: ' ... (length: 24)'
//             },
//             {
//               title: ' ... (length: 10)',
//               description: ' ... (length: 49)',
//               description2: ' ... (length: 39)',
//               discount: 300,
//               _id: ' ... (length: 24)'
//             }
//           ],
//           payOnDelivery: true,
//           createdAt: ' ... (length: 24)',
//           updatedAt: ' ... (length: 24)',
//           reviews: [],
//           id: ' ... (length: 24)'
//         },
//         quantity: 2,
//         size: ' ... (length: 3)',
//         variant: ' ... (length: 4)',
//         totalPrice: 4678
//       }
//     ],
//     totalItems: 2,
//     totalAmount: 4678,
//     createdAt: ' ... (length: 24)',
//     updatedAt: ' ... (length: 24)',
//     shippingAddress: '',
//     paymentMethod: '',
//     isPaid: false
//   }

export const createCart = async (data: CartForServer) => {
  try {
    await connectDB();

    const session: any = await getServerSession(authOptions);

    if (session) {
      const userId = session?.user?._id;
      const user = await UserModel.findOne({ _id: userId });
      if (!user) {
        throw new Error("No User found");
      }
      //save cart to user.cart array, but clear out any cart saved there first
      // Clear out any existing cart saved in user.cart array
      user.carts = [];
      //   const newArray = [{ _id: cartId ,data}]
      //   // Save new cart data into user.cart array
      //   user.cart = newArray
      // Generate a random _id for the cart
      const cartId = new ObjectId();
      data._id = cartId;
      // console.log(data);
      // Save new cart data into user.cart array
      user.carts.push(data);

      await user.save();

      const cartIdFromCart = user.carts[0]._id;
      if (!cartIdFromCart) {
        throw new Error("no cart id");
      }
      // console.log(user);
      return Response("Cart initialized", 200, true, cartIdFromCart);
    } else {
      // Handle the case where there is no active session
      console.log("No active session found. Unable to create cart.");
    }
  } catch (error) {
    console.log(`Error creating cart: ${error}`);
    throw error;
  }
};

export const findUserCart = async (cartId: string) => {
  try {
    await connectDB();

    const user = await authAction();
    if (!user) {
      throw new Error("Please login to continue");
    }
    if (user.role === "admin") {
      const results = await AdminFindCart(cartId);
      if (results) {
        return Response("fetched cart", 200, true, results?.data);
      } else {
        throw new Error("failed to fetch cart");
      }
    }else{
    const cart = user.carts.find((cart: any) => cart._id.toString() === cartId);
    if (!cart) {
      throw new Error("Cart not found");
    }
    if (cart.isPaid) {
      throw new Error("Cart closed");
    }
    return Response("Cart found", 200, true, cart);}
  } catch (error) {
    console.log(`Error finding cart: ${error}`);
    throw error;
  }
};

export const FetchUserCartShippingData = async () => {
  try {
    await connectDB();
    const user = await authAction();
    if (!user) {
      throw new Error("No User found");
    }
    const cart = user.carts[0];
    if (!cart) {
      throw new Error("Cart not found");
    }
    const userShippingAddress = user
      .toObject()
      .address.find((address: any) => address.defaultAddress === true);

    if (!userShippingAddress) {
      throw new Error("No shipping address found");
    }
    const TotalShippingAddressData: Shipping[] = [];

    for (const key in userShippingAddress) {
      const value = userShippingAddress[key];
      const morsacheShippingData: any = await ShippingModel.findOne({
        name: value,
      }).lean();
      if (morsacheShippingData) {
        TotalShippingAddressData.push(morsacheShippingData);
      }
    }
    // console.log(TotalShippingAddressData);
    //shipping logic: send back the ShuppingObject with the highest price
    const shippingData = TotalShippingAddressData.reduce((acc: any, curr) => {
      if (!acc || curr.price > acc.price) {
        return curr;
      } else {
        return acc;
      }
    }, null);
    // console.log(shippingData);
    user.carts[0].shippingAddress = userShippingAddress;
    user.carts[0].receiveBy = "delivery";
    if (shippingData) {
      user.carts[0].shippingPrice = shippingData?.price;
      await user.save();
      return Response("shipping data", 200, true, shippingData);
    }

    if (!shippingData || shippingData?.length < 1) {
      const DefaultShippingData: any = await ShippingModel.findOne({
        name: "default",
      });
      if (!DefaultShippingData) {
        throw new Error("No default shipping data found");
      } else {
        // console.log(DefaultShippingData);
        user.carts[0].shippingPrice = DefaultShippingData?.price;
        await user.save();
        return Response("shipping data", 200, true, DefaultShippingData);
      }
    }
  } catch (error) {
    console.error("Error fetching shipping data", error);
    throw error;
  }
};

export const UpdateCartOrderRecieveBy = async (choice: string) => {
  try {
    await connectDB();
    const user = await authAction();
    if (!user) {
      throw new Error("No User found");
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
    if (!user) {
      throw new Error("No User found");
    }
    const cart: CartForServer = user.carts[0];
    if (!cart) {
      throw new Error("Cart not found");
    }
    if (
      !cart.items ||
      !cart.totalItems ||
      !cart.shippingAddress ||
      !cart.shippingPrice ||
      !cart.receiveBy
    ) {
      throw new Error(
        "Failed to place order. Order process is incomplete. Try again"
      );
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
      throw new Error("Pay on delivery is not avaliable for this order");
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
          shippingPrice: cart.shippingPrice,
          orderStatus: "pending",
          collectionMethod: cart.receiveBy,
          shippingAddress: cart.shippingAddress,
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

        sendOrderConfirmationEmail(order, user.email, "You placed an order!");

        return Response("Order created", 200, true, order?._id);
      } else {
        throw new Error("Payment failed");
      }
    }

    if (paymentMethod === "payOnDelivery") {
      const order = new OrdersModel({
        orderNumber: generateRandomOrderNumber(),
        customer: user?._id,
        items: cart.items,
        totalItems: cart.totalItems,
        totalAmount: cart.totalAmount + (parseInt(cart?.shippingPrice!) || 0),
        shippingPrice: cart.shippingPrice,
        orderStatus: "pending",
        shippingAddress: cart.shippingAddress,
        paymentMethod: {
          type: paymentMethod,
        },
        collectionMethod: cart.receiveBy,
        paymentStatus: "pending",
      });
      // console.log("order", order);
      await order.save();
      user.carts[0].paymentMethod = { type: paymentMethod };
      user.carts[0].isPaid = true;
      user.orders.push({
        orderId: order._id,
        status: order?.orderStatus,
      });
      await user.save();
      sendOrderConfirmationEmail(order, user.email, "You placed an order!");
      return Response("Order created", 200, true, order?.orderNumber);
    }
  } catch (error) {
    console.error("Error creating order", error);
    throw error;
  }
};

export const CartCheckPayOnDelivery = async () => {
  try {
    await connectDB();
    const user = await authAction();
    if (!user) {
      throw new Error("No User found");
    }
    const cart: CartForServer = user.carts[0];
    if (!cart) {
      throw new Error("Cart not found");
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
    throw new Error("Error checking payment methods");
  }
};

export const FetchOrderByOrderNo = async (orderNo: string) => {
  try {
    await connectDB();
    // console.log(orderNo)
    const user = await authAction();

    const order: Order = await OrdersModel.findOne({ orderNumber: orderNo });
    if (!order) {
      throw new Error("Order not found");
    }
    const customer = await UserModel.findOne({ _id: order?.customer });
    if (!user || (order.customer !== user?._id && user?.role !== "admin")) {
      throw new Error("Unauthorized access");
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
    throw error;
  }
};
