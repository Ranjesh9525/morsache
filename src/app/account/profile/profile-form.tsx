// import { Input } from "@/components/ui/input"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { Textarea } from "@/components/ui/textarea"
// import { toast } from "@/components/ui/use-toast"

// const profileFormSchema = z.object({
//   username: z
//     .string()
//     .min(2, {
//       message: "Username must be at least 2 characters.",
//     })
//     .max(30, {
//       message: "Username must not be longer than 30 characters.",
//     }),
//   email: z
//     .string({
//       required_error: "Please select an email to display.",
//     })
//     .email(),
//   bio: z.string().max(160).min(4),
//   urls: z
//     .array(
//       z.object({
//         value: z.string().url({ message: "Please enter a valid URL." }),
//       })
//     )
//     .optional(),
// })

// type ProfileFormValues = z.infer<typeof profileFormSchema>

// // This can come from your database or API.
// const defaultValues: Partial<ProfileFormValues> = {
//   bio: "I own a computer.",
//   urls: [
//     { value: "https://shadcn.com" },
//     { value: "http://twitter.com/shadcn" },
//   ],
// }

// export function ProfileForm() {
//   const form = useForm<ProfileFormValues>({
//     resolver: zodResolver(profileFormSchema),
//     defaultValues,
//     mode: "onChange",
//   })

//   const { fields, append } = useFieldArray({
//     name: "urls",
//     control: form.control,
//   })

//   function onSubmit(data: ProfileFormValues) {
//     toast({
//       title: "You submitted the following values:",
//       description: (
//         <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
//           <code className="text-white">{JSON.stringify(data, null, 2)}</code>
//         </pre>
//       ),
//     })
//   }
//   //image,firstname,lastname

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//         <FormField
//           control={form.control}
//           name="username"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Username</FormLabel>
//               <FormControl>
//                 <Input placeholder="shadcn" {...field} />
//               </FormControl>
//               <FormDescription>
//                 This is your public display name. It can be your real name or a
//                 pseudonym. You can only change this once every 30 days.
//               </FormDescription>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="email"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Email</FormLabel>
//               <Select onValueChange={field.onChange} defaultValue={field.value}>
//                 <FormControl>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select a verified email to display" />
//                   </SelectTrigger>
//                 </FormControl>
//                 <SelectContent>
//                   <SelectItem value="m@example.com">m@example.com</SelectItem>
//                   <SelectItem value="m@google.com">m@google.com</SelectItem>
//                   <SelectItem value="m@support.com">m@support.com</SelectItem>
//                 </SelectContent>
//               </Select>
//               <FormDescription>
//                 You can manage verified email addresses in your{" "}
//                 <Link href="/examples/forms">email settings</Link>.
//               </FormDescription>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="bio"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Bio</FormLabel>
//               <FormControl>
//                 <Textarea
//                   placeholder="Tell us a little bit about yourself"
//                   className="resize-none"
//                   {...field}
//                 />
//               </FormControl>
//               <FormDescription>
//                 You can <span>@mention</span> other users and organizations to
//                 link to them.
//               </FormDescription>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <div>
//           {fields.map((field, index) => (
//             <FormField
//               control={form.control}
//               key={field.id}
//               name={`urls.${index}.value`}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className={cn(index !== 0 && "sr-only")}>
//                     URLs
//                   </FormLabel>
//                   <FormDescription className={cn(index !== 0 && "sr-only")}>
//                     Add links to your website, blog, or social media profiles.
//                   </FormDescription>
//                   <FormControl>
//                     <Input {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           ))}
//           <Button
//             type="button"
//             variant="outline"
//             size="sm"
//             className="mt-2"
//             onClick={() => append({ value: "" })}
//           >
//             Add URL
//           </Button>
//         </div>
//         <Button type="submit">Update profile</Button>
//       </form>
//     </Form>
//   )
// }

"use client";
import React,{useContext} from "react";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { UserUpdateAccountProfile } from "@/serverlessActions/_userActions";
import { GlobalContext } from "@/context/globalContext";
import { toast } from "@/components/ui/use-toast";

type Props = {};

const ProfileForm = (props: Props) => {
    const {userData} = useContext(GlobalContext)!

  const [dragging, setDragging] = React.useState(false);

  const profileFormSchema = z.object({
    lastName: z
      .string()
      .min(2, {
        message: "last name must be at least 2 characters.",
      })
      .max(30, {
        message: "last name must not be longer than 30 characters.",
      })
      .optional(),
    firstName: z
      .string()
      .min(2, {
        message: "first name must be at least 2 characters.",
      })
      .max(30, {
        message: "first name must not be longer than 30 characters.",
      })
      .optional(),
    image: z.string().optional(),
  });

  type ProfileFormValues = z.infer<typeof profileFormSchema>;

 
  const defaultValues: Partial<ProfileFormValues> = {
    firstName: userData?.firstName || "",
    lastName: userData?.lastName || "",
    image: userData?.image || "",
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  });

  const {isPending,mutate:server_userUpdateAccountProfile}=useMutation({
    mutationFn: UserUpdateAccountProfile,
    onSuccess:(res)=>{
      console.log(res)
      toast({
        title:"Profile updated"
      })
    },
    onError:(err)=>{
      console.log(err)
      toast({
        variant:"destructive",
        title:"Failed to update user profile",
        description:<p>{err?.message}</p>
      })
    }
  })

  function onSubmit(data: ProfileFormValues) {
    // toast({
    //   title: "You submitted the following values:",
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    // })
    console.log(data)
    server_userUpdateAccountProfile(data)
  }
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name={"image" as never}
          render={({ field }: { field: any }) => (
            <FormItem className="items-start flex w-full flex-col justify-start">
              <h1 className="capitalize font-medium tracking-tight text-lg">
                Upload image
              </h1>
              <FormDescription className="text-[12px]">
                This is your profile image and would be displayed publicly when
                you leave a review
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
                      className={`lg:w-full lg:min-h-[20vh] lg:max-w-[20vw] w-[180px] h-[180px] rounded-lg dark:border-white border-[#00000026] p-3 border flex items-center justify-center ${
                        dragging ? "bg-blue-500" : "bg-transparent"
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <span className="text-black text-sm dark:text-white text-center">
                        Drag and drop your image here or click to browse
                      </span>
                    </label>
                  ) : (
                    <div className="text-[12px] text-center">
                      Click on the image to remove it
                      <div className="">
                        {/* /    <p className="text-[12px] mb-1">{`Image  - ${imageDimensions.width} x ${imageDimensions.height}`}</p> */}
                        <Image
                          src={form.getValues("image")!}
                          alt="image"
                          height={200}
                          width={200}
                          onClick={() => {
                            form.setValue("image", "");
                          }}
                          // onLoad={(e) => handleImageLoad(e)}
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
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <h1 className="capitalize font-medium tracking-tight text-lg">
                First name
              </h1>
              <FormControl>
                <Input placeholder="first name" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name. you would be addressed by
                this. It can be your real name or a pseudonym.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <h1 className="capitalize font-medium tracking-tight text-lg">
                Last name
              </h1>
              <FormControl>
                <Input placeholder="last name" {...field} />
              </FormControl>
              <FormDescription>
                Your last name makes up your full name to be included in your
                orders , not this would not be visible when you leave a review
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Update profile</Button>
      </form>
    </Form>
  );
};

export default ProfileForm;
