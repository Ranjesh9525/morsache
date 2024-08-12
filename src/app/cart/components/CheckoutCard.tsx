import Link from 'next/link'
import React from 'react'

type Props = {}

const CheckoutCard = (props: Props) => {
  return (
    <div>CheckoutCard
      <Link href="/cart/checkout">Checkout</Link>
    </div>
  )
}

export default CheckoutCard