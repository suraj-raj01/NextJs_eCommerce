import Image from 'next/image'
import React from 'react'
import banner from "@/public/banner.webp"

const Banner = () => {
  return (
    <div>
        <div id="banner">
            <Image src={banner} alt='banner'/>
        </div>
    </div>
  )
}

export default Banner