"use server"
import ProductsModel from "../models/Products";
import UserModel from "../models/User";
// import CModel from "../models/Products";

import { getServerSession } from "next-auth";
import {Cart} from "@/@types/cart.d"
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
// Import the Offers model with the offersSchema
import Offers from '@/models/offers'
import { Response } from "./responseClass";
import { connectDB } from "@/utilities/DB";
// import UserModel from "../models/User";

export async function validateOffers(data:any) {
    try {
        const results = [];
       

        for (const { code, productId, quantity } of data) {
            const foundOffer = await Offers.findOne({code:code});

            if (!foundOffer) {
                throw new Error(`Invalid discount code `);
            }
        

            if (foundOffer.active) {
                if (foundOffer.effect === 'quantity' && quantity < foundOffer.quantityEffect) {
                    throw new Error('Quantity must be at least 1 for this offer');
                }

                const product = await ProductsModel.findById(productId);
                if (!product) {
                    throw new Error(`Product with ID ${productId} not found`);
                }

                const productPrice = product.salePrice ? product.salePrice : product.price;
                let offerDiscountPrice = productPrice;

                if (foundOffer.effect === 'percentage') {
                    const discountPercentage = foundOffer.discount / 100;
                    offerDiscountPrice = productPrice - (productPrice * discountPercentage);
                } else if (foundOffer.effect === 'quantity' || foundOffer.effect === 'flat') {
                    offerDiscountPrice = productPrice - foundOffer.discount;
                }
                const optimizedProduct = {
                    _id: product._id,
                    name: product.name,
                    price: product.price,
                    images: product.images,
                    salePrice: product.salePrice || null,
                    offerDiscountPrice: offerDiscountPrice
                
                }
                results.push({ foundOffer, offerDiscountPrice,optimizedProduct });
            } else {
                throw new Error(`Offer is no longer valid`);
            }
        }

        return Response('Offers applied', 200, true, results);
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
// }


export const createCart = async (data: Cart)=> {
    try {
        await connectDB();


        const session:any = await getServerSession(authOptions);
        
        if (session) {
            const userId = session?.user?._id;
            const user = await UserModel.findOne({_id:userId})
            if(!user){
                throw new Error('No User found')
            }
            user.cart.push(data)
            user.save()
        } else {
            // Handle the case where there is no active session
            console.log("No active session found. Unable to create cart.");
        }

    } catch (error) {
        console.log(`Error creating cart: ${error}`);
        throw error;
    }
};