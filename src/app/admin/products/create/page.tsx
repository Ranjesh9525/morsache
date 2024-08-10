"use client";
import React from "react";
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
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClipLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import { format } from "@/components/products/ProductInfo";

type Props = {};

const page = (props: Props) => {
  const productSchema = z.object({
    name: z.string(),
    description: z.string(),
    category: z.array(z.string()).nonempty(),
    price: z.number(),
    slug: z.string(),
    exchangeAndReturnPolicy: z.string().optional(),
    salePrice: z.number().optional(),
    sizes: z.array(z.string()).nonempty(),
    tags: z.array(z.string()).nonempty(),
    variants: z
      .array(z.object({ variant: z.string(), image: z.string() }))
      .nonempty(),
    offers: z
      .array(z.object({ offer: z.string(), description: z.string() }))
      .nonempty(),
    images: z.array(z.string()).nonempty(),
    rating: z.number().default(0),
    purchasedQuantity: z.number().default(0),
    stock: z.number(),
    moreInformation: z.string().optional(),
    isFeatured: z.boolean(),
  });
  // id: string;
  // name: string;
  // description: string;
  // category?: string[];
  // price: number;
  // slug:string;
  // salePrice?: number;
  // sizes: string[];
  // tags?:string[];
  // variants?: {variant:string,image:string}[];
  // images: string[];
  // rating?: number;
  // purchaseQuantity:number;
  // stock?: number;
  // isFeatured?: boolean;
  // offers?:{title:string,description:string}[];
  // exchangeAndReturnPolicy?:string;
  // moreInformation?:string;
  // createdAt?: Date;
  // updatedAt?: Date;
  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      category: [],
      sizes: [],
      variants: [],
      offers: [],
      tags: [],
      images: [],
    },
  });
  const updateSelectedOptionArray = <T extends string | any,D extends string | any>(fieldValue:string[],itemToUpdate:string)=>{
            if(fieldValue?.includes(itemToUpdate)){
                return fieldValue.filter((item)=>item !== itemToUpdate)
            }else{
                return [...fieldValue,itemToUpdate]
            }
  }
  function onSubmit(values: z.infer<typeof productSchema>) {
    console.log(values);
  }
  //FetchAllCategories
  const categories = ["men", "unisex"];
  const tags = ["washable", "grey","clean"];
  const sizes = ["xl", "l","sm"];
  const variants = ["men", "unisex"];
  return (
    <>
      <PageHeadingText
        pageHeading="Create Product"
        description="Create a new product to be uploaded on the morsache store"
      />
      <div className="container mx-auto min-h-[70vh] py-10">
        {/* <DataTable columns={columns} data={randomData} /> */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full grid grid-cols-3  gap-6 items-start"
          >
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
                    <Input placeholder="what's should the product be called?" {...field} />
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
                    Please fill in your email to continue
                  </FormDescription>
                  <FormControl>
                    <Input placeholder="what's should the product be called?" {...field} />
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
                    <Input placeholder="what's should the product be called?" type="number" {...field} />
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
                  Please fill in a category, use a comma "," to insert more than one or
                    select from below
                  </FormDescription>
                  <FormControl>
                    <Input placeholder="categories this should be product under" {...field} />
                  </FormControl>
                  <div className="flex gap-2">
                    {categories.map((item, index) => (
                      <Button
                        type="button"
                        variant={
                          field.value.includes(item) ? "default" : "outline"
                        }
                        onClick={() => {
                          field.onChange(() => [...field.value, item]);
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
                    Please fill in a size, use a comma "," to insert more than one or
                    select from below
                  </FormDescription>
                  <FormControl>
                    <Input placeholder="sizes avaliable for this product" {...field} />
                  </FormControl>
                  <div className="flex gap-2">
                    {sizes.map((item, index) => (
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
                  <h1 className="capitalize font-medium tracking-tight text-xl">
                    sale Price
                  </h1>
                  <FormDescription className="text-[12px]">
                  Set a the selling price for this product
                  </FormDescription>
                  <FormControl>
                    <Input placeholder="How much should this sell for?" {...field} type="number" />
                  </FormControl>
                    {field.value && <p className="text-sm">{`It will be sold for ${format(field.value)} INR`}</p>}
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
                    This is the same as colors, upload the types of the products ithe variant is a product ,paste the link here
                  </FormDescription>
                  <FormControl>
                    <Input placeholder="sizes avaliable for this product" {...field} />
                  </FormControl>
                  <div className="flex gap-2">
                    {sizes.map((item, index) => (
                      <Button
                        type="button"
                        variant={
                          field.value.includes(item) ? "default" : "outline"
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
                  <FormDescription className="text-[12px]">
                    if no slug is set , it will be set automatically
                  </FormDescription>
                  <FormControl>
                    <Input  {...field} value={form.getValues("name")?.replaceAll(" ","-")}/>
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
                  Please fill in a category, use a comma "," to insert more than one or
                    select from below
                  </FormDescription>
                  <FormControl>
                    <Input placeholder="categories this should be product under" {...field} />
                  </FormControl>
                  <div className="flex gap-2">
                    {categories.map((item, index) => (
                      <Button
                        type="button"
                        variant={
                          field.value.includes(item) ? "default" : "outline"
                        }
                        onClick={() => {
                          field.onChange(() => [...field.value, item]);
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
              name={"tags" as never}
              render={({ field }: { field: any }) => (
                <FormItem className="items-start flex w-full flex-col justify-start">
                  <h1 className="capitalize font-medium tracking-tight text-xl">
                    tags
                  </h1>
                  <FormDescription className="text-[12px]">
                    Please fill in a Tag, use a comma "," to insert more than one or
                    select from below
                  </FormDescription>
                  <FormControl>
                    <Input placeholder="tags avaliable for this product" {...field} />
                  </FormControl>
                  <div className="flex gap-2">
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
                    Please fill in a Tag, use a comma "," to insert more than one or
                    select from below
                  </FormDescription>
                  <FormControl>
                  <div className="w-full">
          <input
            type="file"
            accept="image/*"
            id="file"
            className="hidden"
            onChange={handleFileChange}
          />
          <p className="text-black dark:text-white text-left font-medium text-xl mb-2">
            Course Thumbnail:
          </p>
          <label
            htmlFor="file"
            className={`w-full min-h-[10vh] dark:border-white border-[#00000026] p-3 border flex items-center justify-center ${
              dragging ? "bg-blue-500" : "bg-transparent"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {courseInfo.thumbnail ? (
              <div className="w-full">
                <img
                  src={courseInfo.thumbnail}
                  alt=""
                  className="max-h-full w-full object-cover"
                />
              </div>
            ) : (
              <span className="text-black dark:text-white">
                Drag and drop your thumbnail here or click to browse
              </span>
            )}
          </label>
        </div>
                  </FormControl>
                  <div className="flex gap-2">
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
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <div className="space-y-2 mx-auto w-fit">
          <Button
            disabled={
              form.formState.isValidating ||
              form.formState.isSubmitting ||
              !form.formState.isValid
            }
            type="submit"
            className="w-full max-w-[400px] text-center py-3 h-none"
          >
            {form.formState.isSubmitting ? (
              <ClipLoader size={22} color="white" />
            ) : (
              "Upload product"
            )}
          </Button>
          <p className="text-[12.5px] capitalize text-center">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad,
            repellat.
          </p>
        </div>
      </div>
    </>
  );
};

export default page;
