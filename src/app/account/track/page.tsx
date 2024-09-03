import { Separator } from "@/components/ui/separator";
import TrackOrder from "./TrackOrder";

export default function SettingsTrackOrderPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Track Order</h3>
        <p className="text-sm text-muted-foreground">
        Ensure this order was made by you otherwise tracking will fail
        </p>
      </div>
      <Separator />
      <TrackOrder />
    </div>
  );
}
