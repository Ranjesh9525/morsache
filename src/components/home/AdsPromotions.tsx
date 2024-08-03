import Image from 'next/image'
import React from 'react'

type Props = {}

const AdsPromotions = (props: Props) => {
  return (
    <div className={"w-full h-full "}>
      <Image src={'/items/Offer1.jpg'} alt="" width={1000}  height={1000} className="w-full cursor-pointer object-cover h-full" />
    </div>
  )
}

export default AdsPromotions