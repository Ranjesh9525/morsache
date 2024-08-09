import { Separator } from "@/components/ui/separator"
import { DisplayForm } from "./display-form"

export default function SettingsDisplayPage() {
  return (
    <div className="space-y-6">
      <div>
      <h3 className="text-lg font-medium">Wishlist</h3>
        <p className="text-sm text-muted-foreground">
          Customize the appearance of the app. Automatically switch between day
          and night themes.
        </p>
      </div>
      <Separator />
      {/* <DisplayForm /> */}
    </div>
  )
}
