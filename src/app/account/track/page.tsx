import { Separator } from "@/components/ui/separator"
// import { TrackOrderForm } from "./TrackOrder-form"

export default function SettingsTrackOrderPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Track Order</h3>
        <p className="text-sm text-muted-foreground">
          Track All Your Active Orders
        </p>
      </div>
      <Separator />
      {/* <TrackOrderForm /> */}
    </div>
  )
}
