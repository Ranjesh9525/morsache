"use server";
import ProductsModel from "../models/Products";
import ShippingModel from "../models/Shipping";
import UserModel, { cartSchema } from "../models/User";
// import CModel from "../models/Products";

import { getServerSession } from "next-auth";
import { Cart, CartForServer } from "@/@types/cart.d";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
// Import the Offers model with the offersSchema
import Offers from "@/models/Offers";
import { Response } from "./responseClass";
import { connectDB } from "@/utilities/DB";
import { ObjectId } from "mongodb";
import { Document } from "mongoose";
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
    // for (const { items } of data) {

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
      console.log(data);
      // Save new cart data into user.cart array
      user.carts.push(data);

      await user.save();

      const cartIdFromCart = user.carts[0]._id;
      if (!cartIdFromCart) {
        throw new Error("no cart id");
      }
      console.log(user);
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
    const session: any = await getServerSession(authOptions);
    if (session) {
      const userId = session?.user?._id;
      const user = await UserModel.findOne({ _id: userId });
      if (!user) {
        throw new Error("No User found");
      }
      const cart = user.carts.find(
        (cart: any) => cart._id.toString() === cartId
      );
      if (!cart) {
        throw new Error("Cart not found");
      }
      return Response("Cart found", 200, true, cart);
    } else {
      // Handle the case where there is no active session
      console.log("No active session found. Please login.");
      throw new Error("Please login to continue");
    }
  } catch (error) {
    console.log(`Error finding cart: ${error}`);
    throw error;
  }
};

export const FetchUserCartShippingData = async () => {
  try {
    await connectDB();
    const session: any = await getServerSession(authOptions);
    const userId = session!?.user!?._id;
    const user = await UserModel.findOne({ _id: userId });
    if (!user) {
      return null;
    }
    const cart = user.carts[0];
    if (!cart) {
      return null;
    }
    const userShippingAddress = user.shippingAddress.find(
      (address: any) => address.default === true
    );
    if (!userShippingAddress) {
      return null;
    }
    const TotalShippingAddressData: Shipping[] = [];

    for (const key in userShippingAddress) {
      const value = userShippingAddress[key];
      const morsacheShippingData: any = ShippingModel.findOne({ name: value });
      if (morsacheShippingData) {
        TotalShippingAddressData.push(morsacheShippingData);
      }
    }

    //shipping logic: send back the ShuppingObject with the highest price
    const shippingData = TotalShippingAddressData.reduce((acc: any, curr) => {
      if (acc) {
         curr.price > acc.price? (acc = curr) : null;
      }
    }, 0);
    console.log(shippingData)
    user.carts[0].shippingAddress = userShippingAddress;

    if(shippingData){
      user.carts[0].shippingPrice = shippingData?.price;
      await user.save();
    }

    if(!shippingData || shippingData.length < 1){ 
      const DefaultShippingData:any  = ShippingModel.findOne({ name: "default" });
      user.carts[0].shippingPrice = DefaultShippingData?.price;
      await user.save();
      return Response("shipping data", 200, true, DefaultShippingData);
    }

    return Response("shipping data", 200, true, shippingData);
  } catch (error) {
    console.error("Error fetching shipping data", error);
    throw error;
  }
};
