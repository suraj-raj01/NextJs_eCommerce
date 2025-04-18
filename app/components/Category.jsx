import React from 'react'
import Image from 'next/image'
import delivery from "@/public/category-images/delivery.webp"
import flowers from "@/public/category-images/flowers.webp"
import cakes from "@/public/category-images/cakes.webp"
import personalized from "@/public/category-images/personalized.webp"
import plants from "@/public/category-images/plants.webp"
import newarrival from "@/public/category-images/newarrivals.webp"
import international from "@/public/category-images/international.webp"
import bulkcorpgift from "@/public/category-images/bulkcorpgift.webp"

const Category = () => {
  return (
    <>
        <div id='category-main'>
            <div id='box'>
                <Image src={delivery} alt='delivery image' height={40}/>
                <p>Same Day Delivery</p>
            </div>
            <div id='box'>
            <Image src={flowers} alt='delivery image' height={40}/>
            <p>Flowers</p>
            </div>
            <div id='box'>
            <Image src={cakes} alt='delivery image' height={40}/>
            <p>Cakes</p>
            </div>
            <div id='box'>
            <Image src={personalized} alt='delivery image' height={40}/>
            <p>Personalized</p>
            </div>
            <div id='box'>
            <Image src={plants} alt='delivery image' height={40}/>
            <p>Plants</p>
            </div>
            <div id='box'>
            <Image src={newarrival} alt='delivery image' height={40}/>
            <p>New Arrivals</p>
            </div>
            <div id='box'>
            <Image src={international} alt='delivery image' height={40}/>
            <p>International</p>
            </div>
            <div id='box' style={{border:'none'}}>
            <Image src={bulkcorpgift} alt='delivery image' height={40}/>
            <p>Bulk / Corp Gift</p>
            </div>
        </div>
    </>
  )
}

export default Category         