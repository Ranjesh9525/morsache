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
import { MdOutlineDiscount } from "react-icons/md";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { UserAddToWishList } from "@/serverlessActions/_userActions";
import { toast } from "../ui/use-toast";
import { ClipLoader } from "react-spinners";
type Props = {
  product: Product;
};

export function format(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(value);
}

const ProductInfo = ({ product }: Props) => {
  const { cart, dispatch } = useContext(CartContext)!;
  const [selectedProduct, setSelectedProduct] = useState<CartItem | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>([]);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const { data: session }: any = useSession();
  const router = useRouter();
  const {
    isPending,
    isError,
    isSuccess,
    data: response,
    error,
    mutate: server_addToWishList,
  } = useMutation({
    mutationFn: UserAddToWishList,
    onSuccess: (response) => {
      toast({
        title: `${response?.message}`,
      });
    },
    onError: (error) => {
      console.log("Error:", error);
    },
  });
  // const session = await getSession({ req });

  // console.log(session);

  async function handleAddToWishlist() {
    if (!session) {
      router.push("/auth/login");
    } else {
      const requestData = {  productId: product.id };
      server_addToWishList(requestData);
      // const res = await UserAddToWishList(session!.user?._id,product.id)
      // console.log(res)
    }
  }
  const setProductDetails = () => {
    if (
      (product!?.variants!.length === 0 ||
        (product!?.variants!.length > 0 && selectedVariant.length > 0)) &&
      selectedQuantity !== 0 &&
      selectedSize !== ""
    ) {
      const totalPrice =
        selectedQuantity *
        (parseFloat(product?.salePrice!) || parseFloat(product?.price));
      setSelectedProduct({
        product,
        variant: selectedVariant,
        quantity: selectedQuantity,
        size: selectedSize,
        totalPrice,
      });
    } else {
      console.log(
        "Invalid Add to cart operation : you've not selected all necessary fields"
      );
      toast({
        title: "Please select all fields",
        description: "You must select all fields before adding to cart",
      });
    }
  };

  useEffect(() => {
    if (selectedProduct) {
      console.log("selectedProduct", selectedProduct);
      dispatch({ type: "ADD_TO_CART", payload: selectedProduct });
      toast({
        variant: "default",
        title: "Added to cart",
      });
    } else {
      console.log("selected product is null");
    }
  }, [selectedProduct, dispatch]);

  return (
    <div id="product-information" className="flex flex-col gap-2  h-[200vh]">
      <h1 className="text-3xl font-medium capitalize">{product?.name}</h1>
      <div className="flex text-[13px] gap-0 items-center">
        <StarIcon fill="#f8d122" stroke="0" className="border-0" />
        <StarIcon fill="#f8d122" stroke="0" className="border-none" />
        <StarIcon fill="#f8d122" stroke="0" />
        <StarIcon fill="#f8d122" stroke="0" />
        <StarIcon fill="#f8d122" stroke="0" />
        {product?.purchaseQuantity > 0 ? (
          <p className="text-[#cfb128] text-[15.5px]">
            ({product?.purchaseQuantity})
          </p>
        ) : (
          <p className="text-[#f8d122] text-[15.5px]">({0})</p>
        )}
      </div>
      <div className="mt-5">
        {product?.salePrice ? (
          <h1 className="w-full text-[17px] ">
            {format(parseFloat(product?.salePrice))}
          </h1>
        ) : null}
        <h1
          className={`w-full ${
            product?.salePrice
              ? "text-[14px] line-through  text-gray-400"
              : "text-[17px]"
          }`}
        >
          {format(parseFloat(product?.price))}
        </h1>

        <p className="w-full text-[15px]">{"(incl. of all taxes)"}</p>
      </div>
      <div id="discounts" className="w-[280px] flex flex-col mt-5 ">
        {product?.offers!.map((offer, index: number) => (
          <div
            key={index}
            className="flex items-center  justify-center gap-3 mb-3"
          >
            <CiDiscount1 color="#fea12f" size={35} />

            <p className="w-full text-[12px]">
              {offer.title} <br />
              {offer.effect === "flat" && (
                <>
                  {" "}
                  Get Flat {offer.discount}% Off! <br />
                </>
              )}
              {offer.effect === "percentage" && (
                <>
                  {" "}
                  Get {offer.discount}% Off! <br />
                </>
              )}
              {offer.effect === "quantity" && (
                <>
                  Buy {offer.quantityEffect} Get Quantity Discount! <br />
                </>
              )}
              Code: <b>{offer.code}</b>{" "}
            </p>
          </div>
        ))}
        {/* <div className="flex items-center justify-center gap-3 mb-3">
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
        </div> */}
      </div>
      <hr className="my-4" />
      {product?.variants?.length! > 0 && (
        <>
          <h1 className="capitalize mb-3 text-[18px] font-medium tracking-wider">
            Variants
          </h1>
          <div id="variants" className="flex items-center gap-4">
            {product?.variants!.map((item, index) => {
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
        </>
      )}
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
          {product?.sizes &&
            product?.sizes.map((item, index) => {
              return (
                <span
                  key={index}
                  onClick={() => setSelectedSize(item)}
                  className={cn(
                    "py-3 px-4 border text-[12px] font-light cursor-pointer border-[#545454] rounded-xl hover:text-white hover:bg-[#545454] hover:shadow-lg",
                    selectedSize === item && "bg-[#545454] text-white shadow-lg"
                  )}
                >
                  {item}
                </span>
              );
            })}
        </section>
      </div>
      <div id="buttons" className="my-4 w-full">
        {!selectedSize ||
        (product?.variants?.length! > 0 && selectedVariant.length === 0) ? (
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
          onClick={handleAddToWishlist}
          className="w-full py-6 border-gray-900 font-medium tracking-wider"
        >
          {isPending ? (
            <ClipLoader size={21} />
          ) : (
            <p className="inline-flex">
              Add to wishlist <Heart className="ml-2" stroke="0" fill="red" />
            </p>
          )}
        </Button>
      </div>
      <div id="accordion">
        <Accordion type="multiple">
          {product?.offers && product?.offers?.length > 0 && (
            <AccordionItem value="item-1">
              <AccordionTrigger>Offers</AccordionTrigger>
              <AccordionContent>
                {product?.offers.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className={`flex flex-row items-center gap-2 mb-2 ${
                        index !== product?.offers?.length! - 1 && "border-b"
                      }`}
                    >
                      <MdOutlineDiscount size={20} color="#fea12f" />
                      <div className="flex items-start flex-col gap-1">
                        <h1 className="font-medium">{item.title}</h1>
                        <p>{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </AccordionContent>
            </AccordionItem>
          )}

          <AccordionItem value="item-2">
            <AccordionTrigger>Description</AccordionTrigger>
            <AccordionContent>
              {product?.description && product?.description}
            </AccordionContent>
          </AccordionItem>
          {product?.moreInformation && (
            <AccordionItem value="item-3">
              <AccordionTrigger>More Information</AccordionTrigger>
              <AccordionContent>{product?.moreInformation}</AccordionContent>
            </AccordionItem>
          )}
          {product?.exchangeAndReturnPolicy && (
            <AccordionItem value="item-4">
              <AccordionTrigger>
                Exchange {"&"} return information
              </AccordionTrigger>
              <AccordionContent>
                {product?.exchangeAndReturnPolicy}
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </div>
    </div>
  );
};

export default ProductInfo;
