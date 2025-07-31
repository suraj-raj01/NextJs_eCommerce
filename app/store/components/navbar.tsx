'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import * as icons from 'lucide-react'
import { useCartStore } from '../cartStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"
import { useRouter } from 'next/navigation'
import Theme from './../../Theme';

const SiteNavbar = () => {
  const [siteData, setSiteData] = useState<any>(null)
  const cartItems = useCartStore((state) => state.items);
  const likeItems = useCartStore((state) => state.likes);
  const cartLength = cartItems.length;
  const likeLength = likeItems.length;

  const router = useRouter();
  const [token, setToken] = useState('');

useEffect(() => {
  if (typeof window !== 'undefined') {
    const storedToken = localStorage.getItem('user')
    if (storedToken) {
      try {
        const parsed = JSON.parse(storedToken) 
        setToken(parsed?.token || '')
      } catch (error) {
        console.error('Invalid token format in localStorage')
        setToken('')
      }
    } else {
      setToken('')
    }
  }
}, [token])


  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

  const fetchStore = async () => {
    try {
      const response = await axios.get(`${api}/store/sitesetting`);
      const data = Array.isArray(response.data) ? response.data[0] : response.data;
      setSiteData(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchStore();
  }, [])

  const logout = () => {
    localStorage.removeItem('user');
    setToken('');
    router.push("/store/auth/login")
  }

  if (!siteData) return null; // optionally add a loader

  return (
    <nav className="shadow-sm sticky top-0 z-50">
      <div className="max-w-full bg-background mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center">
              {siteData && siteData?.companylogo ? (
                <>
                  <img
                    src={siteData?.companylogo}
                    alt="logo"
                    className="max-h-8 h-auto w-auto"
                  />

                </>
              ) : (
                <>
                  <span className="font-bold text-xl">L</span>
                  <span className="ml-2 text-xl font-bold ">Logo</span>
                </>
              )}
            </div>
          </div>

          {/* Navigation */}
          {siteData.checkmenu && siteData.menutitles && (
            <nav className="hidden md:flex space-x-8">
              {siteData.menutitles.map((item: any, index: number) => (
                <Link
                  key={index}
                  href={`/store${item.link}`}
                  className="hover:text-blue-600 font-medium transition-colors duration-200"
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          )}

          {/* Action Icons */}
          <div className="flex items-center space-x-4">

            <div className='    '>
              <Theme />
            </div>

            {siteData.checkfavourite && (
              <Link href='/store/likeitems'>
                <div className="relative p-2">
                  <h1 className="text-md font-bold">
                    {likeLength > 0 ? (
                      <icons.Heart className="w-5 h-5 text-red-500" />
                    ) : (
                      <icons.Heart className="w-5 h-5" />
                    )}
                  </h1>
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {likeLength}
                  </span>
                </div>
              </Link>
            )}

            {siteData.checkaddtocart && (
              <Link href='/store/cartitems'>
                <div className="relative p-2">
                  <h1 className="text-md font-bold">
                    <icons.ShoppingCart className="w-5 h-5" />
                  </h1>
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartLength}
                  </span>
                </div>
              </Link>
            )}


            {token ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <h1 className="h-6 w-6">
                    <span className="sr-only">Open menu</span>
                    <icons.UserCircle className="h-5 w-5" />
                  </h1>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <icons.Settings className="mr-2 h-4 w-4" />
                    Setting
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { router.push("/profile") }}>
                    <icons.UserCircle className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    <icons.LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <span onClick={() => { router.push("/store/auth/login") }} className="cursor-pointer">
                Login
              </span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SiteNavbar;