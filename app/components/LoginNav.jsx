'use client'
import Image from 'next/image'
import React from 'react'
import logo from "../../public/logo/logo.png"
import { useRouter } from 'next/navigation'



const LoginNav = () => {

    const router = useRouter();
    const home=()=>{
        router.push("/")
    }

  return (
    <div>
        <div className='w-full flex items-center content-between text-center shadow-blue-300 border-1' style={{justifyContent:'space-between'}}>
            <Image src={logo} alt='logo' height={80} width={80} onClick={home}/>
           
        </div>
    </div>
  )
}

export default LoginNav