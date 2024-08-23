import CheckoutLayout from '@/components/layouts/CheckoutLayout'
import React from 'react'
import ReviewCard from '../../../components/ReviewCard'

type Props = {
  params: {
    cartId: string;
  };
};

const page = (props: Props) => {
  return (
    <CheckoutLayout title="Review - Morsache Clothing">
    <div className="w-full container grid grid-cols-9 mb-9 mt-4 gap-9">
       review 
       <ReviewCard/>
       <Button onClick={()=>console.log("ef")}>Back to shopping</Button>

       </div>
        </CheckoutLayout>
  )
}

export default page