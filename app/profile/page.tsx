'use client'
import {useEffect} from 'react'

const ProfilePage = () => {
  useEffect(()=>{
    if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    if (!user) {
      window.location.href = '/store';
    }
  }
  },[])
  return (
    <div className='p-3'>ProfilePage</div>
  )
}

export default ProfilePage