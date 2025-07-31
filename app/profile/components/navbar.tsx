'use client'
import { LogOut,Settings,UserCircle } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { SidebarTrigger } from '../../../components/ui/sidebar'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"

const ProfileNav = () => {
  const router = useRouter()
  const [email, setEmail] = useState<string | null>(null)

  const logOut = () => {
    localStorage.removeItem('user')
    router.push('/store')
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('user')
      if (storedToken) {
        try {
          const parsed = JSON.parse(storedToken)
          setEmail(parsed?.user?.email || '')
        } catch (error) {
          console.error('Invalid token format in localStorage')
          setEmail('')
        }
      } else {
        setEmail('')
      }
    }
  }, [])

  return (
    <div className="w-full h-15 border-b bg-background/95 backdrop-blur shadow-sm flex items-center justify-between pr-10 pl-4">
      <SidebarTrigger className="h-8 w-8 flex-shrink-0" />
      <section className="flex items-center gap-2">
        {email && (
          <header className="flex items-center gap-2">
            <span className="rounded-full border shadow-md h-8 w-8 flex items-center justify-center">
              {email[0]?.toUpperCase()}
            </span>
            <span className="text-sm text-muted-foreground border-r-2 pr-2">{email}</span>
          </header>
        )}
        {/*  */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <h1 className="h-6 w-6">
              <span className="sr-only">Open menu</span>
              <LogOut
                className="text-red-600 -mt-1 p-2 cursor-pointer border shadow-md rounded-full h-8 w-8"
              />
            </h1>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4 cursor-pointer" />
              Setting
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { router.push("/profile") }}>
              <UserCircle className="mr-2 h-4 w-4 cursor-pointer" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem  onClick={logOut} className='cursor-pointer'>
              <LogOut className="mr-2 h-4 w-4 cursor-pointer" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </section>
    </div>
  )
}

export default ProfileNav
