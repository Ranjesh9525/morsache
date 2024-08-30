"use client"
import React, { useState } from 'react'
import DisplayProducts from '../DisplayProducts'
import Filter from '../filter/Filter'

type Props = {
    category: string
}

const CategoriesPage = ({category}: Props) => {
    const [productsAmount,setProductsAmount] = useState(0)
    const [currentFilter, setCurrentFilter] = useState<{ tag: string; values: string[] }[] | []>([])
  return (
    <div id="products-page-container" className="grid grid-cols-9">
        <section id="filter" className="col-span-2  relative">
          <Filter category={category} currentFilter={currentFilter} setCurrentFilter={setCurrentFilter}/>
        </section>
        <section id="filter-results" className="col-span-7 p-9">
          <DisplayProducts searchFilterData={currentFilter} setProductsAmount={setProductsAmount} category={category.toString().replaceAll("-"," ")}/>
        </section>
      </div>
  )
}

export default CategoriesPage