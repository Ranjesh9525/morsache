"use client";

import { ColumnDef } from "@tanstack/react-table";
import React, { useEffect } from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClipLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import { format } from "@/components/products/ProductInfo";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Form,
  FormField,
  FormItem,
  FormDescription,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
// import { DataTable } from "../components/DataTable";
import PageHeadingText from "@/app/admin/components/PageHeadingText";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useMutation } from "@tanstack/react-query";
import { Offer } from "@/@types/products";
import { AdminCreateCategory, AdminCreateOffer } from "@/serverlessActions/_adminActions";
import { category } from "@/@types/categories";
import { PlusCircleIcon } from "lucide-react";
import Image from "next/image";

type Props = {};

// Generate 5 random offers
export const columns: ColumnDef<Offer>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "discount",
    header: "Discount (%)",
  },
  {
    accessorKey: "code",
    header: "Offer Code",
  },
  {
    accessorKey: "quantityEffect",
    header: "Quantity Effect",
  },
  {
    accessorKey: "effect",
    header: "Effect Type",
  },
  {
    accessorKey: "active",
    header: "Active",
  },
];
const offersData: Offer[] = [
  {
    title: "Special Summer Sale",
    description: "Get ready for summer with our exclusive discount offers.",
    description2: "Buy 10 items and get 20% off.",
    discount: "20",
    code: "SUMMER20",
    quantityEffect: "10",
    effect: "quantity",
    active: true,
  },
  {
    title: "Back to School Promotion",
    description:
      "Start the new school year with great savings on school supplies.",
    description2:
      "15% Discounts when you buy over 5 of any backpacks, stationery, and more.",
    discount: "15",
    code: "SCHOOL15",
    quantityEffect: "5",
    effect: "quantity",
    active: true,
  },
  {
    title: "30%!! off Winter Clearance Sale",
    description:
      "Warm up your winter with hot deals on winter clothing and accessories.",
    description2: "Huge 30% discounts on jackets, scarves, and gloves.",
    discount: "30",
    code: "WINTER30",
    quantityEffect: "8",
    effect: "percentage",
    active: true,
  },
  {
    title: "Fitness Challenge Offer 250INR off",
    description: "Get fit and save big with our fitness challenge discount.",
    description2: "Special 250INR discount for any gym wears ",
    discount: "250",
    code: "FITNESS25",
    quantityEffect: "6",
    effect: "flat",
    active: true,
  },
  {
    title: "Tech Upgrade Bonanza",
    description:
      "Upgrade your tech gadgets with our exclusive tech deals. Get 10% off",
    description2: "Discounts on smartphones, laptops, and accessories.",
    discount: "10",
    code: "TECH10",
    quantityEffect: "7",
    effect: "percentage",
    active: true,
  },
];
// id?:string;
// name:string;
// image:string;
// tags:{
//     tag:string,
//     values:string[]
// }[]
const page = (props: Props) => {
  const [categoryTags, setCategorytags] = React.useState<
  {
    values:string[];
    tag: string;
}[] 
>([
  {
    tag: "",
    values: ["", ""],
  },
]);
  const categorySchema = z.object({
    name: z.string(),
    image: z.string({
      required_error:
        "If this category is featured on homepage it will have no image",
    }),
    tags: z
      .array(
        z.object({
          tag: z.string(),
          values: z.array(z.string()),
        })
      )
      .optional(),
  });

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),

  });
  
    const {
      isPending,
      isError,
      data: categorysData,
      isSuccess,
      error,
      mutate: server_AdminCreateCategory,
    } = useMutation({
      mutationFn: AdminCreateCategory,
    });
  function onSubmit(values: z.infer<typeof categorySchema>) {
    // server_AdminCreatecategory(values)
    values.tags = categoryTags

    console.log(values);
    server_AdminCreateCategory(values as category)
    
  }
 
    useEffect(() => {
      if (isSuccess) {
        form.reset()
        setCategorytags([
          {
            tag: "",
            values: ["", ""],
          },
        ])
        toast({
          variant: "success",
          title: "category created ",
          description: "category has been created successfully",
        });
      }
      if (error) {
        toast({
          variant: "destructive",
          title: "Error:category creation failed",
          description: <p>{error?.message}</p>,
        });
      }
    }, [isSuccess, error]);

  const [dragging, setDragging] = React.useState(false);
  const [imageDimensions, setImageDimensions] = React.useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });
  const handleFileChange = (e: any, field: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        if (reader.readyState === 2) {
          form.setValue("image", reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = event.currentTarget;
    const newImageDimensions: {
      width: number;
      height: number;
    } = { width: naturalWidth, height: naturalHeight };
    setImageDimensions(newImageDimensions);
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
        form.setValue("image", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateCategoryTagValues = (
    index: number,
    e: React.SyntheticEvent<HTMLInputElement>,
    valueIndex: number
  ) => {
    const newCategoryTags = [...categoryTags!];
    newCategoryTags[index].values[valueIndex] = e.currentTarget.value;
    setCategorytags( newCategoryTags);
  };
  const addCategoryTagValue = (index: number) => {
    const newCategoryTags = [...categoryTags!];
    newCategoryTags[index].values.push("");
    setCategorytags( newCategoryTags);
  };
  const addCategoryTag = () => {
    const newCategoryTags = [...categoryTags!];
    newCategoryTags.push({
      tag: "",
      values: ["", ""],
    });
    setCategorytags( newCategoryTags);
  };
  return (
    <>
      <PageHeadingText
        pageHeading="Create a category"
        description="Control all the category and their details here,edit or delete as needed, you can also create new offers here."
      />

      <div className="container mx-auto min-h-[70vh] py-6">
        <div className="mb-7 text-center">
          This Category will be seen on the create products tab , to add it use
          the name exactly as its written, also it can be added to already
          existing products and they will fall under this category when the
          category is opened
        </div>
        <div className="w-full space-y-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-12"
            >
              <div className="w-full grid grid-cols-6 gap-3 items-start">
                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name={"image" as never}
                    render={({ field }: { field: any }) => (
                      <FormItem className="items-start flex w-full flex-col justify-start">
                        <h1 className="capitalize font-medium tracking-tight text-xl">
                          Upload image
                        </h1>
                        <FormDescription className="text-[12px]">
                          The first image and second image would be used as the
                          display images respectively
                        </FormDescription>
                        <FormControl>
                          <div className="w-full">
                            <input
                              type="file"
                              accept="image/*"
                              id="file"
                              className="hidden"
                              onChange={(e) => handleFileChange(e, field)}
                            />
                            {/* <p className="text-black dark:text-white text-left font-medium text-xl mb-2">
                        Course Thumbnail:
                      </p> */}
                            {!form.getValues("image") ? (
                              <label
                                htmlFor="file"
                                className={`w-full min-h-[40vh] rounded-md dark:border-white border-[#00000026] p-3 border flex items-center justify-center ${
                                  dragging ? "bg-blue-500" : "bg-transparent"
                                }`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                              >
                                <span className="text-black text-sm dark:text-white">
                                  Drag and drop your image here or click to
                                  browse
                                </span>
                              </label>
                            ) : (
                              <div className="text-[12px] text-center">
                                Click on the image to remove it
                                <div className="">
                                  <p className="text-[12px] mb-1">{`Image  - ${imageDimensions.width} x ${imageDimensions.height}`}</p>
                                  <Image
                                    src={form.getValues("image")!}
                                    alt="image"
                                    height={200}
                                    width={200}
                                    onClick={() => {
                                      form.setValue("image", "");
                                    }}
                                    onLoad={(e) => handleImageLoad(e)}
                                    className="max-h-full w-full object-cover"
                                  />
                                </div>
                              </div>
                            )}{" "}
                          </div>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <motion.div
                  initial="hidden" // Set initial animation state
                  animate="visible" // Set animation state when component mounts
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { duration: 0.5 } }, // Add transition for smooth animation
                  }}
                  className="col-span-4 grid grid-cols-2 gap-3 items-center"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="items-start flex w-full flex-col justify-start">
                        <h1 className="capitalize font-medium tracking-tight text-xl">
                          Category name
                        </h1>
                        <FormDescription className="text-[12px]">
                          This will be displayed as it is in the navbar and in
                          url
                        </FormDescription>
                        <FormControl>
                          <Input placeholder="e.g. Shirts" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {categoryTags!.map((tag, index) => {
                    return (
                      <motion.section
                        key={index}
                        className="items-start flex w-full flex-col justify-start"
                      >
                        <h1 className="capitalize font-medium tracking-tight text-xl">
                          Tag {index + 1}
                        </h1>
                        <span className="flex  gap-2 items-center w-full">
                          <h1 className="w-full text-[14px] whitespace-nowrap">
                            Tag Name
                          </h1>
                          <Input
                            placeholder="e.g. Size"
                            onChange={(
                              e: React.SyntheticEvent<HTMLInputElement>
                            ) => {
                              const modifiedCategoryTags = [
                                ...categoryTags!
                              ];
                              modifiedCategoryTags[index].tag =
                                e.currentTarget.value;
                              setCategorytags( modifiedCategoryTags);
                            }}
                          />
                        </span>
                        <h1 className="w-full text-[14px]">Values</h1>
                        <span className="grid grid-cols-2 gap-2 items-center">
                          {tag.values.map((value, valueIndex) => (
                            <Input
                              key={valueIndex}
                              onChange={(e) =>
                                updateCategoryTagValues(index, e, valueIndex)
                              }
                              placeholder="e.g xl,l,sm"
                            />
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            className="col-span-2"
                            onClick={() => addCategoryTagValue(index)}
                          >
                            <PlusCircleIcon strokeWidth={1} size={30} />
                          </Button>
                        </span>
                      </motion.section>
                    );
                  })}
                  <motion.div
                    onClick={addCategoryTag}
                    className="border rounded-lg flex flex-col items-center justify-center w-full h-full py-4 gap-1 hover:bg-gray-200 cursor-pointer"
                  >
                    <PlusCircleIcon strokeWidth={1} size={30} />
                    <h1>Add Tag</h1>
                    <p className="text-gray-500 font-medium text-[14px]">
                      Click here to add a new tag
                    </p>
                  </motion.div>
                </motion.div>
              </div>
              <div className="space-y-2 mx-auto w-fit">
                <Button
                  disabled={
                    form.formState.isValidating ||
                    form.formState.isSubmitting ||
                    !form.formState.isValid || isPending
                  }
                  // onClick={() => console.log(form.getValues(), categoryTags)}
                  type="submit"
                  className="w-full max-w-[400px] text-center py-5 h-none"
                >
                  {form.formState.isSubmitting || isPending ? (
                    <ClipLoader size={22} color="white" />
                  ) : (
                    "Create Category"
                  )}
                </Button>
                {/* <p className="text-[12.5px] capitalize text-center">
                  
                </p> */}
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

export default page;
