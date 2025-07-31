'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useCartStore } from '../cartStore';
const SiteNavbar = () => {
  const [siteData, setSiteData] = useState<any>(null)
  const cartItems = useCartStore((state) => state.items);
  const likeItems = useCartStore((state) => state.likes);
  const cartLength = cartItems.length;
  const likeLength = likeItems.length;
  console.log("like length", likeLength)

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

  if (!siteData) return null;

  return (
    <>
      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center mb-4">
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
              <p className="text-gray-400 mb-4">
                {siteData.herodescription}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">{siteData.quicklinktitle}</h3>
              <ul className="space-y-2">
                {siteData.quicklinks?.map((link: any, index: number) => (
                  <li key={index}>
                    <a href={link.link} className="text-gray-400 hover:text-white transition-colors">
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            {siteData.checkaddress && (
              <div>
                <h3 className="text-lg font-semibold mb-4">{siteData.addresstitle}</h3>
                <div className="space-y-2 text-gray-400">
                  <p>{siteData.address}</p>
                  <p>{siteData.contact}</p>
                  <p>{siteData.email}</p>
                </div>
              </div>
            )}

            {/* Social Links */}
            {siteData.checksociallink && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  {siteData.sociallinks?.map((social: any, index: number) => (
                    <a
                      key={index}
                      href={social.link}
                      className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
                    >
                      <span className="text-sm">{social.title.charAt(0)}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>{siteData.copyright} All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default SiteNavbar;