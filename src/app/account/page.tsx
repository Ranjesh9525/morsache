"use client";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";
import { loadComponents } from "next/dist/server/load-components";
import { useEffect } from "react";
import AccountForm from "./account-form";

const MAX_RELOAD_COUNT = process.env.MAX_RELOAD_COUNT || 3;

export default function AccountPage() {
  const { data: session, status } = useSession();
  useEffect(() => {
    if (!session && status !== "loading") {
      let loaded = localStorage.getItem("loaded")
        ? parseInt(localStorage.getItem("loaded")!)
        : 0;

      if (loaded < MAX_RELOAD_COUNT) {
        // console.log("reloading", loaded);
        loaded++;
        localStorage.setItem("loaded", loaded.toString());
        window.location.reload();
      }
    } if(session) {
      // console.log("reloaded");
      localStorage.setItem("loaded", "0"); 
    }
  }, [status, session]);
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
  );
}
