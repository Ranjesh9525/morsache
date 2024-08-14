"use server";
import { connectDB } from "@/utilities/DB";
import mongoose from "mongoose";
import ProductsModel from "../models/Products";
import CategoryModel from "../models/Category";
import { Response } from "./responseClass";

// Import the Product model

//Sample product data
const sampleProducts = [
  {
    id: "1",
    name: "Product 1",
    description: "Description for Product 1",
    category: "Category 1",
    price: 50,
    slug: "product-1",
    sizes: ["S", "M", "L"],
    colors: ["Red", "Blue"],
    images: [
      "/items/elementary-magenta-plain-pure-linen-shirt1.webp",
      "/items/elementary-magenta-plain-pure-linen-shirt2.webp",
    ],
    rating: 4.5,
    stock: 100,
    isFeatured: true,
  },
  {
    id: "2",
    name: "Product 2",
    description: "Description for Product 2",
    category: "Category 2",
    price: 75,
    slug: "product-2",
    sizes: ["M", "L"],
    colors: ["Green", "Yellow"],
    images: [
      "/items/Matteo-Grey-Checks-Shirt-1.webp",
      "/items/matteo-grey-checks-shirt2.webp",
    ],
    rating: 4.0,
    stock: 80,
    isFeatured: true,
  },
  // Add more sample products as needed
];

export const test = async () => {
  //console.log(data)
  console.log("working");
  return JSON.parse(JSON.stringify({ name: "yourData" }));
};

// Function to insert sample products into the database
export const insertSampleProducts = async () => {
  try {
    console.log("starting");
   await connectDB();
    await ProductsModel.insertMany(sampleProducts);
    console.log("Sample products inserted successfully");
    const products = await ProductsModel.find();
    JSON.parse(JSON.stringify("yourData"));
    return products;
  } catch (error) {
    console.error("Error inserting sample products:", error);
    throw error;
  }
};

export const getProducts = async () => {
  try {
   await connectDB();
    const products = await ProductsModel.find();
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

export const FetchAllCategories = async ({ id }: { id: string }) => {
  try {
    await connectDB();
    const categories = await CategoryModel.find();
    if (!categories) {
      return null;
    }
    // console.log(categories);
    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const FetchSimilarProducts = async (tags:  string[] ) => {
  try {
    await connectDB();

    const similarProducts = await ProductsModel.find({ tags: { $in: tags } })
        .sort({ tags: { $size: -1 } }) //here we sort by the number of matching tags in descending order
        .limit(12);//im sendiog back only 12 items

    return Response("similar products", 200, true, similarProducts );
  } catch (error) {
    console.error("Error fetching similar products:", error);
    throw error;
  }
};