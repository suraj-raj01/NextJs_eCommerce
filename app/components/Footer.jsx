import Image from 'next/image'
import React from 'react'
import android from "@/public/Socialmedia/android.webp"
import apple from "@/public/Socialmedia/apple.webp"
import facebook from "@/public/Socialmedia/facebook.png"
import twitter from "@/public/Socialmedia/twitter.png"
import linkedin from "@/public/Socialmedia/linkedin.png"
import instagram from "@/public/Socialmedia/instagram.png"
import youtube from "@/public/Socialmedia/youtube.png"
import logo from "@/public/logo/logo.png"
import { FaCcVisa } from "react-icons/fa";
import { FaCcMastercard } from "react-icons/fa";
import { SiAmericanexpress } from "react-icons/si";

const Footer = () => {
  return (
    <div className='bg-gray-100'>
        <div id="socials" >
            <div id="box1" class="app">
                <Image src={android} alt='android'/>
                <Image src={apple} alt='android'/>
            </div>
            <div id="box2">
            <Image src={facebook} alt='android'/>
            <Image src={twitter} alt='android'/>
            <Image src={linkedin} alt='android'/>
            <Image src={instagram} alt='android'/>
            <Image src={youtube} alt='android'/>
            </div>
        </div>
        <hr />
        <div className='pl-20 pt-5 pb-5'>
          <p className='font-bold'>IGP.com - Same Day Online Gift Delivery in India, Send Gifts Online</p>
          <p className='text-xs'>IGP is your Trusted Online Gift Shop Near You with a vast assortment of Personalized Gifts, Flowers, Cakes, Home & Living, Fashion & Lifestyle Gifts, Toys & Games, Jewellery, Gourmet & Plants. </p>
          <p className='text-xs'>From Valentine's Day, Birthdays to Wedding Anniversaries and Rakhi to New Year, we have a gift for every occasion! With Same Day Delivery to 400+ Cities, catering to over 500 million customers in 100+ countries, IGP is all about delights & enhancing the joy of searching gifts for loved ones.</p>
          <p className='text-xs'>Cakes and flower are one of the most appreciated gifts for all special occasions. IGP is an online gift shop that houses some of the tastiest cakes and fresh flowers. </p>
          <p className='text-xs'>Our range of cakes comprises of tempting chocolate, black forest, strawberry, vanilla, butterscotch and much more. We also provide you designer cakes that are exclusive gifts available at IGP. We also house photo cakes in vanilla, chocolate and dark chocolate flavours. </p>
          <p className='text-xs'>If you wish to send cake online for your loved ones, you can easily do so by choosing online cake delivery from our website. We house fresh flower bouquets that you can pick to please a dear one on a special occasion. Fresh roses, carnations, orchids, gerberas are some flowers that are always high in demand on our website. </p>
          <p className='text-xs'>Order cakes online along with flowers and make your dear one's occasions even more special with your thoughtful gifts. We offer same day delivery and midnight delivery of flowers and cakes in India. </p>
          <button className='p-2 border-1'>SHOW MORE</button>
        </div>
        <hr />

        <div style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
        <Image src={logo} alt='logo'/>
        </div>
        
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px'}} className='bg-gray-200'>
        <div></div>
        <div>Copyright © 2000-2025. IGP.com. All rights reserved</div>
        <div className='flex gap-2 items-center text-xs'>Payment Methods : <FaCcVisa /> <FaCcMastercard /> <SiAmericanexpress /></div>
      </div>

    </div>
  )
}

export default Footer