import React from 'react'
import Image from 'next/image'
import img1 from "../../public/occasionimg/img1.webp"
import img2 from "../../public/occasionimg/img2.webp"
import img3 from "../../public/occasionimg/img3.webp"
import img4 from "../../public/occasionimg/img4.webp"
import img5 from "../../public/occasionimg/img5.webp"
import img6 from "../../public/occasionimg/img6.webp"
import img7 from "../../public/occasionimg/img7.webp"

const Occasion = () => {
  return (
    <>
    <br />
        <div id='category-main' className='border-none' style={{border:'none',padding:'0px'}}>
            <div id='box' style={{border:'none ',height:'auto',flexDirection:'column'}}>
            <Image src={img1} alt='delivery image' height={120}/>
            <p>Cake & Flower Combo</p>
            </div>
            <div id='box' style={{border:'none ',height:'auto',flexDirection:'column'}}>
            <Image src={img2} alt='delivery image' height={120}/>
            <p>Easter</p>
            </div>
            <div id='box' style={{border:'none ',height:'auto',flexDirection:'column'}}>
            <Image src={img3} alt='delivery image' height={120}/>
            <p>Akshya Tritya</p>
            </div>
            <div id='box' style={{border:'none ',height:'auto',flexDirection:'column'}}>
            <Image src={img4} alt='delivery image' height={120}/>
            <p>Mother's Day</p>
            </div>
            <div id='box' style={{border:'none ',height:'auto',flexDirection:'column'}}>
            <Image src={img5} alt='delivery image' height={120}/>
            <p>Summer Flowers</p>
            </div>
            <div id='box' style={{border:'none ',height:'auto',flexDirection:'column'}}>
            <Image src={img6} alt='delivery image' height={120}/>
            <p>The Plant Store</p>
            </div>
            <div id='box' style={{border:'none ',height:'auto',flexDirection:'column'}}>
            <Image src={img7} alt='delivery image' height={120}/>
            <p>Trending Gifts</p>
            </div>
            
        </div>
    </>
  )
}

export default Occasion         