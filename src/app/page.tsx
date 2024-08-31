"use client";
import Navbar from "@/components/general/navbar/Navbar";
import AdsPromotions from "@/components/home/AdsPromotions";
import DisplayBySections from "@/components/home/displayProducts/DisplaySections";
import DisplayProductsByCategory from "@/components/home/displayProducts/DisplayProductsByCategory";
import HeaderAds from "@/components/home/HeaderAds";
import RecentlyViewed from "@/components/general/RecentlyViewed";
import Slider from "@/components/home/slider/Slider";
import HomeLayout from "@/components/layouts/HomeLayout";
import Image from "next/image";
import Protected from "@/_hooks/useProtected";
import { toast } from "@/components/ui/use-toast";
import { useContext, useEffect, useState } from "react";
import { StoreContext } from "@/context/storeContext";
import { FetchCategoriesById } from "@/serverlessActions/_fetchActions";
import { FeaturedCategories } from "@/@types/categories";
import ProductCard from "@/components/general/ProductCard";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
// import { redirect } from "next/navigation";

// import SignInForm from "./SignInForm";
// import VerificationAlert from "./VerificationAlert";

// async function authenticationPrecheck(): Promise<void> {
//   const session = await getServerSession(authOptions)
//   console.log("session from server",session)
//   if (session?.user) return redirect("/account")
// }

// type Props = {};

// const page = async(props: Props) => {
//

export default function Home() {
  // await authenticationPrecheck()
  const category = [
    {
      section: "Something for the summer season",
      items: [
        {
          name: "Cargos",
          image: "/items/category/CARGOS.jpg",
        },
        {
          name: "Check shirts",
          image: "/items/category/Check_Shirts.jpg",
        },
        {
          name: "Basic Tees",
          image: "/items/category/Plus_Size_2.jpg",
        },
        {
          name: "Plus size",
          image: "/items/category/Basics.jpg",
        },
      ],
    },
    {
      section: "Something for the winter season",
      items: [
        {
          name: "Cargos",
          image: "/items/category/CARGOS.jpg",
        },
        {
          name: "Check shirts",
          image: "/items/category/CARGOS.jpg",
        },
        {
          name: "Basic Tees",
          image: "/items/category/CARGOS.jpg",
        },
        {
          name: "Plus size",
          image: "/items/category/CARGOS.jpg",
        },
      ],
    },
    {
      section: "Trending Now",
      items: [
        {
          name: "Cargos",
          image: "/items/category/CARGOS.jpg",
        },
        {
          name: "Check shirts",
          image: "/items/category/CARGOS.jpg",
        },
        {
          name: "Basic Tees",
          image: "/items/category/CARGOS.jpg",
        },
        {
          name: "Plus size",
          image: "/items/category/CARGOS.jpg",
        },
      ],
    },
  ];
  const defaultTabs = [
    {
      category: "Just Added",
      items: [
        {
          id: "23",
          name: "elementary magenta plain pure linen shirt",
          price: "20.00",
          sizes: ["S", "M", "L", "XL"],
          images: [
            "/items/elementary-magenta-plain-pure-linen-shirt1.webp",
            "/items/elementary-magenta-plain-pure-linen-shirt2.webp",
          ],
        },
        {
          id: "14",
          name: "Matteo Grey Checks Shirt",
          price: "20.00",
          sizes: ["S", "M", "L", "XL"],
          images: [
            "/items/Matteo-Grey-Checks-Shirt-1.webp",
            "/items/matteo-grey-checks-shirt2.webp",
          ],
        },
        {
          id: "15",
          name: "Matteo Light Blue Checks Shirt",
          price: "35.00",
          sizes: ["S", "M", "L"],
          images: [
            "/items/Matteo-Light-Blue-Checks-Shirt1.webp",
            "/items/Matteo-Light-Blue-Checks-Shirt2.webp",
          ],
        },
        {
          id: "16",
          name: "brush stroke red shirt",
          price: "25.00",
          sizes: ["S", "M", "L"],
          images: [
            "/items/brush-stroke-red-shirt1.jpg",
            "/items/brush-stroke-red-shirt2.jpg",
          ],
        },
        {
          id: "17",
          name: "Carmine mauve knitted shirt",
          price: "30.00",
          sizes: ["M", "L", "XL"],
          images: [
            "/items/carmine-mauve-knitted-shirt1.webp",
            "/items/carmine-mauve-knitted-shirt2.webp",
          ],
        },
      ],
    },
    {
      category: "Trending",
      items: [
        {
          id: "27",
          name: "Box Stripe Black Shirt",
          price: "35.00",
          sizes: ["S", "L", "XXL"],

          images: [
            "/items/matteo-grey-checks-shirt2.webp",
            "/items/Matteo-Grey-Checks-Shirt-1.webp",
          ],
        },

        {
          id: "28",
          name: "Double Cuff Royal Blue Shirt",
          price: "40.00",
          sizes: ["S", "M", "XL"],
          images: [
            "/items/carmine-mauve-knitted-shirt2.webp",
            "/items/carmine-mauve-knitted-shirt1.webp",
          ],
        },
        {
          id: "29",
          name: "Doric Red Shirt",
          price: "30.00",
          sizes: ["S", "M", "XL", "XXL"],
          images: [
            "/items/elementary-magenta-plain-pure-linen-shirt2.webp",
            "/items/elementary-magenta-plain-pure-linen-shirt1.webp",
          ],
        },
        {
          id: "30",
          name: "Matteo Grey Checks Shirt",
          price: "45.00",
          sizes: ["M", "L"],
          images: [
            "/items/Matteo-Light-Blue-Checks-Shirt1.webp",
            "/items/Matteo-Light-Blue-Checks-Shirt2.webp",
          ],
        },
        {
          id: "31",
          name: "Box Stripe White Shirt",
          price: "45.00",
          sizes: ["M", "L"],
          images: [
            "/items/brush-stroke-red-shirt2.jpg",
            "/items/brush-stroke-red-shirt1.jpg",
          ],
        },
      ],
    },
  ];

  const [featuredCategories, setFeaturedCategories] =
    useState<FeaturedCategories | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [featuredCategoriesData, setFeaturedCategoriesData] =
  //   useState<any>(null);

  const {
    store,
    storeDataIsPending,
    storeDataError,
    storeDataIsError,
    refetchStoreData,
    featuredCategoriesData,
    isFetchingFeaturedCategory,
  } = useContext(StoreContext)!;

  // <Protected>
  return (
    <HomeLayout title="Morsache Clothing">
      <Slider />
      {isFetchingFeaturedCategory || storeDataIsPending ? (
        <>
          <div id="tab-content-1" className="w-full overflow-x-auto mb-8">
            <div
              className=" gap-x-4 items-center justify-center flex whitespace-nowrap ml-[17px] lg:ml-0 p-9"
              style={{ scrollSnapType: "x mandatory" }}
            >
              {Array.from({ length: 5 }).map((_, index) => (
                <ProductCard
                  item={null}
                  index={index}
                  key={index}
                  isLoading={true}
                />
              ))}
            </div>
          </div>
        </>
      ) : (
        <div id="section_wrapper-1">
          {featuredCategoriesData && featuredCategoriesData?.length > 0 ? (
            featuredCategoriesData
              .slice(0, featuredCategoriesData.length - 1)
              .map((item: any, index: number) => {
                if ("name" in item) {
                  return (
                    <DisplayBySections
                      key={index}
                      defaultTabs={item.categories!}
                    />
                  );
                }
                if ("section" in item) {
                  return (
                    <DisplayProductsByCategory key={index} category={item} />
                  );
                }

                return <div key={index}></div>;
              })
          ) : (
            <div></div>
          )}
        </div>
      )}
      <AdsPromotions />
      {isFetchingFeaturedCategory || storeDataIsPending ? (
        <>
          <div id="tab-content-2" className="w-full overflow-x-auto mb-8">
            <div
              className=" gap-x-4 items-center justify-center flex whitespace-nowrap ml-[17px] lg:ml-0 p-9"
              style={{ scrollSnapType: "x mandatory" }}
            >
              {Array.from({ length: 5 }).map((_, index) => (
                <ProductCard
                  item={null}
                  index={index}
                  key={index}
                  isLoading={true}
                />
              ))}
            </div>
          </div>
        </>
      ) : (
        <div id="section_wrapper-2">
          {featuredCategoriesData && featuredCategoriesData?.length > 0 ? (
            featuredCategoriesData
              .slice(featuredCategoriesData.length - 1)
              .map((item: any, index: number) => {
                if ("name" in item) {
                  return (
                    <DisplayBySections
                      key={index}
                      defaultTabs={item.categories!}
                    />
                  );
                }
                if ("section" in item) {
                  return (
                    <DisplayProductsByCategory key={index} category={item} />
                  );
                }

                return <div key={index}></div>;
              })
          ) : (
            <div></div>
          )}
        </div>
      )}
      <RecentlyViewed />
    </HomeLayout>
  );
}
// </Protected>
