"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/components/ui/use-toast";

type Props = {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
};

const OTPVerification = ({ email, setEmail }: Props) => {
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  async function handleOTPVerification(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const formattedEmail = encodeURIComponent(email.toLowerCase().trim());
    const formattedCode = encodeURIComponent(code);
    const formattedCallback = encodeURIComponent("/account");
    const otpRequestURL = `/api/auth/callback/email?email=${formattedEmail}&token=${formattedCode}&callbackUrl=${formattedCallback}`;
    const response = await fetch(otpRequestURL);

    if (response) {
      if (response.url.includes("/account")) {
        toast({
          variant: "default",
          title: `You're now authenticated`,
          description: "Lets get back to shopping!",
        });
        router.push(response.url);
      } else {
        toast({
          variant: "destructive",
          title: `Invalid token error`,
          description: "Check you details and try again",
        });
        // router.replace(`/auth/login?error=Verification`);
      }
    }

    setIsSubmitting(false);
  }
  return (
    <div
      id="otp-form-container"
      className="min-h-screen items-start justify-center flex  lg:p-12 sm:p-6"
    >
      <form
        onSubmit={handleOTPVerification}
        className="flex flex-col w-full  justify-center items-center max-w-[400px] space-y-4"
      >
        <h1 className="uppercase  text-center tracking-tight font-semibold text-3xl">
          Enter otp
        </h1>
        <p className="text-[12px] text-center text-gray-500 mb-2">
          Please fill in OTP sent to your email to continue
        </p>
        <InputOTP
          maxLength={6}
          value={code}
          onChange={(value) => setCode(value)}
          className=""
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>

        <span>
          <Button
            type="submit"
            disabled={isSubmitting || !code || code.length !== 6}
            className="w-full text-center mt-4"
          >
            {isSubmitting ? "Verifying..." : "Verify"}
          </Button>
          <p className="text-[12.5px] mt-3 w-full capitalize text-center">
            Code sent to your email becomes invalid after{" "}
            <strong>3 minutes</strong>
          </p>
        </span>
        <p
          className="text-[13px] underline  hover:text-gray-700 cursor-pointer"
          onClick={() => setEmail("")}
        >
          Change email?
        </p>
      </form>
    </div>
  );
};

export default OTPVerification;
