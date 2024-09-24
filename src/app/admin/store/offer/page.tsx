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

const Page = (props: Props) => {
  const [image, setImage] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);

  const handleFileChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        if (reader.readyState === 2) {
          setImage(reader.result as string);
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
        setImage(reader.result as string);
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
      console.log(response?.data?.offerImage);
      setImage(response?.data?.offerImage);
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
          title: "Error",
          description: <p>{res?.data?.error?.message}</p>,
        });
      }else{
      setOpenDialog(false);
      refetch();
      toast({
        variant: "success",
        title: "Success",
        description: "Data updated successfully",
      });
    }}

  });
  return (
    <>
      <PageHeadingText
        pageHeading="Edit Offer image"
        description="Advertisement of offers in the homepage, Displayed in home page exactly as shown here"
      />
      <ConfirmationDialog
        dialogTitle="Are you sure you want to delete this image?"
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        onClick={() => {
          if (response?.data?.offerImage) {
            const data = { offerImage: "delete" };
            server_updateStoreData(data);
          } else {
            toast({
              variant: "destructive",
              title: "please save first",
            });
          }
        }}
        loading={uploadStoreDataIsPending}
      />
      {isPending ? (
        <div className="mx-9">
          <Skeleton className="h-[60vh] bg-gray-200 w-full" />
        </div>
      ) : (
        <div className="px-9">
          {/* <Carousel slides={images} options={OPTIONS} /> */}
          <section className=" my-12 ">
            {image && (
              <div
                onClick={() => {
                  setOpenDialog(true);
                }}
                className="cursor-pointer w-full h-full"
              >
                <Image
                  src={image}
                  alt=""
                  width={1000}
                  height={1000}
                  className="w-full cursor-pointer object-cover h-full"
                />
              </div>
            )}

            {!image && (
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
            )}
          </section>
          <section>
            <Button
              disabled={uploadStoreDataIsPending}
              type="button"
              onClick={() => {
                const data = { offerImage: image };
                server_updateStoreData(data);
              }}
              className=""
            >
              {uploadStoreDataIsPending ? (
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
      )}
    </>
  );
};

export default Page;
