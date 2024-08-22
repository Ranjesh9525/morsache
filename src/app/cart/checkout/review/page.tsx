import CheckoutLayout from '@/components/layouts/CheckoutLayout'
import React from 'react'
import ReviewCard from '../../components/ReviewCard'

type Props = {}

const page = (props: Props) => {
  return (
    <CheckoutLayout title="Review - Morsache Clothing">
    <div className="w-full container grid grid-cols-9 mb-9 mt-4 gap-9">
       review 
       <ReviewCard/>
       </div>
        </CheckoutLayout>
  )
}

export default page