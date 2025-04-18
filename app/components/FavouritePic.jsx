import React from 'react'
import Image from 'next/image'
import img1 from "@/public/favouritepic/img1.webp"
import img2 from "@/public/favouritepic/img2.webp"
import img3 from "@/public/favouritepic/img3.webp"
import img4 from "@/public/favouritepic/img4.webp"
import img5 from "@/public/favouritepic/img5.webp"

const FavouritePic = () => {
  return (
    <>
        <div style={{width:'95%',margin:'10px auto',padding:'2px 10px'}}
        className='font-bold text-3xl'
        >
        <p>Your Favourite Pics</p>
        </div>
        <div id='category-main' className='border-none' style={{border:'none'}}>
            <div id='box' style={{border:'none ',height:'auto',flexDirection:'column',width:'48%'}}>
            <Image src={img1} alt='delivery image' height={400}/>
            </div>
            <div id='box' style={{border:'none ',height:'auto',flexDirection:'column',width:'48%'}}>
            <Image src={img2} alt='delivery image' height={400}/>
            </div>

            <div id='box' style={{border:'none ',height:'auto',flexDirection:'column',width:'30%'}}>
            <Image src={img3} alt='delivery image' height={400}/>
            </div>
            <div id='box' style={{border:'none ',height:'auto',flexDirection:'column',width:'30%'}}>
            <Image src={img4} alt='delivery image' height={400}/>
            </div>
            <div id='box' style={{border:'none ',height:'auto',flexDirection:'column',width:'30%'}}>
            <Image src={img5} alt='delivery image' height={400}/>
            </div>
            
        </div>
    </>
  )
}

export default FavouritePic         