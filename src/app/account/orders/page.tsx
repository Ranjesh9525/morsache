import { Separator } from "@/components/ui/separator"
import  DisplayOrders  from "./displayOrders"

export default function OrdersPage() {
  return (
    <div className="md:space-y-6 space-y-4">
      <div>
        <h3 className="text-lg font-medium">See all your orders</h3>
        <p className="text-sm text-muted-foreground">
          Review all your orders here
        </p>
      </div>
      <Separator className="hidden md:block" />
      <DisplayOrders />
    </div>
  )
}
