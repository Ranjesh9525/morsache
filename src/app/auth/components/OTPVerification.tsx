"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { UserIsNewUser } from "@/serverlessActions/_userActions";
import { ClipLoader } from "react-spinners";
import Link from "next/link";

type Props = {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
};

const OTPVerification = ({ email, setEmail }: Props) => {
  const [requestCountdown,setRequestCountdown] = useState<number>(0)
  const [timesRequested,setTimesRequested] = useState<number>(1)
  const [countdown, setCountdown] = useState(timesRequested*60);
  const [isNewUser, setIsNewUser] = useState(false);
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const callbackUrl = useSearchParams().get("callbackUrl");
  const { data, refetch, isFetching } = useQuery({
    queryKey: ["checkUser"],
    queryFn: () => UserIsNewUser(),
    enabled: false,
  });
  const handleRedirect = (url: string) => {
    router.push(url);
  };
  async function handleOTPVerification(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    const formattedEmail = encodeURIComponent(email.toLowerCase().trim());
    const formattedCode = encodeURIComponent(code);
    const formattedCallback = callbackUrl ? callbackUrl : encodeURIComponent("/account");
    const otpRequestURL = `/api/auth/callback/email?email=${formattedEmail}&token=${formattedCode}&callbackUrl=${formattedCallback}`;
    const response = await fetch(otpRequestURL);

    if (response) {
      if (response.url.includes(formattedCallback)) {
        await refetch().then((dat) => {
          // console.log("check", dat);
          setIsNewUser(dat.data?.data?.isNewUser);
        });
         console.log("data", data, isNewUser);
         if(isNewUser){
          toast({
            variant: "default",
            title:"You're now authenticated",
            description:"Update your account details"
         })}
        if (!isFetching && !isNewUser && !data?.data?.isNewUser) {
          console.log("triggering",)
          toast({
            variant: "default",
            title: `You're now authenticated`,
            description: "Lets get back to shopping!",
          });
          handleRedirect(response.url);
          router.refresh();
        }
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
  useEffect(() => {
    if (isNewUser) {
      handleRedirect(
        `/auth/register?callbackUrl=${encodeURIComponent("/auth/login")}`
      );
    }
  }, [isNewUser]);
  useEffect(() => {
    let timer:any;

    const resetTimer = () => {
        if (timer) {
            clearInterval(timer);
        }

        setCountdown(timesRequested * 60); 
        timer = setInterval(() => {
            setCountdown((prevCountdown) => {
                if (prevCountdown === 0) {
                    clearInterval(timer);
                    // Handle requestc otpp enable resend OTP button
                }
                return prevCountdown > 0 ? prevCountdown - 1 : 0;
            });
        }, 1000); 
    };

    resetTimer(); 

    return () => clearInterval(timer); 
}, [timesRequested]);

  useEffect(()=>{
    if(timesRequested > 2){
toast({

  title:'Need help signing in?',
  description:<p>Contact support <Link href="/support" className="underline text-blue-400">support</Link></p>
})
    }
  },[])
  const formattedCountdown = new Date(countdown * 1000).toISOString().substr(14, 5);

  return (
    <div
      id="otp-form-container"
      className="md:min-h-screen min-h-[70vh] items-start justify-center flex  md:p-12 p-6"
    >
      {isFetching ? (
        <ClipLoader size={40} />
      ) : (
        <form
          onSubmit={handleOTPVerification}
      

          className="flex flex-col w-full  justify-center items-center  md:max-w-[400px]  px-6 md:px-4  space-y-4 md:space-y-8"
        >
          <h1 className="uppercase  text-center tracking-tight font-semibold  lg:text-3xl text-xl">
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

          <span className="w-full">
            <Button
              type="submit"
              disabled={isSubmitting || !code || code.length !== 6}
              className="w-full text-center mt-4"
            >
              {isSubmitting ? "Verifying..." : "Verify"}
            </Button>
           {countdown === 0 ? <span className="w-full text-[12.5px] py-3 inline-flex items-center justify-center text-center" onClick={()=>   setTimesRequested(timesRequested+1)}>Request</span> : <p className="text-[12.5px] mt-3 w-full text-center">
              Code not recieved ? Request a new one in <br />
              <strong>{formattedCountdown}</strong>
            </p>}
          </span>
          <p
            className="text-[13px] underline  hover:text-gray-700 cursor-pointer"
            onClick={() => setEmail("")}
          >
            Change email?
          </p>
        </form>
      )}
    </div>
  );
};

export default OTPVerification;
