"use client";
import React, { useEffect } from "react";
import PageHeadingText from "@/app/admin/components/PageHeadingText";
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
import { format } from "@/utilities/global";
import { cn } from "@/lib/utils";
import { MdOutlineDiscount } from "react-icons/md";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
// import ProductPreview from "../../components/ProductPreview";

import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import {
  AdminDeleteProduct,
  AdminGetAllOffers,
  AdminGetSingleProduct,
} from "@/serverlessActions/_adminActions";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@/@types/products";
import ConfirmationDialog from "@/components/general/ConfirmationDialog";
import ProductPreview from "./ProductPreview";
type Props = {
  data: Product;
};

const ProductsForm = ({ data }: Props) => {
  const [dragging, setDragging] = React.useState(false);
  // const [openDialog, setOpenDialog] = React.useState(false);
  const [imageDimensions, setImageDimensions] = React.useState<any[]>([]);
  const { toast } = useToast();
  const {
    isPending,
    isError,
    data: offers,
  } = useQuery({
    queryKey: ["offers"],
    queryFn: () => AdminGetAllOffers(),
  });

  const productSchema = z.object({
    _id: z.string(),
    name: z.string(),
    description: z.string(),
    category: z.array(z.string()).nonempty(),
    price: z.union([z.string(), z.number()]),
    slug: z.string(),
    exchangeAndReturnPolicy: z.string().optional(),
    salePrice: z.union([z.string(), z.number()]).optional(),
    sizes: z.array(z.string()).nonempty(),
    tags: z.array(z.string()).nonempty(),
    variants: z
      .array(z.object({ variant: z.string(), image: z.string() }))
      .optional(),
    offers: z
      .array(
        z.object({
          offerId: z.string(),
        })
      )
      .optional(),
    images: z.array(z.string()).nonempty(),
    stock: z.union([z.string(), z.number()]),
    payOnDelivery: z.boolean(),
    moreInformation: z.string().optional(),
  });
  const router = useRouter();
  const variantInput = React.useRef<HTMLInputElement>(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [deleting, setdeleting] = React.useState(false);
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
    localStorage.setItem("product-draft", JSON.stringify(values));
    setPreview(true);
    console.log("submitted");
  }
  //this code is beacuse of  old products that pushed whole offer objects..this handles for both old and new products
  const offersId = data?.offers![0].offerId
    ? data?.offers
    : data?.offers?.map((offer: any) => {
        return { offerId: offer._id };
      });
  console.log(offersId);
  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      _id: data?.id!?.toString() || "",
      category: data?.category || [],
      sizes: data?.sizes || [],
      variants: data?.variants || [],
      offers: offersId || [],
      tags: data?.tags || [],
      images: data?.images || [],
      name: data?.name || "",
      description: data?.description || "",
      stock: data?.stock || "1",
      price: data?.price || "",
      slug: data?.slug || "",
      exchangeAndReturnPolicy: data?.exchangeAndReturnPolicy || "",
      salePrice: data?.salePrice || "",
      payOnDelivery: data?.payOnDelivery || true,
      moreInformation: data?.moreInformation || "",
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

  async function DeleteProduct() {
    setdeleting(true);
    await AdminDeleteProduct(data.id)
      .then((res) => {
        setdeleting(false);
        toast({
          variant: "success",
          title: "Product deleted successfully",
        });
      })
      .catch((err) => {
        console.log(err);
        setdeleting(false);
        toast({
          variant: "destructive",
          title: "Couldnt delete product",
          description: <p>{err?.message}</p>,
        });
      });
    console.log(data.id);
  }
  if (preview) {
    return <ProductPreview preview={preview} setPreview={setPreview} />;
  }
  return (
    <>
      <ConfirmationDialog
        openDialog={openDeleteDialog}
        setOpenDialog={setOpenDeleteDialog}
        dialogTitle={" Are you sure you want to delete this Product?"}
        onClick={DeleteProduct}
        loading={deleting}
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-12"
        >
          <div className="w-full grid grid-cols-3  gap-6 items-start">
            <FormField
              control={form.control}
              name={"name" as never}
              render={({ field }) => (
                <FormItem className="items-start flex w-full flex-col justify-start">
                  <h1 className="capitalize font-medium tracking-tight text-xl">
                    Product name
                  </h1>
                  <FormDescription className="text-[12px]">
                    Please fill in your email to continue
                  </FormDescription>
                  <FormControl>
                    <Input
                      placeholder="what's should the product be called?"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        form.setValue("slug", slugify(e.target.value));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"description" as never}
              render={({ field }) => (
                <FormItem className="items-start flex w-full flex-col justify-start">
                  <h1 className="capitalize font-medium tracking-tight text-xl">
                    Product Description
                  </h1>
                  <FormDescription className="text-[12px]">
                    Describe this product in as much detail as possible
                  </FormDescription>
                  <FormControl>
                    <Textarea placeholder="product description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"price" as never}
              render={({ field }) => (
                <FormItem className="items-start flex w-full flex-col justify-start">
                  <h1 className="capitalize font-medium tracking-tight text-xl">
                    Product Price
                  </h1>
                  <FormDescription className="text-[12px]">
                    This price will not be used if you set a sale price
                  </FormDescription>
                  <FormControl>
                    <Input placeholder="0.00" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"category" as never}
              render={({ field }: { field: any }) => (
                <FormItem className="items-start flex w-full flex-col justify-start">
                  <h1 className="capitalize font-medium tracking-tight text-xl">
                    Category
                  </h1>
                  <FormDescription className="text-[12px]">
                    Please fill in a category, use a comma &quot;,&quot; to
                    insert more than one or select from below
                  </FormDescription>
                  <FormControl>
                    <Input
                      placeholder="categories this should be product under"
                      {...field}
                    />
                  </FormControl>
                  <div className="flex gap-2">
                    {categories.map((item, index) => (
                      <Button
                        type="button"
                        variant={
                          field.value.includes(item) ? "default" : "outline"
                        }
                        onClick={() => {
                          const updatedValue = updateSelectedOptionArray(
                            field.value,
                            item
                          );
                          field.onChange(updatedValue);
                        }}
                        key={index}
                      >
                        {item}
                      </Button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"sizes" as never}
              render={({ field }: { field: any }) => (
                <FormItem className="items-start flex w-full flex-col justify-start">
                  <h1 className="capitalize font-medium tracking-tight text-xl">
                    sizes
                  </h1>
                  <FormDescription className="text-[12px]">
                    Please fill in a size, use a comma &quot;,&quot; to insert
                    more than one or select from below
                  </FormDescription>
                  <FormControl>
                    <Input
                      placeholder="sizes avaliable for this product"
                      {...field}
                    />
                  </FormControl>
                  <div className="flex gap-2">
                    {sizes.map((item, index) => (
                      <Button
                        type="button"
                        variant={
                          field?.value?.includes(item) ? "default" : "outline"
                        }
                        onClick={() => {
                          const updatedValue = updateSelectedOptionArray(
                            field.value,
                            item
                          );
                          field.onChange(updatedValue);
                        }}
                        key={index}
                      >
                        {item}
                      </Button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={"salePrice" as never}
              render={({ field }: { field: any }) => (
                <FormItem className="items-start flex w-full flex-col justify-start">
                  <span className="capitalize font-medium items-center inline-flex gap-4 tracking-tight text-xl">
                    <h1>Sale Price</h1>{" "}
                    <h1 className="text-[#4e75b9] text-sm">Optional</h1>
                  </span>
                  <FormDescription className="text-[12px]">
                    Set a the selling price for this product
                  </FormDescription>
                  <FormControl>
                    <Input placeholder="0.00" {...field} type="number" />
                  </FormControl>
                  {field.value && (
                    <p className="text-sm">{`It will be sold for ${format(
                      field.value
                    )} INR`}</p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={"variants" as never}
              render={({ field }: { field: any }) => (
                <FormItem className="items-start flex w-full flex-col justify-start">
                  <h1 className="capitalize font-medium tracking-tight text-xl">
                    variants
                  </h1>
                  <FormDescription className="text-[12px]">
                    This is the same as colors, upload the types of the products
                    ithe variant is a product ,paste the link here
                  </FormDescription>
                  <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogTrigger className="inline-block py-2 px-4 bg-[#d2d9e7] text-black whitespace-normal border rounded-md text-[13px]">
                      Add Variant
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          Input a name and upload a picture
                        </DialogTitle>
                        <DialogDescription>
                          This will be displayed in the variants section of the
                          products if the variant is a product in the store,
                          just paste the link in the input field below
                        </DialogDescription>
                      </DialogHeader>
                      <div className="w-full space-y-4">
                        <Input
                          className="w-full"
                          placeholder="Variant name"
                          onChange={(e) => {
                            setDialogInput(e.target.value);
                          }}
                          value={dialogInput}
                          ref={variantInput}
                        />
                        <Input
                          type="file"
                          accept="image/*"
                          disabled={!variantInput?.current?.value}
                          id="file"
                          className={cn("w-full")}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();

                              reader.onload = (e: any) => {
                                if (reader.readyState === 2) {
                                  form.setValue("variants", [
                                    ...form?.getValues("variants")!,
                                    {
                                      variant: variantInput!.current!.value,
                                      image: reader.result as string,
                                    },
                                  ]);
                                  setOpenDialog(false);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                  {/* <FormControl>
                        <Input
                            placeholder="sizes avaliable for this product"
                            {...field}
                        />
                        </FormControl> */}
                  <div className="max-w-full mx-auto  overflow-hidden hover:overflow-x-auto whitespace-nowrap">
                    {field.value.map((item: any, index: number) => (
                      <div
                        onClick={() => {
                          form.setValue(
                            "variants",
                            form
                              .getValues("variants")
                              ?.filter(
                                (i: any) => i.variant !== item.variant
                              ) ?? []
                          );
                        }}
                        className="cursor-pointer inline-block w-[4.3rem] h-[4.5rem] mr-4"
                        key={index}
                      >
                        <Image
                          src={item.image}
                          alt=""
                          className="object-cover w-full h-full"
                          width={100}
                          height={100}
                        />
                        <h1 className="text-[12px]">{item.variant}</h1>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"slug" as never}
              render={({ field }) => (
                <FormItem className="items-start flex w-full flex-col justify-start">
                  <h1 className="capitalize font-medium tracking-tight text-xl">
                    Product Slug
                  </h1>
                  <FormDescription className={`text-[12px] text-red-400`}>
                    if no slug is set , it will be set automatically. This is
                    the product reference, setting an invalid slug will result
                    in errors laters
                  </FormDescription>
                  <FormControl>
                    <Input
                      placeholder="Leave this field if you dont know what this is"
                      {...field}
                      // value={form.getValues("name")?.replaceAll(" ", "-")}
                      // onChange={(e) => {
                      //   field.onChange(form.getValues("name")?.replaceAll(" ", "-"));
                      // }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={"stock" as never}
              render={({ field }: { field: any }) => (
                <FormItem className="items-start flex w-full flex-col justify-start">
                  <h1 className="capitalize font-medium tracking-tight text-xl">
                    stock in store
                  </h1>
                  <FormDescription className="text-[12px]">
                    set the amount of stock availiable in store
                  </FormDescription>
                  <FormControl>
                    <Input
                      placeholder="How much is availiable?"
                      {...field}
                      type="number"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"moreInformation" as never}
              render={({ field }) => (
                <FormItem className="items-start flex w-full flex-col justify-start">
                  <span className="capitalize font-medium items-center inline-flex gap-4 tracking-tight text-xl">
                    <h1>Additional information</h1>{" "}
                    <h1 className="text-[#4e75b9] text-sm">Optional</h1>
                  </span>
                  <FormDescription className="text-[12px]">
                    This space is for any Additional information that you want
                    to add
                  </FormDescription>
                  <FormControl>
                    <Textarea placeholder="This field is optional" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={"exchangeAndReturnPolicy" as never}
              render={({ field }) => (
                <FormItem className="items-start flex w-full flex-col justify-start">
                  <span className="capitalize font-medium items-center inline-flex gap-4 tracking-tight text-xl">
                    <h1>Exchange and return policy</h1>{" "}
                    <h1 className="text-[#4e75b9] text-sm">Optional</h1>
                  </span>
                  <FormDescription className="text-[12px]">
                    Explain the return policy for this product
                  </FormDescription>
                  <FormControl>
                    {/* <Input
                        placeholder="what's should the product be called?"
                        {...field}
                        /> */}
                    <Textarea placeholder="This field is optional" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"payOnDelivery" as never}
              render={({ field }: { field: any }) => (
                <FormItem className="items-start flex w-full flex-col justify-start">
                  <span className="capitalize font-medium items-center inline-flex gap-4 tracking-tight text-xl">
                    <h1>Accept pay on delivery?</h1>{" "}
                    <h1 className="text-[#4e75b9] text-sm">Optional</h1>
                  </span>
                  <FormDescription className="text-[12px]">
                    Default is true
                  </FormDescription>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"offers" as never}
              render={({ field }: { field: any }) => (
                <FormItem className="items-start flex w-full flex-col justify-start">
                  <h1 className="capitalize font-medium tracking-tight text-xl">
                    offers
                  </h1>
                  <FormDescription className="text-[12px]">
                    Select an offer from below, if you dont see the offer you
                    want to add please add it first in the offers page
                  </FormDescription>

                  <FormControl></FormControl>

                  <div className="max-w-full mx-auto  overflow-hidden hover:overflow-x-auto whitespace-nowrap">
                    {isPending ? (
                      <ClipLoader />
                    ) : (
                      offers.data.map((item: any, index: number) => (
                        <div
                          key={index}
                          onClick={() => {
                            const updatedValue = () => {
                              console.log(field.value, item);
                              if (
                                field.value.some(
                                  (offer: { offerId: string }) =>
                                    offer.offerId === item._id
                                )
                              ) {
                                return field.value.filter(
                                  (offer: { offerId: string }) =>
                                    offer.offerId !== item._id
                                );
                              } else {
                                return [...field.value, {offerId:item._id}];
                              }
                            };
                            form.setValue("offers", updatedValue());
                          }}
                          className={cn(
                            " cursor-pointer inline-block z-20  w-72 p-3 h-full text-[14px] break-words whitespace-normal bg-gray-200 rounded-lg mr-4",
                            field.value.some(
                              (offer: { offerId: string }) =>
                                offer.offerId === item._id
                            ) && "bg-[#4e75b9] text-white"
                          )}
                        >
                          {" "}
                          <span className="inline-flex gap-4 items-center">
                            <p className="text-left font-medium text-[17px] uppercase">
                              {item.title}
                            </p>
                            <MdOutlineDiscount size={20} />
                          </span>
                          <p className="text-left w-full">{item.description}</p>
                          {item.description2 && (
                            <p className="text-left">{item.description2}</p>
                          )}
                          <span className="inline-flex justify-between w-full">
                            <p className="text-left">
                              Discount:{item.discount}%
                            </p>
                            <p>Effect: {item.effect}</p>
                            <p>Code: {item.code}</p>
                          </span>
                        </div>
                      ))
                    )}
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"tags" as never}
              render={({ field }: { field: any }) => (
                <FormItem className="items-start flex w-full flex-col justify-start">
                  <h1 className="capitalize font-medium tracking-tight text-xl">
                    tags
                  </h1>
                  <FormDescription className="text-[12px]">
                    Please fill in a Tag, use a comma &quot;,&quot; to insert
                    more than one or select from below
                  </FormDescription>
                  <FormControl>
                    <Input
                      placeholder="tags avaliable for this product"
                      {...field}
                    />
                  </FormControl>
                  <div className="max-w-full mx-auto  overflow-hidden hover:overflow-x-auto whitespace-nowrap">
                    {tags.map((item, index) => (
                      <Button
                        type="button"
                        variant={
                          field?.value?.includes(item) ? "default" : "outline"
                        }
                        onClick={() => {
                          const updatedValue = updateSelectedOptionArray(
                            field.value,
                            item
                          );
                          field.onChange(updatedValue);
                        }}
                        key={index}
                      >
                        {item}
                      </Button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"images" as never}
              render={({ field }: { field: any }) => (
                <FormItem className="items-start flex w-full flex-col justify-start">
                  <h1 className="capitalize font-medium tracking-tight text-xl">
                    Upload images
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
                      <label
                        htmlFor="file"
                        className={`w-full min-h-[10vh] rounded-md dark:border-white border-[#00000026] p-3 border flex items-center justify-center ${
                          dragging ? "bg-blue-500" : "bg-transparent"
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        <span className="text-black text-sm dark:text-white">
                          Drag and drop your image here or click to browse
                        </span>
                      </label>
                    </div>
                  </FormControl>
                  {form.getValues("images").length > 0 && (
                    <div className="text-[12px] text-center">
                      {" "}
                      Click on an image to remove it
                      <div className="grid grid-cols-3 gap-2">
                        {form.getValues("images").map((img, index) => (
                          <div key={index} className="w-full">
                            {imageDimensions[index] && (
                              <p className="text-[12px] mb-1">{`Image ${
                                index + 1
                              } - ${imageDimensions[index].width} x ${
                                imageDimensions[index].height
                              }`}</p>
                            )}
                            <img
                              src={img}
                              alt="image"
                              onClick={() => {
                                form.setValue(
                                  "images",
                                  form
                                    .getValues("images")
                                    .filter((_img, i) => i !== index) as any
                                );
                              }}
                              onLoad={(e) => handleImageLoad(index, e)}
                              className="max-h-full w-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* <div className="flex gap-2">
                        {tags.map((item, index) => (
                        <Button
                            type="button"
                            variant={
                            field?.value?.includes(item) ? "default" : "outline"
                            }
                            onClick={() => {
                            field.onChange(() => {
                                updateSelectedOptionArray<string[],string>(field.value,item)
                            });
                            }}
                            key={index}
                        >
                            {item}
                        </Button>
                        ))}
                    </div> */}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2 mx-auto ">
            <section className="flex max-sm:flex-col items-center justify-center gap-4">
              <Button
                disabled={
                  form.formState.isValidating || form.formState.isSubmitting
                }
                // onClick={() => console.log(form.formState)}
                type="submit"
                className="w-full max-w-[400px] text-center py-5 h-none"
              >
                {form.formState.isSubmitting ? (
                  <ClipLoader size={22} color="white" />
                ) : (
                  "Save changes"
                )}
              </Button>
              {data && (
                <Button
                  // disabled={
                  //   form.formState.isValidating ||
                  //   form.formState.isSubmitting ||
                  //   !form.formState.isValid
                  // }
                  onClick={() => setOpenDeleteDialog(true)}
                  variant={"destructive"}
                  type="button"
                  className="w-full max-w-[400px] text-center py-5 h-none"
                >
                  {form.formState.isSubmitting ? (
                    <ClipLoader size={22} color="white" />
                  ) : (
                    "Delete Product"
                  )}
                </Button>
              )}
            </section>
            <p className="text-[12.5px] capitalize text-center">
              This actions are irreversible
            </p>
          </div>
        </form>
      </Form>
    </>
  );
};

export default ProductsForm;
