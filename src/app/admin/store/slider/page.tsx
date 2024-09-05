"use client";
import React, { useEffect, useState } from "react";
import PageHeadingText from "../../components/PageHeadingText";
import { EmblaOptionsType } from "embla-carousel";
import Carousel from "@/components/home/slider/Carousel";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FaPlusCircle } from "react-icons/fa";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AdminUpdateStoreData } from "@/serverlessActions/_adminActions";
import { toast } from "@/components/ui/use-toast";
import { FetchStoreData } from "@/serverlessActions/_fetchActions";
import { ClipLoader } from "react-spinners";
import { Skeleton } from "@/components/ui/skeleton";
import ConfirmationDialog from "@/components/general/ConfirmationDialog";

type Props = {};
const OPTIONS: EmblaOptionsType = { loop: true };
const image = ["/slide/Slide1.jpg", "/slide/Slide2.jpg", "/slide/Slide3.jpg"];

const Page = (props: Props) => {
  const [images, setImages] = useState<string[] | null>(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);
  const [imageToDeleteIndex, setImageToDeleteIndex] = useState<number | null>(
    null
  );

  const handleDeleteImage = () => {
    if (imageToDeleteIndex !== null) {
      const filteredImages = images!?.filter(
        (_, i) => i !== imageToDeleteIndex
      );
      setImages(filteredImages);
      setImageToDeleteIndex(null);
      setOpenDialog(false);
    }
  };
  const handleFileChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        if (reader.readyState === 2) {
          setImages([...images!, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: any) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    setDragging(false);

    const file = e.dataTransfer.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        setImages([...images!, reader.result as string]);
      };
      reader.readAsDataURL(file);
    }
  };

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
      setImages(response?.data?.carouselImages);
    }
  }, [isSuccess, response]);

  const { isPending: uploadCartIsPending, mutate: server_updateStoreData } =
    useMutation({
      mutationFn: AdminUpdateStoreData,
      onSuccess: () => {
        refetch();
        toast({
          variant: "success",
          title: "Success",
          description: "Data updated successfully",
        });
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: <p>{error?.message}</p>,
        });
      },
    });
  return (
    <>
      <PageHeadingText
        pageHeading="Edit Sliding Carousel"
        description="Main attraction in the homeScreen be sure to use images of dimension 1240x760 "
      />

      <ConfirmationDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        onClick={handleDeleteImage}
        dialogTitle={"Are you sure you want to delete this image?"}
      />

      {isPending ? (
        <div className="mx-9">
          <Skeleton className="h-[60vh] bg-gray-200 w-full" />
          <div className="flex my-12 gap-3 w-full flex-row">
            <Skeleton className="w-[180px] h-[100px]" />
            <Skeleton className="w-[180px] h-[100px]" />
            <Skeleton className="w-[180px] h-[100px]" />
            <Skeleton className="w-[180px] h-[100px]" />
          </div>
        </div>
      ) : images ? (
        <div className="px-9">
          <Carousel slides={images} options={OPTIONS} />
          <section className="flex gap-2 my-12 items-center">
            {images.map((item, index) => {
              return (
                <div
                  key={index}
                  onClick={() => {
                    setImageToDeleteIndex(index);
                    setOpenDialog(true);
                  }}
                  className="cursor-pointer"
                >
                  <Image src={item} alt="" width={200} height={200} />
                </div>
              );
            })}
            <div className=" ">
              <input
                type="file"
                accept="image/*"
                id="file"
                className="hidden"
                onChange={(e) => handleFileChange(e)}
              />

              <label
                htmlFor="file"
                className={`w-full min-h-[10vh] rounded-md dark:border-white border-[#00000026] p-3 border flex items-center justify-center ${
                  dragging ? "bg-blue-500" : "bg-transparent"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <span className="text-black text-sm  p-6 items-center cursor-pointer dark:text-white inline-flex gap-3 flex-col">
                  <span className="inline-flex items-center gap-3">
                    <FaPlusCircle />
                    Add Image
                  </span>
                  <p className="text-gray-400 text-[12.5px]">
                    Drag and drop your image here or click to browse
                  </p>
                </span>
              </label>
            </div>
          </section>
          <section>
            <Button
              disabled={uploadCartIsPending}
              type="button"
              onClick={() => {
                const data = { carouselImages: images };
                server_updateStoreData(data);
              }}
              className=""
            >
              {uploadCartIsPending ? (
                <>
                  {" "}
                  <ClipLoader className="mr-2" size={20} color="#ffffff" />{" "}
                  Saving...
                </>
              ) : (
                " Save changes"
              )}
            </Button>
          </section>
        </div>
      ) : (
        <p className="text-lg text-gray-400">
          Something went wrong while fetching images, please try again and check
          logs for details
        </p>
      )}
    </>
  );
};

export default Page;
