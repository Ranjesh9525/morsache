"use client";
import React, { useEffect, useState } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";
import Image from "next/image";
import { AiOutlineUser } from "react-icons/ai";
import { ClipLoader } from "react-spinners";
import { getSession } from "next-auth/react";


const ShippingInformation = () => {
  const [userData, setUserData] = useState<any | null>(null);

  async function fetchUserData() {
    try {
      const session = await getSession()
      setUserData(session.user);
    } catch (error) {
      console.error(error);
    }
  }

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div>
      <section>
        <h1>Details</h1>
        {userData ? (
          <div className="flex gap-2">
            {userData.image ? (
              <Image
                src={userData.image}
                alt="profile"
                width={50}
                height={50}
              />
            ) : (
              <AiOutlineUser />
            )}
            <h1 className="w-full">
              {userData.firstName && userData.lastName ? (
                <>
                  {userData.firstName} {userData.lastName}
                </>
              ) : (
                ""
              )}
            </h1>
            <h1 className="w-full font-medium">{userData.email}</h1>
            {userData.shippingAddress && (
              <p>Shipping Address: {userData.shippingAddress}</p>
            )}
          </div>
        ) : (
          <p>
            <ClipLoader />
          </p>
        )}
      </section>
      <section>
        <form>
          <label htmlFor="shippingAddress">Enter Shipping Address:</label>
          <input type="text" id="shippingAddress" name="shippingAddress" />
          <button type="submit">Submit</button>
        </form>
      </section>
    </div>
  );
};

export default ShippingInformation;

// const {
//   isPending: productsFromFilterIsPending,
//   isError: productsFromFilterIsError,
//   data: productsFromFilterResponse,
//   error: productsFromFilterError,
//   mutate: server_fetchProductsFromFilterData,
// } = useMutation({
//   mutationFn: FetchProductsFromFilterData,
// });
