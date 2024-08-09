import HomeLayout from '@/components/layouts/HomeLayout'
import React from 'react'

type Props = {}

const notFound = (props: Props) => {
  return (
    <HomeLayout title="404 - Morsache Clothing"> <h1 className="min-h-screen text-center pt-10">404 - The Page your Looking for does not exist</h1></HomeLayout> 
  )
}

export default notFound