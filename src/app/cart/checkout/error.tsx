"use client";
import HomeLayout from "@/components/layouts/HomeLayout";
import Link from "next/link";
import React from "react";
// Error boundaries must be Client Components

export default function Error({
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
    <HomeLayout title="Morsache - Error">
      <div className="flex min-h-[100vh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md text-center">
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
    </HomeLayout>
  );
}
