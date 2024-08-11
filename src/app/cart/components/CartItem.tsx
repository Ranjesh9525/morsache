import { Product } from '@/@types/products'
import React from 'react'

type Props = {
    product:Product
}

const CartItem = ({product}: Props) => {
  return (
    <div>
        <div id="item-container" className="border p-2 w-full flex flex-row gap-2"></div>
    </div>
  )
}

export default CartItem