import React from 'react'
import Image from 'next/image'
import img1 from "@/public/samedaydelivery/img1.webp"
import img2 from "@/public/samedaydelivery/img2.webp"
import img3 from "@/public/samedaydelivery/img3.webp"
import img4 from "@/public/samedaydelivery/img4.webp"
import img5 from "@/public/samedaydelivery/img5.webp"
import img6 from "@/public/samedaydelivery/img6.webp"
import img7 from "@/public/samedaydelivery/img7.webp"
import img8 from "@/public/samedaydelivery/img8.webp"

const SameDayDelivery = () => {
  return (
    <>
        <div style={{width:'95%',margin:'10px auto',padding:'2px 10px'}}
        className='font-bold text-3xl'
        >
        <p>Same Day Delivery</p>
        </div>
        <div id='category-main' className='border-none' style={{border:'none'}}>
            <div id='box' style={{border:'none ',height:'auto',flexDirection:'column',width:'300px'}}>
            <Image src={img1} alt='delivery image' height={250}/>
            </div>
            <div id='box' style={{border:'none ',height:'auto',flexDirection:'column',width:'300px'}}>
            <Image src={img2} alt='delivery image' height={250}/>
            </div>

            <div id='box' style={{border:'none ',height:'auto',flexDirection:'column',width:'300px'}}>
            <Image src={img3} alt='delivery image' height={250}/>
            </div>
            <div id='box' style={{border:'none ',height:'auto',flexDirection:'column',width:'300px'}}>
            <Image src={img4} alt='delivery image' height={250}/>
            </div>
            <div id='box' style={{border:'none ',height:'auto',flexDirection:'column',width:'300px'}}>
            <Image src={img5} alt='delivery image' height={250}/>
            </div>
            <div id='box' style={{border:'none ',height:'auto',flexDirection:'column',width:'300px'}}>
            <Image src={img6} alt='delivery image' height={250}/>
            </div>
            <div id='box' style={{border:'none ',height:'auto',flexDirection:'column',width:'300px'}}>
            <Image src={img7} alt='delivery image' height={250}/>
            </div>
            <div id='box' style={{border:'none ',height:'auto',flexDirection:'column',width:'300px'}}>
            <Image src={img8} alt='delivery image' height={250}/>
            </div>
            
        </div>
    </>
  )
}

export default SameDayDelivery         