import Image from 'next/image'
import React from 'react'

type Props = {
  product:any
}

const ProductGallery = ({product}: Props) => {
  return (
    <div id="product-gallery" className=" relative ">
    <div className="grid grid-cols-5 gap-x-2 sticky top-0">
      <section className="col-span-1 flex flex-col gap-6 pl-5 ">
        <Image
          src={product?.images[0]}
          alt=""
          width={80}
          height={200}
          className="cursor-pointer border-2 border-black "
        />
        <Image
          src={product?.images[1]}
          alt=""
          width={80}
          height={200}
          className="cursor-pointer"
        />
      </section>
      <section className="col-span-4 pr-5">
        <Image
          src={product?.images[0]}
          alt=""
          width={700}
          height={400}
          className="cursor-zoom-in"
        />
      </section>
    </div>
  </div>
  )
}

export default ProductGallery