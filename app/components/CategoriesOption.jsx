import Image from 'next/image'
import React from 'react'
import img1 from "../../public/categoriesoption/img1.webp"
import img2 from "../../public/categoriesoption/img2.webp"
import img3 from "../../public/categoriesoption/img3.webp"
import img4 from "../../public/categoriesoption/img4.jpg"
import img5 from "../../public/categoriesoption/img5.webp"

const CategoriesOption = () => {
  return (
    <div>
       <div style={{width:'91%',margin:'auto'}}>
       <p className='font-bold text-3xl'>Categories</p>
       <p className='font-bold text-gray-300'>Wide range of gifts for your celebration</p>
       </div>
        <div id='parent'>
            <div id='parent1'>
            <div id="box">
                <div id="img">
                <Image src={img1} alt='category'/>
                </div>
                <div id="content">
                   <p className='font-bold text-1xl'>Cakes</p>
                   <p>Birthday Cakes</p>
                   <p>Birthday Cakes</p>
                   <p>Birthday Cakes</p>
                   <p>Birthday Cakes</p>
                </div>
            </div>
            <div id="box">
                <div id="img">
                <Image src={img2} alt='category'/>
                </div>
                <div id="content">
                <p className='font-bold text-1xl'>Flowers</p>
                   <p>Aniversary Flower</p>
                   <p>Birthday Flower</p>
                   <p>Gift Flower</p>
                   <p>Roses</p>
                </div>
            </div>
            </div>

            <div id='parent2'>
                <div id="box">
                <div id="img">
                <Image src={img3} alt='category' height={120} width={190}/>
                </div>
                <div id="content">
                <p className='font-bold text-1xl'>Flowers</p>
                   <p>Aniversary Flower</p>
                   <p>Birthday Flower</p>
                   <p>Gift Flower</p>
                   <p>Roses</p>
                </div>
                </div>
                <div id="box">
                <div id="img">
                <Image src={img4} alt='category' height={120} width={190}/>
                </div>
                <div id="content">
                <p className='font-bold text-1xl'>Flowers</p>
                   <p>Aniversary Flower</p>
                   <p>Birthday Flower</p>
                   <p>Gift Flower</p>
                   <p>Roses</p>
                </div>
                </div>
                <div id="box">
                <div id="img">
                <Image src={img5} alt='category' height={120} width={190}/>
                </div>
                <div id="content">
                <p className='font-bold text-1xl'>Flowers</p>
                   <p>Aniversary Flower</p>
                   <p>Birthday Flower</p>
                   <p>Gift Flower</p>
                   <p>Roses</p>
                </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default CategoriesOption