"use client"
import { ColumnDef } from "@tanstack/react-table";
import React, { useEffect } from "react";
import { TypeOf, z } from "zod";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClipLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
// import { format } from "@/components/p
import { DataTable } from "../components/DataTable";
import PageHeadingText from "../components/PageHeadingText";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
// import { format } from "@/components/products/ProductInfo";
import { AdminAddShippingData, AdminGetAllShippingData } from "@/serverlessActions/_adminActions";


type Props = {};
const randomShippingData = (length: number) => {
  const result = [];
  const location = ["street", "city", "state", "postalCode", "country"];
  for (let i; (i = 0); i < length) {
    let value = {
      id: Math.random().toString(36).substring(2, 9),
      locationBy: location[Math.random() * location.length],
      name: Math.random().toString(36).substring(7),
      price: Math.floor(Math.random() * 5000),
    };
    result.push(value);
  }
  return result;
};

export type ShippingData = {
  _id: string;
  name: string;
  locationBy: string;
  price: number;
};

// Generate 5 random users
export const columns: ColumnDef<ShippingData>[] = [
  {
    accessorKey: "_id",
    header: "id",
  },
  {
    accessorKey: "name",
    header: "name",
  },
  {
    accessorKey: "locationBy",
    header: "location By",
  },
  {
    accessorKey: "price",
    header: "Price(INR)",
  },
];
const Page = (props: Props) => {
  // const randomData = randomShippingData(9);
  // console.log(randomData)
  const [openDialog, setOpenDialog] = React.useState(false);
   const [fetchedData, setFetchedData] = React.useState<{_id:string,name:string,locationBy:string,price:number}[]|null>(null);

  const shippingSchema = z.object({
    name: z.string(),
    locationBy: z.string(),
    price: z.string(),
  
  });

  const form = useForm<z.infer<typeof shippingSchema>>({
    resolver: zodResolver(shippingSchema),

  });
  const {
    isPending,
    isError,
    data: shippingsData,
    isSuccess,
    error,
    mutate: server_AdminAddShippingData,
  } = useMutation({
    mutationFn: AdminAddShippingData,
  });
  function onSubmit(values:z.infer<typeof shippingSchema>) {
   server_AdminAddShippingData(values)
    // console.log(values);
  }

  const {isSuccess:ShippingDataIsSuccess,data:ShippingResponse,isError:ShippingDataIsError,error:ShippingDataError,isPending:ShippingDataIsFetching,refetch:refetchShippingData}=useQuery({
   queryKey:["admin_shipping_data"],
    queryFn:()=>AdminGetAllShippingData()
  })
useEffect(()=>{
  console.log(ShippingResponse)
  if(ShippingResponse?.data){
    setFetchedData(ShippingResponse?.data)
  }

},[ShippingDataIsSuccess,ShippingResponse])

useEffect(()=>{
  if(isSuccess){
    if (shippingsData?.success == false && shippingsData?.data?.error) {
      toast({
        variant: "destructive",
        title: "Error: shipping creation failed",
        description: <p>{shippingsData?.data?.error?.message}</p>,
      });
    } else {
    refetchShippingData()
    toast({
      variant: "success",
      title: "shipping data added ",
      description: "shipping data has been added successfully",
    })}
  }
  if(error){
    toast({
      variant: "destructive",
      title: "Error:shipping creation failed",
      description:<p>{error?.message}</p> ,
    })
  }
  
},[isSuccess,error])

  return (
    <>
      <PageHeadingText
        pageHeading="Shipping Data"
        description="Here a list of all active shipping price list sorted in alphabetical order A-Z. If you add a location, users would be charged for shipping based on this information, if you add a location for a state and city and also street and the user fills in all these places they'd be charged according to the location with the highest price"
      />
         <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger>
          <section className="w-full px-9 ">
            {" "}
           <span className=" rounded-md bg-[#545454] py-3 text-white px-5"> Add shipping data</span>
          </section>
        </DialogTrigger>
        <DialogContent className=" max-w-4xl">
          <DialogHeader>
            <DialogTitle>Add shipping data</DialogTitle>
            <DialogDescription >
              This fields are very curcial, please fill in accurate locations infomation only 
            </DialogDescription>
          </DialogHeader>
          <div className="w-full space-y-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-12"
              >
                <div className="w-full grid grid-cols-2 gap-3 items-start">
                
                  <FormField
                    control={form.control}
                    name="locationBy"
                    render={({ field }) => (
                      <FormItem className="items-start flex w-full flex-col justify-start">
                        <h1 className="capitalize font-medium tracking-tight text-xl">
                          Type of location
                        </h1>
                        <FormDescription className="text-[12px]">
                          Select what type of location it is, this is important because users would be charged based on this 
                        </FormDescription>

                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select The Location Type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="street">
                             By Street
                            </SelectItem>
                            <SelectItem value="city">
                             By City
                            </SelectItem>
                            <SelectItem value="state">
                             By State
                            </SelectItem>
                            <SelectItem value="postalCode">
                            By Postal Code
                            </SelectItem>
                            <SelectItem value="country">
                           By Country
                            </SelectItem>
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                    <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="items-start flex w-full flex-col justify-start">
                        <h1 className="capitalize font-medium tracking-tight text-xl">
                          Name Of the location
                        </h1>
                        <FormDescription className="text-[12px]">
                          What should be the offer heading
                        </FormDescription>
                        <FormControl>
                          <Input
                            placeholder="e.g. Bangalore"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem className="items-start flex w-full flex-col justify-start">
                          <h1 className="capitalize font-medium tracking-tight text-xl">
                           Price
                          </h1>
                          <FormDescription className="text-[12px]">
                            Price charges for shipping to this place
                          </FormDescription>
                          <FormControl>
                            <Input
                            type="number"
                              placeholder="How much charge for shipping "
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>{" "}
                <div className="space-y-2  w-fit flex flex-col items-center justify-center">
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
                    {form.formState.isSubmitting || isPending ? (
                      <ClipLoader size={22} color="white" />
                    ) : (
                      "Add Shipping Details"
                    )}
                  </Button>
                  <p className="text-[12.5px] capitalize text-center">
                    You can set for differnt location types, the hierachy of prices goes from street to country so setting for a country will act as default price for that country
                  </p>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
      <div className="container mx-auto min-h-[70vh] py-10">
      { ShippingDataIsFetching ? <span className="flex items-center justify-center mt-12"><ClipLoader size={30}/></span> : fetchedData ? <DataTable route={"shipping"} columns={columns} data={fetchedData} /> : <p className="text-center text-gray-500 mt-16" >No data to show, either fetch error or theres no shipping data, check logs for details</p>}
      </div>
    </>
  );
};

export default Page;
