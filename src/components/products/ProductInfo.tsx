"use client";
import React, { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, StarIcon } from "lucide-react";
import Image from "next/image";
import { CiDiscount1 } from "react-icons/ci";
import { FaCartPlus, FaCartShopping } from "react-icons/fa6";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CartContext } from "@/context/cartContext";
import { Product } from "@/@types/products.d";
import { CartItem } from "@/@types/cart.d";
import { cn } from "@/lib/utils";
type Props = {
  product: Product;
};

const ProductInfo = ({ product }: Props) => {
  const { cart, dispatch } = useContext(CartContext)!;
  const [selectedProduct, setSelectedProduct] = useState<CartItem | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);

  const setProductDetails = () => {
    if (
      selectedVariant !== "" &&
      selectedQuantity !== 0 &&
      selectedSize !== ""
    ) {
      const totalPrice =
        selectedQuantity * (product.salePrice || product.price);
      setSelectedProduct({
        product,
        variant: selectedVariant,
        quantity: selectedQuantity,
        size: selectedSize,
        totalPrice,
      });
    } else {
      //toast message
      console.log("youve not selected all necessary fields");
    }
  };

  useEffect(() => {
    if (selectedProduct) {
      console.log("selectedProduct", selectedProduct);
      dispatch({ type: "ADD_TO_CART", payload: selectedProduct });
    } else {
      console.log("selected product is null");
    }
  }, [selectedProduct, dispatch]);

  return (
    <div id="product-information" className="flex flex-col gap-2  h-[200vh]">
      <h1 className="text-3xl font-medium ">{product.name}</h1>
      <div className="flex text-[13px] gap-0 items-center">
        <StarIcon fill="#f8d122" stroke="0" className="border-0" />
        <StarIcon fill="#f8d122" stroke="0" className="border-none" />
        <StarIcon fill="#f8d122" stroke="0" />
        <StarIcon fill="#f8d122" stroke="0" />
        <StarIcon fill="#f8d122" stroke="0" />
        {product.purchaseQuantity > 0 ? (
          <p className="text-[#cfb128] text-[15.5px]">
            ({product.purchaseQuantity})
          </p>
        ) : (
          <p className="text-[#f8d122] text-[15.5px]">({0})</p>
        )}
      </div>
      <div className="mt-5">
        <h1 className="w-full text-[17px]">INR 1{product.price}0</h1>
        <p className="w-full text-[15px]">{"(incl. of all taxes)"}</p>
      </div>
      <div id="discounts" className="w-[280px] mt-5 ">
        <div className="flex items-center justify-center gap-3 mb-3">
          <CiDiscount1 color="#fea12f" size={35} />
          <p className="w-full text-[12px]">
            Get this for <b>INR 1,199</b> <br />
            Buy 5 {"&"} Get Flat 20% Off! Code:<b>BUY5</b>{" "}
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 mb-3">
          <CiDiscount1 color="#fea12f" size={35} />
          <p className="w-full text-[12px]">
            Get this for <b>INR 1,199</b> <br />
            Buy 5 {"&"} Get Flat 20% Off! Code:<b>BUY5</b>{" "}
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 mb-3">
          <CiDiscount1 color="#fea12f" size={35} />
          <p className="w-full text-[12px]">
            Get this for <b>INR 1,199</b> <br />
            Buy 5 {"&"} Get Flat 20% Off! <br /> Code:<b>BUY5</b>{" "}
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 mb-3">
          <CiDiscount1 color="#fea12f" size={35} />
          <p className="w-full text-[12px]">
            Get this for <b>INR 1,199</b> <br />
            Buy 5 {"&"} Get Flat 20% Off! Code:<b>BUY5</b>{" "}
          </p>
        </div>
      </div>
      <hr className="my-4" />
      <h1 className="capitalize mb-3 text-[18px] font-medium tracking-wider">
        Variants
      </h1>
      <div id="variants" className="flex items-center gap-4">
        {product.variants &&
          product?.variants.map((item,index) => {
            return (
              <Image
              key={index}
                onClick={() => setSelectedVariant(item.variant)}
                src={item.image}
                alt={`${item.variant} variant`}
                width={50}
                height={50}
                className={cn(
                  `cursor-pointer rounded-lg  hover:border-black hover:border`,
                  selectedVariant === item.variant && "border-black border-2"
                )}
              />
            );
          })}
      </div>
      <div id="sizes" className="my-4 ">
        {selectedSize !== "" ? (
          <h1 className="capitalize mb-3 text-[18px] font-medium tracking-wider">
            Sizes
          </h1>
        ) : (
          <h1 className="text-[18px] font-medium tracking-wider capitalize mb-3">
            Choose your preferred size
          </h1>
        )}
        <section className="flex items-center gap-4">
          {product.sizes &&
            product?.sizes.map((item,index) => {
              return (
                <span
                key={index}
                  onClick={() => setSelectedSize(item)}
                  className={cn(
                    "py-3 px-4 border text-[12px] font-light cursor-pointer border-gray-900 rounded-xl hover:text-white hover:bg-gray-900 hover:shadow-lg",
                    selectedSize === item && "bg-gray-900 text-white shadow-lg"
                  )}
                >
                  {item}
                </span>
              );
            })}
        </section>
      </div>
      <div id="buttons" className="my-4 w-full">
        {!selectedSize || !selectedVariant ? (
          <Button
            variant={"ghost"}
            className="w-full mb-3 py-6 bg-gray-100 cursor-text text-gray-500  font-medium tracking-wider"
          >
            Select a {!selectedSize ? "Size" : "Variant"}
          </Button>
        ) : (
          <Button
            variant={"default"}
            className="w-full py-6 mb-3 border-gray-900 font-medium tracking-wider"
            onClick={setProductDetails}
          >
            Add to cart <FaCartPlus className="ml-2" size={24} />
          </Button>
        )}
        <Button
          variant={"outline"}
          className="w-full py-6 border-gray-900 font-medium tracking-wider"
        >
          {" "}
          Add to wishlist <Heart className="ml-2" stroke="0" fill="red" />{" "}
        </Button>
      </div>
      <div id="accordion">
        <Accordion type="multiple">
          {product.offers && product.offers.length > 0 && (
            <AccordionItem value="item-1">
              <AccordionTrigger>Offers</AccordionTrigger>
              <AccordionContent>
                {product?.offers.map((item,index) => {
                  return (
                    <span   key={index} className="flex flex-col gap-2">
                      {" "}
                      <h1>{item.title}</h1>
                      <p>{item.description}</p>
                    </span>
                  );
                })}
              </AccordionContent>
            </AccordionItem>
          )}

          <AccordionItem value="item-2">
            <AccordionTrigger>Description</AccordionTrigger>
            <AccordionContent>
              {product.description && product.description}
            </AccordionContent>
          </AccordionItem>
          {product.moreInformation && (
            <AccordionItem value="item-3">
              <AccordionTrigger>More Information</AccordionTrigger>
              <AccordionContent>{product.moreInformation}</AccordionContent>
            </AccordionItem>
          )}
          {product.exchangeAndReturnPolicy && (
            <AccordionItem value="item-4">
              <AccordionTrigger>
                Exchange {"&"} return information
              </AccordionTrigger>
              <AccordionContent>
                {product.exchangeAndReturnPolicy}
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </div>
    </div>
  );
};

export default ProductInfo;
