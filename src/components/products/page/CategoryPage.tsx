"use client"
import React, { useState,useContext } from 'react'
import DisplayProducts from '../DisplayProducts'
import Filter from '../filter/Filter'
import { GlobalContext } from "@/context/globalContext";


type Props = {
    category: string
}

const CategoriesPage = ({category}: Props) => {
  const {scrolling,setScrolling:setScrollingGlobal} = useContext(GlobalContext)!

    const [productsAmount,setProductsAmount] = useState(0)
    const [currentFilter, setCurrentFilter] = useState<{ tag: string; values: string[] }[] | []>([])
  return (
    <div id="products-page-container" className="md:grid md:grid-cols-9 gap-y-2 flex mt-6 md:mt-0 flex-col relative">
         {scrolling && <div className="md:hidden h-10"></div>}
      <section id="filter" className={`md:col-span-2 ${scrolling && "md:relative fixed" } md:relative top-[63px] md:top-0  md:p-0 bg-white w-full md:right-0 md:z-[120]`}>
          <Filter category={category} currentFilter={currentFilter} setCurrentFilter={setCurrentFilter}/>
        </section>
        <section id="filter-results" className="col-span-7 p-9">
          <DisplayProducts searchFilterData={currentFilter} setProductsAmount={setProductsAmount} category={category.toString().replaceAll("-"," ")}/>
        </section>
      </div>
  )
}

export default CategoriesPage