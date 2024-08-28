"use server";
import { connectDB } from "@/utilities/DB";
import mongoose from "mongoose";
import ProductsModel from "../models/Products";
import StoreModel from "../models/Store";
import CategoryModel from "../models/Category";
import { Response } from "./responseClass";
import { getSession } from "next-auth/react";
import { Product } from "@/@types/products";

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

export const GetProductsByCategory = async (category: string) => {
  try {
    await connectDB();
    const products = await ProductsModel.find({ category: category });
    return Response("products", 200, true, products);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

export const FetchSingleProduct = async (slug: string) => {
  try {
    await connectDB();
    const product = await ProductsModel.findOne({ slug: slug });
    if (!product) {
      return null;
    }
    return Response("product", 200, true, product);
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};
export const FetchSingleProductByIdOptimized = async (id: string) => {
  try {
    await connectDB();
    const product = await ProductsModel.findById(id);
    if (!product) {
      return null;
    }
    const optimizedProduct = {
      _id: product._id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      images: product.images,
      SKU: product.SKU,
      salePrice: product.salePrice || null,
    };
    return Response("product", 200, true, optimizedProduct);
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

export const FetchCategoryData = async (name: string) => {
  try {
    await connectDB();
    const category = await CategoryModel.findOne({ name: name });
    if (!category) {
      return null;
    }
    // console.log(category);
    return Response("category", 200, true, category);
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const FetchProductsFromFilterData = async (
  data: { tag: string; values: string[] }[] | []
) => {
  try {
    await connectDB(); 

    let query: { [key: string]: any } = {}; 

    // Check if data array is empty, return all products
    if (data?.length === 0) {
      const allProducts = await ProductsModel.find();
      return Response("All products", 200, true, allProducts);
    }

   
    for (const { tag, values } of data) {
      if (Array.isArray(values) && values.length > 0) {
        query[tag] = { $in: values };
      }
    }

 
    const products = await ProductsModel.find(query);

    return Response("searched products", 200, true, products);
  } catch (error) {
    console.error("Error fetching products based on filter data:", error);
    throw error;
  }
};

export const FetchSimilarProducts = async (tags: string[]) => {
  try {
    await connectDB();
    // console.log("tags", tags);
    //tags [ 'casual', 'graphic', 'long sleeve', 'collared' ]
    // const similarProducts = await ProductsModel.find({ tags: { $in: tags } })
    //     .sort({ tags: { $size: -1 } })
    //     .limit(12);
    // const similarProducts = await ProductsModel.find({ tags: { $in: tags } })
    // .sort({ $where: `this.tags.filter(value => ${tags}.includes(value)).length` })
    // .exec();
    const allProducts: Product[] = await ProductsModel.find({}).exec();

    const filteredProducts = allProducts.filter((product) =>
      product!.tags!.some((tag) => tags.includes(tag))
    );

    // Sort filtered products based on the number of common tags with the target tags array
    filteredProducts.sort((productA, productB) => {
      const commonTagsA = productA.tags!.filter((tag) =>
        tags.includes(tag)
      ).length;
      const commonTagsB = productB.tags!.filter((tag) =>
        tags.includes(tag)
      ).length;
      return commonTagsB - commonTagsA; // Sort in descending order
    });

    return Response("similar products", 200, true, filteredProducts);

    // return Response("similar products", 200, true, similarProducts );
  } catch (error) {
    console.error("Error fetching similar products:", error);
    throw error;
  }
};

export const FetchCategoriesNamesOnly = async () => {
  try {
    await connectDB();

    const categoriesName = await CategoryModel.find().select("name");

    return Response("categories names", 200, true, categoriesName);
  } catch (error) {
    console.error("Error fetching categories", error);
    throw error;
  }
};

export const FetchStoreData = async () => {
  try {
    await connectDB();
    const store = await StoreModel.findOne();
    if (!store) {
      throw new Error("store not found");
    }
    return Response("store", 200, true, store);
  } catch (error) {
    console.error("Error fetching store", error);
    throw error;
  }
};

export const FetchCategoriesById = async ({
  type,
  id,
}: {
  type: string;
  id: string;
}) => {
  try {
    await connectDB();
    if (type === "category") {
      const category = await CategoryModel.findById(id);
      if (!category) {
        return Response("category not found", 404, false, null);
      }
      const products = await ProductsModel.find({
        category: { $elemMatch: { $eq: category.name } },
      }).select("name")
      .select("slug")
      .select("salePrice")
      .select("price")
      .select("tags")
      .select("sizes")
      .select("images")
      const data = { category: category?.name, items:products };
      // console.log(data)
      return Response("category", 200, true, data);
    }
    if (type === "section") {
      const category = await CategoryModel.findById(id)
        .select("name")
        .select("image").lean();
      if (!category) {
        console.log("category not found")
        return Response("category not found", 404, false, null);
      }
      console.log(category)
      return Response("category", 200, true, category);
    }
  } catch (error) {
    console.error("Error fetching category", error);
    throw error;
  }
};
