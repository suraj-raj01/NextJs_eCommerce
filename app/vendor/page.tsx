import React from 'react'
import ChartAreaInteractive from './components/chart-area-interactive';
import CardKPI from './components/card';



const page = () => {
  return (
    <div className='p-3'>
      {/* <p className="text-2xl font-semibold p-2">Vendor Dashboard</p> */}
      <CardKPI/>
      <br />
      <ChartAreaInteractive/>
    </div>
  )
}

export default page