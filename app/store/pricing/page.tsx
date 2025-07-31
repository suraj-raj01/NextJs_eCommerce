import React from 'react'
import PlanPage from '../components/plans'

const ShopPage = () => {
  return (
    <div className="mb-10">
      <div className="flex-col items-center text-center gap-2 mt-5 justify-center ">
        <h1 className="text-4xl font-bold text-center">Our Plans</h1>
        <p>Choose our plans</p>
      </div>

      <PlanPage />
    </div>
  )
}

export default ShopPage