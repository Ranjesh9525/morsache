"use client";
import { ShippingAddress } from "@/@types/cart";
import { UserDocument } from "@/@types/user";
import CheckoutCard from "@/app/cart/components/CheckoutCard";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { AdminGetSingleUsers } from "@/serverlessActions/_adminActions";
import { formatDate } from "@/utilities/global";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { AiOutlineUser } from "react-icons/ai";

type Props = {
  id: string;
};

const UserViewCard = ({ id }: Props) => {
  const [fetchedUser, setFetchedUser] = useState<UserDocument | null>(null);
  const { mutate: server_AdminGetSingleUsers, isPending } = useMutation({
    mutationFn: AdminGetSingleUsers,
    onSuccess: (res) => {
      //   console.log(res?.data);
      if(res?.success == false && res?.data?.error){
        toast({
          variant: "destructive",
          title: "An Error occured fetching user data",
          description: <p>{res?.data?.error?.message}</p>,
        });
      }else{
      setFetchedUser(res?.data)}
    },

  });

  useEffect(() => {
    if (!isPending) server_AdminGetSingleUsers(id);
  }, []);
  return (
    <>
      {isPending ? (
        <div className="mx-9">
          <div className="flex flex-row gap-4 items-center ">
            <Skeleton className="flex-[3] bg-gray-200 w-full h-[250px]" />
            <Skeleton className="flex-[8] bg-gray-200 w-full h-[250px]" />
          </div>
          <Separator className="my-10" />
          <div className="grid grid-cols-3 my-6 gap-3">
            <Skeleton className="w-[100%] h-[150px] mb-3" />
            <Skeleton className="w-[100%] h-[150px] mb-3" />
            <Skeleton className="w-[100%] h-[150px] mb-3" />
          </div>
        </div>
      ) : (
        fetchedUser && (
          <div>
            <div className="flex flex-row gap-4 items-center ">
              <section className="flex-[3] w-full h-[250px]">
                {fetchedUser.image ? (
                  <Image
                    alt="pfp"
                    className="w-full h-full object-cover"
                    width={400}
                    height={400}
                    src={fetchedUser.image!}
                  />
                ) : (
                  <section className="p-4 w-full h-[250px] inline-flex  bg-gray-200">
                    <AiOutlineUser className="w-full h-full" />{" "}
                  </section>
                )}
              </section>
              <section className="flex-[8] space-y-3">
                <h1 className="font-medium text-[16px]">
                  {`User Id : ${fetchedUser?._id}`}
                </h1>
                <h1 className="font-medium text-[16px]">
                  Email:{fetchedUser?.email}
                </h1>
                <h1 className="font-medium text-[16px]">
                  First Name:{fetchedUser?.firstName || "No First name set"}
                </h1>
                <h1 className="font-medium text-[16px]">
                  Last Name:{fetchedUser?.lastName || "No last name set"}
                </h1>
                <h1 className="font-medium text-[16px]">
                  Phone Number:{" "}
                  {fetchedUser?.phoneNumber || "No phone number set"}
                </h1>
                <h1 className="font-medium text-[16px]">
                  User Role: {fetchedUser?.role}
                </h1>
                <h1 className="font-medium text-[16px]">
                  Joined on:{formatDate(fetchedUser?.createdAt!)}
                </h1>
              </section>
            </div>
            <Separator className="my-10" />
            <div className="grid grid-cols-3 my-6 gap-3">
              <section className=" min-h-[40vh]">
                <h1 className="text-lg mb-4">Address</h1>
                <section className="flex flex-col gap-2">
                  {fetchedUser?.address && fetchedUser?.address.length > 0 ? (
                    fetchedUser!.address!.map(
                      (a: ShippingAddress, a_index: number) => {
                        if (!a.city || !a.state || !a.country || !a.street)
                          return null;
                        return (
                          <div
                            className={` col-span-2 min-h-24 border-primary cursor-pointer hover:bg-[#545454c7] hover:text-white border p-6 ${
                              a.defaultAddress && "bg-primary text-white"
                            }`}
                            key={a_index}
                          >
                            <p>{a.street || ""}</p>
                            {a.city || ""},{a.state || ""},{a.postalCode || ""},
                            {a.country || ""}
                            {a.defaultAddress && (
                              <p className="text-xs">{"(Default)"}</p>
                            )}
                          </div>
                        );
                      }
                    )
                  ) : (
                    <p className="my-20 text-center text-gray-500">
                      User has not Added an address
                    </p>
                  )}
                </section>
              </section>
              <section className=" min-h-[40vh]">
                <h1 className="text-lg mb-4">Orders</h1>
                {fetchedUser?.orders && fetchedUser?.orders.length > 0 ? (
                  fetchedUser?.orders.map((order, index) => {
                    return (
                      <div
                        className={` col-span-2 min-h-24 border-primary cursor-pointer hover:bg-[#545454c7] hover:text-white border p-6
                        `}
                        key={index}
                      >
                        <Link href={`/admin/orders/${order?.orderId}`}>
                          <p>{` Order: ${order.orderId}`}</p>
                          <p>status: {order.status}</p>
                        </Link>
                      </div>
                    );
                  })
                ) : (
                  <p className="my-20 text-center text-gray-500">
                    User has not made any orders
                  </p>
                )}
              </section>
              <section className=" min-h-[40vh]">
                <h1 className="text-lg mb-4">Carts</h1>
                {fetchedUser?.carts && fetchedUser?.carts[0] ? (
                  <CheckoutCard
                    showProducts={true}
                    cart={fetchedUser!?.carts[0]!}
                    cartId={fetchedUser!?.carts[0]?._id!}
                  />
                ) : (
                  <p className="my-20 text-center text-gray-500">
                    User has no active cart
                  </p>
                )}
              </section>
            </div>
          </div>
        )
      )}
    </>
  );
};

export default UserViewCard;
