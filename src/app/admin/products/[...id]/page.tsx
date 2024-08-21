"use client";
import React, { useEffect } from "react";
import PageHeadingText from "../../components/PageHeadingText";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormDescription,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClipLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import { format } from "@/components/products/ProductInfo";
import { cn } from "@/lib/utils";
import { MdOutlineDiscount } from "react-icons/md";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import ProductPreview from "../../components/ProductPreview";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { AdminGetSingleProduct } from "@/serverlessActions/_adminActions";
import { useMutation } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import ProductsForm from "../../components/ProductsForm";

type Props = {
  params: { id: string };
};

const Page = ({ params }: Props) => {
  const [dragging, setDragging] = React.useState(false);
  const [imageDimensions, setImageDimensions] = React.useState<any[]>([]);
  const { toast } = useToast();

  const productSchema = z.object({
    name: z.string(),
    description: z.string(),
    category: z.array(z.string()).nonempty(),
    price: z.string(),
    slug: z.string(),
    exchangeAndReturnPolicy: z.string().optional(),
    salePrice: z.string().optional(),
    sizes: z.array(z.string()).nonempty(),
    tags: z.array(z.string()).nonempty(),
    variants: z
      .array(z.object({ variant: z.string(), image: z.string() }))
      .nonempty(),
    offers: z
      .array(
        z.object({
          title: z.string(),
          description: z.string(),
          description2: z.string().optional(),
          discount: z.number(),
        })
      )
      .optional(),
    images: z.array(z.string()).nonempty(),
    stock: z.string(),
    payOnDelivery: z.boolean(),
    moreInformation: z.string().optional(),
  });
  const router = useRouter();
  const variantInput = React.useRef<HTMLInputElement>(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [preview, setPreview] = React.useState(false);
  const [dialogInput, setDialogInput] = React.useState("");

  function slugify(str: string) {
    str = str.replace(/^\s+|\s+$/g, ""); // trim
    str = str.toLowerCase();

    // Replace spaces with -
    str = str.replace(/\s+/g, "-");

    // Remove special characters
    str = str.replace(/[^\w\-]+/g, "");

    return str;
  }
  const updateSelectedOptionArray = (
    fieldValue: string[],
    itemToUpdate: string
  ) => {
    if (fieldValue.includes(itemToUpdate)) {
      return fieldValue.filter((item) => item !== itemToUpdate);
    } else {
      return [...fieldValue, itemToUpdate];
    }
  };
  function onSubmit(values: z.infer<typeof productSchema>) {
    //save as draft to local storage
    // localStorage.setItem("product-draft", JSON.stringify(values));
    // setPreview(true);
    console.log("submitted");
  }
  const {
    isPending,
    isError,
    data: response,
    error,
    mutate: server_getSingleProduct,
  } = useMutation({
    mutationFn: AdminGetSingleProduct,
  });
  useEffect(() => {

  server_getSingleProduct(params.id);
}, [params.id]);

  useEffect(() => {
    if(response){
        console.log("response",response)
    }
    if (isError) {
      console.log("Error while fetching product", error);
      toast({
        title: "Error",
        description: "Error while fetching product see logs",
        variant: "destructive",
      });
    }
  }, [isError,response]);
  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      category: response?.data?.category || [],
      sizes: response?.data?.sizes || [],
      variants: response?.data?.variants || [],
      offers: response?.data?.offers || [],
      tags: response?.data?.tags || [],
      images: response?.data?.images || [],
      name: response?.data?.name || "",
      description: response?.data?.description || "",
      stock: response?.data?.stock || "1",
      price: response?.data?.price || "",
      slug: response?.data?.slug || "",
      exchangeAndReturnPolicy: response?.data?.exchangeAndReturnPolicy || "",
      salePrice: response?.data?.salePrice || "",
      payOnDelivery: response?.data?.payOnDelivery || true,
      moreInformation: response?.data?.moreInformation || "",
    },
  });
  const handleFileChange = (e: any, field: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        if (reader.readyState === 2) {
          form.setValue("images", [
            ...form.getValues("images"),
            reader.result as string,
          ]);
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
        form.setValue("images", [
          ...form.getValues("images"),
          reader.result as string,
        ]);
      };
      reader.readAsDataURL(file);
    }
  };
  useEffect(() => {
    if (localStorage.getItem("product-draft")) {
      toast({
        variant: "default",
        title: "Product draft found",
        description: "You can upload or discard it",
      });
      router.replace("/admin/products/create/?preview=true");
      setPreview(true);
    }
  }, []);
  const handleImageLoad = (
    index: number,
    event: React.SyntheticEvent<HTMLImageElement>
  ) => {
    const { naturalWidth, naturalHeight } = event.currentTarget;
    const newImageDimensions = [...imageDimensions];
    newImageDimensions[index] = { width: naturalWidth, height: naturalHeight };
    setImageDimensions(newImageDimensions);
  };
  //FetchAllCategories
  const categories = ["men", "unisex", "women", "cite", "edef"];
  const tags = [
    "casual",
    "formal",
    "striped",
    "plain",
    "graphic",
    "v-neck",
    "round neck",
    "long sleeve",
    "short sleeve",
    "printed",
    "solid color",
    "collared",
    "button-down",
    "slim fit",
    "loose fit",
    "cotton",
    "polyester",
    "denim",
    "floral",
    "plaid",
  ];
  const sizes = ["xxl", "xl", "l", "m", "sm", "xs"];
  const offers = [
    {
      title: "10% off",
      description: "10% off new users discount",
      description2: "only avaiable on new users",
      discount: 10,
      effect: "percentage",
    },
    {
      title: "20% off",
      description: "20% off all products for 6 months",
      description2: "20% off all products for 6 months",
      discount: 20,
      effect: "percentage",
    },
    {
      title: "50% off",
      description: "Get 50% off when you buy 5 of the same product",
      description2: "only avaiable for 5 of the same product",
      discount: 10,
      effect: "quantity",
    },
    {
      title: "300INR off",
      description: "Get 300INR off when you buy 2 of the same product",
      description2: "only avaiable for 2 of the same product",
      discount: 300,
      effect: "flat",
    },
  ];
  if (isError) {
    <>
      <PageHeadingText
        pageHeading="Edit product"
        description="Here you can make changes to already existing products"
      />
      <div className="container mx-auto min-h-[70vh] py-10 ">
        <h1 className="text-center text-xl">
          Something went wrong,see logs for details{" "}
        </h1>
      </div>
    </>;
  }
  if (preview) {
    return <ProductPreview preview={preview} setPreview={setPreview} />;
  }

  return (
    <>
      <PageHeadingText
        pageHeading="Edit product"
        description="Here you can make changes to already existing products"
      />
      <div className="container mx-auto min-h-[70vh] py-10 ">
        {isPending ? (
          <div className="w-full grid grid-cols-3  gap-6 items-start">
            {Array.from({ length: 13 }).map((_, index) => (
              <div key={index} className="relative flex flex-col bg-white">
                <Skeleton className="h-[120px] w-[200px] rounded-lg mb-3" />
                <Skeleton className="h-[20px] w-[160px] bg-gray-200 mb-1 rounded-lg" />
                <Skeleton className="h-[20px] w-[300px] bg-gray-200 mb-2 rounded-lg" />
                <Skeleton className="h-[40px] w-[300px] bg-gray-200 mb-3 rounded-lg" />
                <Skeleton className="h-[20px] w-[200px] bg-gray-200 mb-1 rounded-lg" />
                <Skeleton className="h-[20px] w-[100px] bg-gray-200 rounded-lg" />
              </div>
            ))}
          </div>
        ) : (
       <ProductsForm data={response?.data}/>
        )}
      </div>
    </>
  );
};

export default Page;
