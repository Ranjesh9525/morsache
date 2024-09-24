"use client";
import { toast } from "@/components/ui/use-toast";
import { AdminUpdateStoreData } from "@/serverlessActions/_adminActions";
import { FetchStoreData } from "@/serverlessActions/_fetchActions";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import PageHeadingText from "../../components/PageHeadingText";
import { EmblaOptionsType, EmblaCarouselType } from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";
import {
  Form,
  FormField,
  FormItem,
  FormDescription,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { ClipLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import ConfirmationDialog from "@/components/general/ConfirmationDialog";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {};
// Define the interface for the data type
export interface SlidingOffer {
  offerTitle: string;
  link: string;
  linkTitle: string;
}

const sampleObjects: SlidingOffer[] = [
  {
    offerTitle: "Get 50% off on all purchase",
    link: "/search",
    linkTitle: "shop now",
  },
  {
    offerTitle: "Buy one shirt get one free",
    link: "/products/category/shirts",
    linkTitle: "shop shirts",
  },
  {
    offerTitle: "80% off Black shirt",
    link: "/products/black-shirt",
    linkTitle: "buy black shirt",
  },
];

const Page = (props: Props) => {
  const [offers, setOffers] = useState<SlidingOffer[] | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedOfferToRemoveIndex, setSelectedOfferToRemoveIndex] = useState<
    number | null
  >(null);
  const options: EmblaOptionsType = { loop: true, duration: 20 };
  const slides = ["ieniverpv", "weorvoerv", "vrververver"];
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay()]);
  const {
    isPending,
    data: response,
    refetch,
    isSuccess,
  } = useQuery({
    queryKey: ["store"],
    queryFn: () => FetchStoreData(),
  });

  useEffect(() => {
    if (response?.data) {
      setOffers(response?.data?.slidingOffers);
    }
  }, [isSuccess, response]);

  const {
    isPending: uploadStoreDataIsPending,
    mutate: server_updateStoreData,
  } = useMutation({
    mutationFn: AdminUpdateStoreData,
    onSuccess: (res) => {
      if(res?.success == false && res?.data?.error){
        toast({
          variant: "destructive",
          title: "An error occured",
          description: <p>{res?.data?.error?.message}</p>,
        });
      }else{
      refetch();
      toast({
        variant: "success",
        title: "Success",
        description: "Data updated successfully",
      });}
    },
  
  });

  const slidingOffersFormSchema = z.object({
    offerTitle: z.string({
      required_error: "This field cannot be empty",
    }),
    link: z.string().url({ message: "Please enter a valid URL." }).optional(),
    linkTitle: z.string().optional(),
  });

  type SlidingOffersValues = z.infer<typeof slidingOffersFormSchema>;

  const SlidingOffersForm = useForm<SlidingOffersValues>({
    resolver: zodResolver(slidingOffersFormSchema),
    mode: "onChange",
  });

  function onSubmit(data: SlidingOffersValues) {
    const newData = { slidingOffers: offers ? [...offers!, data] : [data] };
    server_updateStoreData(newData);
  }
  function handleRemoveOffer() {
    if (selectedOfferToRemoveIndex !== null) {
      const newOffers = offers?.filter(
        (_, index) => index !== selectedOfferToRemoveIndex
      );
      setOffers(newOffers!);
      const data = { slidingOffers: newOffers };
      server_updateStoreData(data);
    }
    setOpenDialog(false);
  }
  return (
    <>
      <PageHeadingText
        pageHeading="Edit Sliding Offers"
        description="First Component atop store pages, shows set offers in a slider"
      />
      <ConfirmationDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        onClick={handleRemoveOffer}
        dialogTitle={"Are you sure you want to remove this offer?"}
        onClickBtnTitle="Remove"
        loading={uploadStoreDataIsPending}
      />
      <div className="min-h-screen">
        {isPending || uploadStoreDataIsPending ? (
          <div className="mx-9">
            <Skeleton className="h-[60px] bg-gray-200 w-full" />
            <div className="flex my-12 gap-3 w-full px-9 flex-col">
              <Skeleton className="w-[100%] h-[150px] mb-3" />
              <Skeleton className="w-[100%] h-[150px] mb-3" />
              <Skeleton className="w-[100%] h-[150px] mb-3" />
            </div>
          </div>
        ) : offers && offers.length > 0 ? (
          <section>
            <section className="embla my-10">
              <div
                className="overflow-hidden !relative h-[40px]"
                ref={emblaRef}
              >
                <div className="embla__container bg-primary-dark">
                  {offers.map((item: SlidingOffer, index: number) => (
                    <div
                      className="transform   translate-x-0 translate-y-0  translate-z-0 flex-shrink-0 text-white flex flex-col md:flex-row md:items-center uppercase tracking-wider justify-center items-center md:text-[11.5px] text-center text-[0.55rem] p-3 flex-grow-0 flex-basis-[100%] bg-primary-dark w-screen h-[40px] "
                      key={index}
                    >
                      {item.offerTitle}
                      {item?.link && (
                        <Link
                          href={item?.link || "/"}
                          className="underline ml-2 cursor-pointer"
                          target={"_blank"}
                        >
                          {item?.linkTitle || ""}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>
            <section className="px-9 my-4 ">
              {offers.map((offer, index) => {
                return (
                  <div
                    className="flex justify-between items-center max-sm:flex-col mb-3 border-primary p-4 border px-6 rounded-lg"
                    key={index}
                  >
                    <div className="flex flex-col w-full  gap-2 ">
                      <h1>{offer.offerTitle}</h1>
                      <p>Link title {offer.linkTitle || "none"}</p>
                      <p>Link to {offer.link || "none"}</p>
                    </div>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setOpenDialog(true);
                        setSelectedOfferToRemoveIndex(index);
                      }}
                    >
                      Remove Offer
                    </Button>
                  </div>
                );
              })}
            </section>
          </section>
        ) : (
          <p className="text-center text-gray-400 ">
            There is no Sliding offers, add something quickly
          </p>
        )}
        <section id="add-sliding-offer-form" className="px-9 py-6">
          <h1 className="text-xl font-semibold">Add Offer</h1>
          <Form {...SlidingOffersForm}>
            <form
              onSubmit={SlidingOffersForm.handleSubmit(onSubmit)}
              className="space-y-8 grid md:grid-cols-2 gap-4 md:gap-y-2 items-center"
            >
              <FormField
                control={SlidingOffersForm.control}
                name="offerTitle"
                render={({ field }) => (
                  <FormItem>
                    <h1 className="capitalize font-medium tracking-tight text-lg">
                      Offer Title
                    </h1>
                    <FormControl>
                      <Input
                        placeholder="Buy 1 get 1 free for new users"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This is the text you want to be sliding, please keep it
                      simple and attractive
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={SlidingOffersForm.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <h1 className="capitalize font-medium tracking-tight text-lg">
                      Link
                    </h1>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is the link to the page the offer will redirect to
                      when clicked, this is optional, you dont need to add a
                      link
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={SlidingOffersForm.control}
                name="linkTitle"
                render={({ field }) => (
                  <FormItem>
                    <h1 className="capitalize font-medium tracking-tight text-lg">
                      Link Title
                    </h1>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormDescription>
                      {" "}
                      This is the title of the link to be clicked, if you didnt
                      add a link you dont need this, this is also optional evene
                      if you add a link
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <section className="col-span-2">
                <Button
                  disabled={uploadStoreDataIsPending}
                  type="submit"
                  //   onClick={() => {
                  //     const data = { carouselImages: images };
                  //     server_updateStoreData(data);
                  //   }}
                  className=""
                >
                  {uploadStoreDataIsPending ? (
                    <>
                      {" "}
                      <ClipLoader
                        className="mr-2"
                        size={20}
                        color="#ffffff"
                      />{" "}
                      Saving...
                    </>
                  ) : (
                    " Save changes"
                  )}
                </Button>
              </section>
            </form>
          </Form>
        </section>
      </div>
    </>
  );
};

export default Page;
