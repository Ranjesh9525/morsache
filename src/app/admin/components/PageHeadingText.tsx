import { Separator } from '@/components/ui/separator'
import React from 'react'

type Props = {
    pageHeading:string;
    description:string
}

const PageHeadingText = ({pageHeading,description}: Props) => {

  return (
    <div id="header" className=" p-9 pb-5">
    <h1 className="text-4xl font-bold tracking-tight capitalize">{pageHeading}</h1>
    <p className="text-gray-500 text-[14px] my-1"> {description}</p>
    <Separator className="mt-7"/>
  </div>
  )
}

export default PageHeadingText