"use client"
import { Separator } from "@/components/ui/separator"
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import AccountForm from "./account-form";

export default function AccountPage() {
  const { data: session, status } = useSession();
  useEffect(() => {
    if (!session && status !== "loading") {
      window.location.reload();
    }
  }, [status]);
  return (
    <div className="space-y-6">
     
      <div>
        <h3 className="text-lg font-medium">Account</h3>
        <p className="text-sm text-muted-foreground">
          Update your phone number, shipping address or password
        </p>
      </div>
      <Separator />
      <AccountForm />
      {/* <ProfileForm /> */}
    </div>
  )
}
