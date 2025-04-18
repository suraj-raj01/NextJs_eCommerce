import React from 'react'
import Image from 'next/image'
import img1 from "@/public/serpriseforlittleone/img1.webp"
import img2 from "@/public/serpriseforlittleone/img2.webp"

const SurpriseforLittleOne = () => {
  return (
    <>
    <br />
        <div style={{width:'90%',margin:'10px auto',padding:'2px 10px'}}
        className='font-bold text-3xl'
        >
        <p>Surprises For Little Ones</p>
        </div>
        <div id='category-main' className='border-none' style={{border:'none',justifyContent:'space-between'}}>
            <div id='box' style={{border:'none ',height:'auto',flexDirection:'column',width:'48%'}}>
            <Image src={img1} alt='delivery image' height={400}/>
            </div>
            <div id='box' style={{border:'none ',height:'auto',flexDirection:'column',width:'48%'}}>
            <Image src={img2} alt='delivery image' height={400}/>
            </div>
        </div>
    </>
  )
}

export default SurpriseforLittleOne         