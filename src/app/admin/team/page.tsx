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
import { AdminAddTeam, AdminGetAllTeam,AdminRemoveTeam } from "@/serverlessActions/_adminActions";
import { Trash2Icon } from "lucide-react";


type Props = {};
export type Users = {
  id: string;
  dateJoined: Date;
  email: string;
  name: string;
  role: string;
};



// Generate 5 random users
export const columns: ColumnDef<Users>[] = [
  {
    accessorKey: "_id",
    header: "id",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "firstName",
    header: "name",
  },
  {
    accessorKey: "createdAt",
    header: "Date Joined",
  },

  {
    accessorKey: "role",
    header: "Role",
  },
  {
    id: "actions",
    cell: ({ row }: any) => {
      const rowData = row.original;

      return (
        <Trash2Icon
          color="red"
          onClick={async () => {
            if (confirm("Are you sure you want to remove this admin?")) {
              const res = await AdminRemoveTeam(rowData.id);

              if (res) {
                toast({
                  variant: "success",
                  description: "Admin removed",
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
  // const randomData = randomTeamData(9);
  // console.log(randomData)
  const [openDialog, setOpenDialog] = React.useState(false);
   const [teamsData, setTeamsData] = React.useState<Users[]|null>(null);

  const TeamSchema = z.object({
   email:z.string().email(),
  });

  const form = useForm<z.infer<typeof TeamSchema>>({
    resolver: zodResolver(TeamSchema),

  }); 
  const {data:teamResponse,error:teamError,isSuccess:teamIsSuccess,isPending:teamIsPending,refetch}=useQuery({
    queryKey: ["team"],
    queryFn:()=>AdminGetAllTeam()
  })
  const {
    isPending,
    isError,
    data: TeamsData,
    isSuccess,
    error,
    mutate: server_AdminAddTeam,
  } = useMutation({
    mutationFn: AdminAddTeam,
    onSuccess(data, variables, context) {
      if(data?.success == false && data?.data?.error){
        toast({
          variant: "destructive",
          title: "Team addition failed",
          description: <p>{data?.data?.error?.message}</p>,
        });
      toast({
        variant:"success",
        title: "Team added ",
        description: "Team added successfully",
      });
      refetch()}
    },
   
  });
  function onSubmit(values:z.infer<typeof TeamSchema>) {
   server_AdminAddTeam({email:values.email})
    console.log(values);
  }

 
useEffect(()=>{
  if(teamIsSuccess){
    if(teamResponse?.success == false){
      toast({
        variant: "destructive",
        title: "Error:Team fetch failed",
        description:<p>{teamResponse?.data?.error?.message}</p> ,
      })
    }
    setTeamsData(teamResponse?.data)
  }},[teamIsSuccess,teamResponse])
//   useEffect(()=>{
//     if(error){
//     toast({
//       variant: "destructive",
//       title: "Error:Team creation failed",
//       description:<p>{error?.message}</p> ,
//     })
//   }
  
// },[teamError])

  return (
    <>
      <PageHeadingText
        pageHeading="Admin Team"
        description="view everyone on the admin team"
      />
         <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger>
          <section className="w-full px-9 ">
            {" "}
           <span className=" rounded-md bg-[#545454] py-3 text-white px-5"> Add Team data</span>
          </section>
        </DialogTrigger>
        <DialogContent className=" max-w-xl">
          <DialogHeader>
            <DialogTitle>Add Team data</DialogTitle>
            <DialogDescription >
              This fields are very curcial, please fill in accurate emails to avoid giving wrong user permissions over the database
            </DialogDescription>
          </DialogHeader>
          <div className="w-full space-y-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-12"
              >
                <div className="w-full ">
            <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="items-start flex w-full flex-col justify-start">
                        <h1 className="capitalize font-medium tracking-tight text-xl">
                          Email of the user
                        </h1>
                        <FormDescription className="text-[12px]">
                          User must already be registered
                        </FormDescription>
                        <FormControl>
                          <Input
                            placeholder="email"
                            {...field}
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
                      !form.formState.isValid || isPending
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
                      "Add User to admin team "
                    )}
                  </Button>
                  <p className="text-[12.5px] capitalize text-center">
                    
                  </p>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
      <div className="container mx-auto min-h-[70vh] py-10">
      { teamIsPending ? <p className="text-center"> <ClipLoader size={50}/> </p> : teamsData && teamsData?.length>0 ? <DataTable  columns={columns} data={teamsData} /> : <p className="text-center text-gray-500 mt-16" >No data to show, either fetch error or theres no Team data, check logs for details</p>}
      </div>
    </>
  );
};

export default Page;
