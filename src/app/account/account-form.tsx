// "use client"

// import { zodResolver } from "@hookform/resolvers/zod"
// import { CalendarIcon,  CheckIcon, SortAscIcon } from "lucide-react"
// import { format } from "date-fns"
// import { useForm } from "react-hook-form"
// import { z } from "zod"

// import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
// import { Calendar } from "@/components/ui/calendar"
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from "@/components/ui/command"
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover"
// import { toast } from "@/components/ui/use-toast"

// const languages = [
//   { label: "English", value: "en" },
//   { label: "French", value: "fr" },
//   { label: "German", value: "de" },
//   { label: "Spanish", value: "es" },
//   { label: "Portuguese", value: "pt" },
//   { label: "Russian", value: "ru" },
//   { label: "Japanese", value: "ja" },
//   { label: "Korean", value: "ko" },
//   { label: "Chinese", value: "zh" },
// ] as const

// const accountFormSchema = z.object({
//   name: z
//     .string()
//     .min(2, {
//       message: "Name must be at least 2 characters.",
//     })
//     .max(30, {
//       message: "Name must not be longer than 30 characters.",
//     }),
//   dob: z.date({
//     required_error: "A date of birth is required.",
//   }),
//   language: z.string({
//     required_error: "Please select a language.",
//   }),
// })

// type AccountFormValues = z.infer<typeof accountFormSchema>

// // This can come from your database or API.
// const defaultValues: Partial<AccountFormValues> = {
//   // name: "Your name",
//   // dob: new Date("2023-01-23"),
// }

// export function AccountForm() {
//   const form = useForm<AccountFormValues>({
//     resolver: zodResolver(accountFormSchema),
//     defaultValues,
//   })

//   function onSubmit(data: AccountFormValues) {
//     toast({
//       title: "You submitted the following values:",
//       description: (
//         <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
//           <code className="text-white">{JSON.stringify(data, null, 2)}</code>
//         </pre>
//       ),
//     })
//   }

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//         <FormField
//           control={form.control}
//           name="name"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Name</FormLabel>
//               <FormControl>
//                 <Input placeholder="Your name" {...field} />
//               </FormControl>
//               <FormDescription>
//                 This is the name that will be displayed on your profile and in
//                 emails.
//               </FormDescription>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="dob"
//           render={({ field }) => (
//             <FormItem className="flex flex-col">
//               <FormLabel>Date of birth</FormLabel>
//               <Popover>
//                 <PopoverTrigger asChild>
//                   <FormControl>
//                     <Button
//                       variant={"outline"}
//                       className={cn(
//                         "w-[240px] pl-3 text-left font-normal",
//                         !field.value && "text-muted-foreground"
//                       )}
//                     >
//                       {field.value ? (
//                         format(field.value, "PPP")
//                       ) : (
//                         <span>Pick a date</span>
//                       )}
//                       <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//                     </Button>
//                   </FormControl>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-auto p-0" align="start">
//                   <Calendar
//                     mode="single"
//                     selected={field.value}
//                     onSelect={field.onChange}
//                     disabled={(date) =>
//                       date > new Date() || date < new Date("1900-01-01")
//                     }
//                     initialFocus
//                   />
//                 </PopoverContent>
//               </Popover>
//               <FormDescription>
//                 Your date of birth is used to calculate your age.
//               </FormDescription>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="language"
//           render={({ field }) => (
//             <FormItem className="flex flex-col">
//               <FormLabel>Language</FormLabel>
//               <Popover>
//                 <PopoverTrigger asChild>
//                   <FormControl>
//                     <Button
//                       variant="outline"
//                       role="combobox"
//                       className={cn(
//                         "w-[200px] justify-between",
//                         !field.value && "text-muted-foreground"
//                       )}
//                     >
//                       {field.value
//                         ? languages.find(
//                             (language) => language.value === field.value
//                           )?.label
//                         : "Select language"}
//                       <SortAscIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                     </Button>
//                   </FormControl>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-[200px] p-0">
//                   <Command>
//                     <CommandInput placeholder="Search language..." />
//                     <CommandList>
//                       <CommandEmpty>No language found.</CommandEmpty>
//                       <CommandGroup>
//                         {languages.map((language) => (
//                           <CommandItem
//                             value={language.label}
//                             key={language.value}
//                             onSelect={() => {
//                               form.setValue("language", language.value)
//                             }}
//                           >
//                             <CheckIcon
//                               className={cn(
//                                 "mr-2 h-4 w-4",
//                                 language.value === field.value
//                                   ? "opacity-100"
//                                   : "opacity-0"
//                               )}
//                             />
//                             {language.label}
//                           </CommandItem>
//                         ))}
//                       </CommandGroup>
//                     </CommandList>
//                   </Command>
//                 </PopoverContent>
//               </Popover>
//               <FormDescription>
//                 This is the language that will be used in the dashboard.
//               </FormDescription>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <Button type="submit">Update account</Button>
//       </form>
//     </Form>
//   )
// }

// //email,password,shippinginfo,phone number
"use client";
import {
  UserUpdateAccountProfile,
  UserUpdateShippingAddress,
} from "@/serverlessActions/_userActions";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { ShippingAddress } from "@/@types/cart";
import { UserDocument } from "@/@types/user";
import { FaPlus } from "react-icons/fa6";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClipLoader } from "react-spinners";
import { getSession } from "next-auth/react";
import {
  Form,
  FormField,
  FormItem,
  FormDescription,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import React, { useContext, useEffect } from "react";
import { shippingSchema } from "../cart/components/DetailsInformation";
import { GlobalContext } from "@/context/globalContext";
import { useRouter } from "next/navigation";

type Props = {};

const AccountForm = (props: Props) => {
  const { userDataLoading, userData, fetchUserData } =
    useContext(GlobalContext)!;
  const {
    isPending,
    isError,
    data,
    isSuccess,
    error,
    mutate: server_userUpdateShippingAddress,
  } = useMutation({
    mutationFn: UserUpdateShippingAddress,
  });

  const emailOrPhoneSchema = z.object({
    email: z
      .string({
        required_error: "Please select an email to display.",
      })
      .email()
      .optional(),
    phoneNumber: z
      .string()
      .min(9, {
        message: "phone number must be at least 9 characters.",
      })
      .max(15, {
        message: "phone number must not be longer than 15 characters.",
      })
      .optional(),
  });

  type EmailOrPhoneValues = z.infer<typeof emailOrPhoneSchema>;

  const defaultValues: Partial<EmailOrPhoneValues> = {
    email: userData?.email || "",
    phoneNumber: userData?.phoneNumber || "",
  };

  const emailOrPhoneForm = useForm<EmailOrPhoneValues>({
    resolver: zodResolver(emailOrPhoneSchema),
    defaultValues,
  });

  const form = useForm<z.infer<typeof shippingSchema>>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      country: "india",
    },
  });
  // useEffect(() => {
  // if (!userData && !userDataLoading) {
  //   fetchUserData
  // }
  //   console.log(userData)
  // }, [userDataLoading, userData]);
  const router = useRouter();
  const { isPending: isUpdating, mutate: server_userUpdateAccountProfile } =
    useMutation({
      mutationFn: UserUpdateAccountProfile,
      onSuccess: (res) => {
        // console.log(res);
        fetchUserData();
        toast({
          title: "Profile updated",
        });
        router.refresh();
      },
      onError: (err) => {
        console.log(err);
        toast({
          variant: "destructive",
          title: "Failed to update user profile",
          description: <p>{err?.message}</p>,
        });
      },
    });
  function onEmailOrPhoneSubmit(data: EmailOrPhoneValues) {
    server_userUpdateAccountProfile(data);
  }
  function onSubmit(values: z.infer<typeof shippingSchema>) {
    const body = {
      userId: userData!._id!,
      address: {
        street: values.street,
        city: values.city,
        state: values.state,
        postalCode: values.postalCode,
        country: values.country,
      },
    };
    // console.log(body);
    server_userUpdateShippingAddress(body);
  }
  useEffect(() => {
    if (isError) {
      console.log(error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
    if (isSuccess) {
      fetchUserData();
      toast({
        title: "Success",
        description: <p>{data?.message}</p>,
      });
    }
  }, [isError, isSuccess]);
  return (
    <div>
      <Form {...emailOrPhoneForm}>
        <form
          onSubmit={emailOrPhoneForm.handleSubmit(onEmailOrPhoneSubmit)}
          className="space-y-8"
        >
          <FormField
            control={emailOrPhoneForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <h1 className="capitalize font-medium tracking-tight text-lg">
                  Email
                </h1>
                <FormControl>
                  <Input disabled placeholder="email" {...field} />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={emailOrPhoneForm.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <h1 className="capitalize font-medium tracking-tight text-lg">
                  Phone number
                </h1>
                <FormControl>
                  <Input placeholder="phone number" {...field} />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isUpdating} type="submit">
            {isUpdating ? (
              <ClipLoader size={21} color="#fff" />
            ) : (
              "Update profile"
            )}
          </Button>
        </form>
      </Form>
      {!userDataLoading ? (
        userData && (
          <div className="space-y-8">
            <h1 className="w-full text-lg  my-4 mt-8">
              Saved Shipping Addresses
            </h1>
            <div className="w-full grid md:grid-cols-4 gap-6">
              {userData!.address!.map((a: ShippingAddress, a_index: number) => {
                if (!a.city || !a.state || !a.country || !a.street) return null;
                return (
                  <div
                    className={`rounded-xl col-span-2 min-h-24 border-primary cursor-pointer hover:bg-[#545454c7] hover:text-white border p-6 ${
                      a.defaultAddress && "bg-primary text-white"
                    }`}
                    key={a_index}
                    onClick={() => {
                      const body = {
                        userId: userData!._id!,
                        address: {
                          street: a.street,
                          city: a.city,
                          state: a.state,
                          postalCode: a.postalCode,
                          country: a.country,
                        },
                      };
                      // console.log(body);
                      if (!isPending) {
                        server_userUpdateShippingAddress(body);
                      }
                    }}
                  >
                    <p>{a.street || ""}</p>
                    {a.city || ""},{a.state || ""},{a.postalCode || ""},
                    {a.country || ""}
                    {a.defaultAddress && (
                      <p className="text-xs">{"(Default)"}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )
      ) : (
        <p className="text-center w-full my-8">
          <ClipLoader />
        </p>
      )}

      <section className=" my-8">
        <h1 className="mb-3 text-lg ">Add shipping address</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-12"
          >
            <div className="w-full grid grid-cols-2 gap-3 items-end">
              <FormField
                control={form.control}
                name="street"
                render={({ field }) => (
                  <FormItem className="items-start flex w-full flex-col justify-start">
                    <h1 className="capitalize font-medium tracking-tight text-xl">
                      Street
                    </h1>
                    <FormMessage />
                    <FormControl>
                      <Input placeholder="Enter street address" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="items-start flex w-full flex-col justify-start">
                    <h1 className="capitalize font-medium tracking-tight text-xl">
                      City
                    </h1>
                    <FormMessage />
                    <FormControl>
                      <Input placeholder="Enter city" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem className="items-start flex w-full flex-col justify-start">
                    <h1 className="capitalize font-medium tracking-tight text-xl">
                      State
                    </h1>
                    <FormMessage />
                    <FormControl>
                      <Input placeholder="Enter state" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem className="items-start flex w-full flex-col justify-start">
                    <h1 className="capitalize font-medium tracking-tight text-xl">
                      Postal Code
                    </h1>
                    <FormMessage />
                    <FormControl>
                      <Input placeholder="Enter postal code" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem className="items-start flex w-full flex-col justify-start">
                    <h1 className="capitalize font-medium tracking-tight text-xl">
                      Country
                    </h1>
                    <FormMessage />
                    <FormControl>
                      <Input
                        readOnly
                        placeholder="Enter your country"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                disabled={form.formState.isSubmitting || isPending}
                type="submit"
              >
                {isPending ? (
                  <ClipLoader color={"white"} size={20} />
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </section>
    </div>
  );
};

export default AccountForm;
