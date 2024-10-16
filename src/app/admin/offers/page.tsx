"use client";

import { ColumnDef } from "@tanstack/react-table";
import React, { useEffect } from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClipLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Form,
  FormField,
  FormItem,
  FormDescription,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { DataTable } from "../components/DataTable";
import PageHeadingText from "../components/PageHeadingText";
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
import { useMutation, useQuery } from "@tanstack/react-query";
import { Offer } from "@/@types/products";
import {
  AdminCreateOffer,
  AdminGetAllOffers,
  AdminDeleteOffer,
} from "@/serverlessActions/_adminActions";
import { Trash2Icon } from "lucide-react";

type Props = {};

const columns = [
  {
    accessorKey: "_id",
    header: "Id",
  },
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
    header: "Discount",
  },
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "active",
    header: "Active",
  },
  {
    id: "actions",
    cell: ({ row }: any) => {
      const rowData = row.original;

      return (
        <Trash2Icon
          color="red"
          onClick={async () => {
            if (confirm("Are you sure you want to delete this offer?")) {
              const res = await AdminDeleteOffer(rowData.id);

              if (res.success !== false) {
                toast({
                  variant: "success",
                  description: "Offer deleted successfully",
                });
              }else{
                toast({
                  variant: "destructive",
                  title:"Error",
                  description: `{res?.data?.error?.message}`,
                });
              }
            }
          }}
        />
      );
    },
  },
];
const Page = (props: Props) => {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [allOffers, setAllOffers] = React.useState<Offer[] | null>(null);
  const offerSchema = z.object({
    title: z.string(),
    description: z.string(),
    description2: z.string().optional(),
    discount: z.string(),
    code: z.string({
      required_error:
        "This code is important, its how users can access this offer",
    }),
    quantityEffect: z.string(),
    effect: z.enum(["flat", "percentage", "quantity"]),
    active: z.boolean(),
  });

  const form = useForm<Offer>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      quantityEffect: "0",
      active: true,
    },
  });
  const {
    isPending,
    isError,
    data: offersData,
    isSuccess,
    error,
    mutate: server_AdminCreateOffer,
  } = useMutation({
    mutationFn: AdminCreateOffer,
  });

  const {
    isPending: offersIsFetching,
    data: offers,
    isSuccess: fetchIssuccess,
    error: fetchError,
  } = useQuery({
    queryKey: ["offers"],
    queryFn: () => AdminGetAllOffers(),
  });
  useEffect(() => {

    if (fetchIssuccess) {
      // console.log(offers);
      if(offers?.success == false && offers?.data?.error){
        toast({
          variant: "destructive",
          title: "Error:Offer fetch failed",
          description: <p>{offers?.data?.error?.message}</p>,
        });
      }else{
      setAllOffers(offers?.data);}
    }
  }, [fetchError, fetchIssuccess]);
  function onSubmit(values: Offer) {
    server_AdminCreateOffer(values);
    // console.log(values);
  }
  useEffect(() => {
    if (isSuccess) {
      toast({
        variant: "success",
        title: "Offer created ",
        description: "Offer has been created successfully",
      });
    }
    if (error) {
      toast({
        variant: "destructive",
        title: "Error:offer creation failed",
        description: <p>{error?.message}</p>,
      });
    }
  }, [isSuccess, error]);
  return (
    <>
      <PageHeadingText
        pageHeading="All Offers"
        description="Control all the offers and their details here,edit or delete as needed, you can also create new offers here."
      />

      {/**/}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger>
          <section className="w-full px-9 ">
            {" "}
            <span className=" rounded-md bg-[#545454] py-3 text-white px-5">
              {" "}
              Create New Offer
            </span>
          </section>
        </DialogTrigger>
        <DialogContent className=" max-w-4xl">
          <DialogHeader>
            <DialogTitle>Create a new offer</DialogTitle>
            <DialogDescription>
              This action is to create a new offer that will give users discount
              if they apply the code, beware of the benefits you are setting
            </DialogDescription>
          </DialogHeader>
          <div className="w-full space-y-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-12"
              >
                <div className="w-full grid grid-cols-3 gap-3 items-start">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="items-start flex w-full flex-col justify-start">
                        <h1 className="capitalize font-medium tracking-tight text-xl">
                          Offer title
                        </h1>
                        <FormDescription className="text-[12px]">
                          What should be the offer heading
                        </FormDescription>
                        <FormControl>
                          <Input
                            placeholder="e.g. Buy 1 Get 1 Free"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="items-start flex w-full flex-col justify-start">
                        <h1 className="capitalize font-medium tracking-tight text-xl">
                          Offer Description
                        </h1>
                        <FormDescription className="text-[12px]">
                          Enter the description for the offer
                        </FormDescription>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the offer in detail"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description2"
                    render={({ field }) => (
                      <FormItem className="items-start flex w-full flex-col justify-start">
                        <h1 className="capitalize font-medium tracking-tight text-xl">
                          Additional Description
                        </h1>
                        <FormDescription className="text-[12px]">
                          Enter any additional description for the offer
                        </FormDescription>
                        <FormControl>
                          <Textarea
                            placeholder="Enter additional description"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="discount"
                    render={({ field }) => (
                      <FormItem className="items-start flex w-full flex-col justify-start">
                        <h1 className="capitalize font-medium tracking-tight text-xl">
                          Discount
                        </h1>
                        <FormDescription className="text-[12px]">
                          Enter the discount percentage
                        </FormDescription>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter discount percentage"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem className="items-start flex w-full flex-col justify-start">
                        <h1 className="capitalize font-medium tracking-tight text-xl">
                          Offer Code
                        </h1>
                        <FormDescription className="text-[12px]">
                          Enter the unique offer code
                        </FormDescription>
                        <FormControl>
                          <Input placeholder="Enter offer code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="quantityEffect"
                    render={({ field }) => (
                      <FormItem className="items-start flex w-full flex-col justify-start">
                        <h1 className="capitalize font-medium tracking-tight text-xl">
                          Quantity Effect
                        </h1>
                        <FormDescription className="text-[12px]">
                          Only valid for quantity effect type offers, how much
                          quantity of product does the user need to use this
                          offer
                        </FormDescription>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter quantity effect"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="effect"
                    render={({ field }) => (
                      <FormItem className="items-start flex w-full flex-col justify-start">
                        <h1 className="capitalize font-medium tracking-tight text-xl">
                          Effect Type
                        </h1>
                        <FormDescription className="text-[12px]">
                          Select the effect type
                        </FormDescription>

                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select The Offer Type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="flat">
                              Flat:The discount value would be deducted exactly
                            </SelectItem>
                            <SelectItem value="percentage">
                              Percentage:The discount value is used as a
                              percentage
                            </SelectItem>
                            <SelectItem value="quantity">
                              Quantity:Quantity effect would be used
                            </SelectItem>
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="active"
                    render={({ field }) => (
                      <FormItem className="items-start flex w-full flex-col justify-start">
                        <h1 className="capitalize font-medium tracking-tight text-xl">
                          Activate Offer
                        </h1>
                        <FormDescription className="text-[12px]">
                          Activate the offer now?
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
                </div>{" "}
                <div className="space-y-2 mx-auto w-fit">
                  <Button
                    disabled={
                      form.formState.isValidating ||
                      form.formState.isSubmitting ||
                      !form.formState.isValid
                    }
                    //   onClick={() =>
                    //  console.log(form.getValues(), form.formState)
                    //   }
                    type="submit"
                    className="w-full max-w-[400px] text-center py-5 h-none"
                  >
                    {form.formState.isSubmitting ? (
                      <ClipLoader size={22} color="white" />
                    ) : (
                      "Create offer"
                    )}
                  </Button>
                  <p className="text-[12.5px] capitalize text-center">
                    You can edit this later but already made orders wont be
                    affected
                  </p>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>

      <div className="container mx-auto min-h-[70vh] py-10">
        {offersIsFetching ? (
          <p className="text-center my-6">
            <ClipLoader size={30} />
          </p>
        ) : !allOffers || allOffers?.length == 0 ? (
          <p className="text-center text-xl">No offers yet</p>
        ) : (
          <DataTable rowKey={"_id"} columns={columns} data={allOffers!} />
        )}
      </div>
    </>
  );
};

export default Page;
