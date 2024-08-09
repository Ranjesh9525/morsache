import { Metadata } from "next"
import HomeLayout from "@/components/layouts/HomeLayout"

export const metadata: Metadata = {
  title: "Search - Morsache Clothing",
  description: "Search through the morsache store",
}


interface SearchLayoutProps {
  children: React.ReactNode
}

export default function SearchLayout({ children }: SearchLayoutProps) {
  return (
    <HomeLayout title="Search - Morsache Clothing">
    {children}
    </HomeLayout>
  )
}
