import { Toaster } from "@/components/ui/toaster";
import CombinedProvider from "@/context/Providers";
import type { Metadata } from "next";
import { Raleway } from "next/font/google";

// import { Crimson_Text } from "next/font/google";

import "./globals.css";

const raleway = Raleway({ subsets: ["latin"] });
//
export const metadata: Metadata = {
  title: "Morsache Clothing",
  description: "Online e-commerce store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body className={raleway.className}>
      <CombinedProvider>
        <Toaster />
        {children}
      </CombinedProvider>
    </body>
  </html>
 
  
  );
}
