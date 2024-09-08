"use server";
import { connectDB } from "@/utilities/DB";
import mongoose from "mongoose";
import ProductsModel from "../models/Products";
import OffersModel from "../models/Offers";
import StoreModel from "../models/Store";
import CategoryModel from "../models/Category";
import { Response } from "./responseClass";
import { getSession } from "next-auth/react";
import { Product } from "@/@types/products";

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
    const products = await ProductsModel.find({ category: category }).sort({
      createdAt: -1,
    });
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
    // console.log("product", product);
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
    // console.log("fetched optimized products")
    return Response("product", 200, true, optimizedProduct);
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};
export const FetchMultipleOffers = async (data: any) => {
  try {
    await connectDB();
    console.log(data);
    const allOffer = [];
    for (const offer of data) {
      const res = await OffersModel.findOne({ code: offer.code });
      // const res2 = await OffersModel.find();
      // console.log(res, res2);
      allOffer.push(res);
    }

    console.log(allOffer);
    return Response("offers", 200, true, allOffer);
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
      const allProducts = await ProductsModel.find().sort({ createdAt: -1 });
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
      })
        .select("name slug salePrice price tags sizes images")
        .sort({ createdAt: -1 });
      const data = { category: category?.name, items: products };
      // console.log(data)
      return Response("category", 200, true, data);
    }
    if (type === "section") {
      const category = await CategoryModel.findById(id)
        .select("name")
        .select("image")
        .lean();
      if (!category) {
        console.log("category not found");
        return Response("category not found", 404, false, null);
      }
      // console.log(category)
      return Response("category", 200, true, category);
    }
  } catch (error) {
    console.error("Error fetching category", error);
    throw error;
  }
};
