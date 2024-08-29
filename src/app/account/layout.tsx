import { Metadata } from "next"
import Image from "next/image"

import { Separator } from "@/components/ui/separator"
import { SidebarNav } from "./components/sidebar-nav"
import HomeLayout from "@/components/layouts/HomeLayout"

export const metadata: Metadata = {
  title: "Account - Morsache Clothing",
  description: "your account",
}

const sidebarNavItems = [
  {
    title: "Profile",
    href: "/account",
  },
  {
    title: "Account",
    href: "/account/account",
  },
  {
    title: "Wishlist",
    href: "/account/wishlist",
  },
  {
    title: "Track Order",
    href: "/account/trackOrder",
  },
  // {
  //   title: "Display",
  //   href: "/account/display",
  // },
]

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <HomeLayout title="Account - Morsache Clothing">
      <div className="hidden">
        <Image
          src="/examples/forms-light.png"
          width={1280}
          height={791}
          alt="Forms"
          className="block dark:hidden"
        />
        <Image
          src="/examples/forms-dark.png"
          width={1280}
          height={791}
          alt="Forms"
          className="hidden dark:block"
        />
      </div>
      <div className=" space-y-6 md:p-10 p-6  pb-16 block">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Account</h2>
          <p className="text-muted-foreground">
            Manage your morsache account and configure your settings
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-2xl">{children}</div>
        </div>
      </div>
    </HomeLayout>
  )
}
