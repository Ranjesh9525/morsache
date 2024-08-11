import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import React from 'react'
import {Cart} from "@/@types/cart.d"

type Props = {
    cart:Cart
}

const Header = ({cart}: Props) => {
  return (
    <div>
        <h1>Your Cart</h1>
        <div className="w-full">
            <span className="w-full flex -items-center justify-between">
                <Link href="/" className="text-sm text-gray-500 hover:text-gray-900" >continue shopping</Link>
                <p>{cart.totalItems}</p>
            </span>
            <Separator/>
        </div>
    </div>
  )
}

export default Header