import React, { useState } from "react";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import HomeLayout from "@/components/layouts/HomeLayout";
import { signIn, useSession } from "next-auth/react";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";
import OTPVerification from "../components/OTPVerification";
import SignIn from "../components/SignIn";
// import SignInForm from "./SignInForm";
// import VerificationAlert from "./VerificationAlert";

type Props = {};

const Page = (props: Props) => {
  return (
    <HomeLayout title="Login - Morsache Clothing">
      <SignIn />
    </HomeLayout>
  );
};

export default Page;

