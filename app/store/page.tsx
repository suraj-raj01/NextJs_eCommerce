'use client'
import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Star, Shield, Clock, Award } from 'lucide-react'
import axios from 'axios'
import { Button } from '../../components/ui/button'
import Link from 'next/link'
import * as icons from 'lucide-react'
import Image from 'next/image'
import ProductGrid from './products/products';
import { useCartStore } from './cartStore';

export default function Home() {
  const [siteData, setSiteData] = useState<any>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const cartItems = useCartStore((state) => state.items);
  const likeItems = useCartStore((state) => state.likes);
  const cartLength = cartItems.length;
  const likeLength = likeItems.length;
  console.log("like length", likeLength)

  useEffect(() => {

    const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    const fetchStore = async () => {
      try {
        const response = await axios.get(`${api}/store/sitesetting`)
        setSiteData(response.data[0])
        console.log(response.data[0])
      } catch (error) {
        console.log(error)
      }
    }
    fetchStore();
  }, [])
  const nextSlide = () => {
    if (siteData?.heroimages) {
      setCurrentSlide((prev) => (prev + 1) % siteData.heroimages.length)
    }
  }

  const prevSlide = () => {
    if (siteData?.heroimages) {
      setCurrentSlide((prev) => (prev - 1 + siteData.heroimages.length) % siteData.heroimages.length)
    }
  }

  if (!siteData) return (
    <div className="flex items-center justify-center min-h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <span className="ml-3 text-gray-600">Loading ...</span>
    </div>
  )

  return (
    <div className="min-h-screen ">

      {/* Hero Section */}
      {siteData.checkherosection && (
        <section className="relative h-100 overflow-hidden">
          {/* Background Carousel */}
          {siteData?.checkheroimages && Array.isArray(siteData?.heroimages) && siteData.heroimages.length > 0 ? (
            <div className="absolute inset-0">
              <div
                className="flex transition-transform duration-500 ease-in-out h-full"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                <div className="w-full h-[400px] overflow-hidden relative group">
                  {siteData.heroimages.map((image: { src: string }, index: number) => (
                    <div key={index} className="w-full h-full flex-shrink-0 flex items-center justify-center">
                      <img
                        src={image?.src}
                        alt={`Hero Image ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                  ))}
                </div>

              </div>

              {/* Carousel Navigation */}
              <Button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-opacity-20 hover:bg-opacity-30 p-3 rounded-full transition-all backdrop-blur-sm z-10"
              >
                <ChevronLeft className="w-10 h-10 bg-primary rounded-full" />
              </Button>

              <Button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-opacity-20 hover:bg-opacity-30 p-3 rounded-full transition-all backdrop-blur-sm z-10"
              >
                <ChevronRight className="w-10 h-10 bg-primary rounded-full" />
              </Button>
            </div>
          ) : (
            // Fallback empty background
            <div className="absolute inset-0" />
          )}

          {/* Overlay */}
          <div className="absolute inset-0 "></div>

          {/* Content */}
          <div className="relative z-10 flex items-center justify-center h-full ">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              {siteData.checkherotitle && (
                <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
                  {siteData.herotitle}
                </h1>
              )}
              {siteData.checkherodesc && (
                <p className="text-xl md:text-2xl mb-8 opacity-90">
                  {siteData.herodescription}
                </p>
              )}
              {siteData.checkexplorebtn && (
                <Button
                >
                  <Link href={`/store${siteData.explorebtnlink}`}>{siteData.explorebtn}</Link>
                </Button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      {siteData.checkcompanyfeature && (
        <section className="py-20 ">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {siteData.checkfeaturetitle && (
              <h2 className="text-4xl font-bold  mb-4">
                {siteData.featuretitle}
              </h2>
            )}
            {siteData.checkfeaturedesc && (
              <p className="text-xl  mb-16">
                {siteData.featuredescription}
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className=" p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16  rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 " />
                </div>
                <h3 className="text-xl font-semibold  mb-2">Affordable</h3>
                <p className="">Best prices guaranteed with unmatched value for money</p>
              </div>

              <div className=" p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 " />
                </div>
                <h3 className="text-xl font-semibold mb-2">Reliable</h3>
                <p className="">Trusted by thousands with 99.9% uptime guarantee</p>
              </div>

              <div className="p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16  rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 " />
                </div>
                <h3 className="text-xl font-semibold mb-2">Fast</h3>
                <p className="">Lightning-fast delivery and instant support</p>
              </div>
            </div>
          </div>
        </section>
      )}



      <ProductGrid />

      {/* Partners Section */}
      {siteData.checkcompanypartner && (
        <section className="py-16 ">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {siteData.checkcompanypartnertitle && (
              <h2 className="text-3xl font-bold mb-12">
                {siteData.companypartnertitle}
              </h2>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {siteData.companypartners?.map((partner: any, index: number) => (
                <div key={index} className=" p-8 rounded-lg hover:shadow-lg transition-shadow duration-300">
                  <div className="w-20 h-20  rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-10 h-10 " />
                  </div>
                  <h3 className="text-lg font-semibold ">{partner.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}