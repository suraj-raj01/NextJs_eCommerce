import React from 'react'

const Stats = () => {
  return (
    <div>
        <div id='stats'>
            <div id='box'>
                <h1 className=''>Stats</h1>
            </div>
            <div id='box'>
              <p className='text-7xl font-bold text-gray-300'>400+</p>
              <p className='text-red-500 font-bold'>Cities having same day delivery</p>
            </div>
            <div id='box'>
              <p className='text-7xl font-bold text-gray-300'>100+</p>
              <p className='text-red-500 font-bold'>Countries being served with happiness</p>
            </div>
            <div id='box'>
              <p className='text-7xl font-bold text-gray-300'>5Million+</p>
              <p className='text-red-500 font-bold'>Gift boxes delivered across the globe</p>
            </div>
        </div>
    </div>
  )
}

export default Stats