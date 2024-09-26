"use client";
import Footer from "@/components/general/footer/Footer";
import HomeLayout from "@/components/layouts/HomeLayout";
import Link from "next/link";
import Image from "next/image";
import React from "react";
// Error boundaries must be Client Components

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);
  return (
    <html>
      <body>
        <title>Morsache - Error</title>
        <div className="flex min-h-[100vh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-md text-center">
            <div
              id="navbar"
              className="lg:p-5 p-3 flex justify-between items-center"
            >
              
              <Link
                scroll={true}
                href="/"
                className="relative justify-center  inline-flex flex-row uppercase lg:gap-1 w-full items-end justify-self-center tracking-wider cursor-pointer text-[#474747]"
              >
                {/* <TreePineIcon size={34} /> */}
                {/* <span className={"lg:w-[50px] lg:h-[50px] w-[20px] h-[20px] "}> */}
                <Image
                  src="/morsache-clothing-logo-small.png"
                  width={45}
                  height={45}
                  className={"object-contain  relative  "}
                  alt="logo"
                />
                {/* </span> */}
                <p className="md:text-4xl text-lg font-medium">orsache</p>
              </Link>
            </div>
            <div className="mx-auto  text-primary">
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {"Oops, something went wrong!"}
              </h1>
              <p className="mt-4 text-muted-foreground">
                 {
                  "We're sorry, but an unexpected error has occurred. Please try again later or contact support if the issue persists."
                }
              </p>
              <div className="mt-6">
                <Link
                  href="/"
                  className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  prefetch={false}
                >
                  Go to Homepage
                </Link>
                <Link
                  href="/contact-us"
                  className="inline-flex text-primary ml-3 items-center rounded-md border border-primary px-4 py-2 text-sm font-medium  shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  prefetch={false}
                >
                  Contact support
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* </HomeLayout> */}
        <Footer />
      </body>
    </html>
  );
}
