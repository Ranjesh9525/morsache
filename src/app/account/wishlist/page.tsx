import { Separator } from "@/components/ui/separator"
import WishlistForm  from "./wishlistForm"

export default function WishlistPage() {
  return (
    <div id="wishlist-container" className="space-y-6">
      <div>
      <h3 className="text-lg font-medium">Wishlist</h3>
        <p className="text-sm text-muted-foreground">
          {"Add products you like to your wishlist so you dont miss them, come back and get them when you're ready"}
        </p>
      </div>
      <Separator />
      {/* <DisplayForm /> */}
      <WishlistForm/>
    </div>
  )
}
