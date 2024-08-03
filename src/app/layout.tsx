import CombinedProvider from "@/context/contextProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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
    <CombinedProvider>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </CombinedProvider>
  );
}
