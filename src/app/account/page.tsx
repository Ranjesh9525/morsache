"use client"
import { Separator } from "@/components/ui/separator"
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { ProfileForm } from "./profile-form"

export default function SettingsProfilePage() {
  const { data: session, status } = useSession();
  useEffect(() => {
    if (!session && status !== "loading") {
      window.location.reload();
    }
  }, [status]);
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the site.
        </p>
      </div>
      <Separator />
      {/* <ProfileForm /> */}
    </div>
  )
}
