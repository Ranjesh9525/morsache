import HomeLayout from '@/components/layouts/HomeLayout'
import React from 'react'

type Props = {}

const notFound = (props: Props) => {
  return (
    <HomeLayout title="500 - Morsache Clothing"> <h1 className="min-h-screen text-center pt-10">500 - server error , try again later</h1></HomeLayout> 
  )
}

export default notFound