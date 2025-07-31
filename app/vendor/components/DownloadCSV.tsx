'use client';

import React from 'react';
import { Button } from '../../../components/ui/button';
import { DownloadIcon } from 'lucide-react';

const generateCSV = (data: any[], filename: string = 'data.csv') => {
  if (!data || data.length === 0) {
    alert('No data available to export.');
    return;
  }

  const headers = Object.keys(data[0]);

  const csvContent = [
    headers.join(','), // Header row
    ...data.map(row =>
      headers.map(field => `"${String(row[field] ?? '').replace(/"/g, '""')}"`).join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const DownloadCSV = () => {
  const exampleData = [
    {
        "companylogo": "logo.png",
        "menutitles": [
            "Home",
            "Products",
            "Contact"
        ],
        "checkmenutitle": true,
        "addtocarticon": "cart.png",
        "checkaddtocart": true,
        "favouriteicon": "heart.png",
        "checkfavourite": true,
        "loginicon": "login.png",
        "checkloginicon": true,
        "checkmenu": true,
        "heroimg": "hero.jpg",
        "checkheroimg": true,
        "herotitle": "Welcome to Our Store",
        "checkherotitle": true,
        "herodescription": "Explore our latest products",
        "checkherodesc": true,
        "heroimages": [
            "hero1.jpg",
            "hero2.jpg"
        ],
        "checkheroimages": true,
        "explorebtn": "Shop Now",
        "explorebtnlink": "/shop",
        "checkexplorebtn": true,
        "checkherosection": true,
        "companypartnertitle": "Our Partners",
        "checkcompanypartnertitle": true,
        "companypartners": [
            "Company A",
            "Company B"
        ],
        "checkcompanypartner": true,
        "featuretitle": "Why Choose Us?",
        "checkfeaturetitle": true,
        "featuredescription": "We offer the best quality",
        "checkfeaturedesc": true,
        "checkcompanyfeature": true,
        "quicklinktitle": "Quick Links",
        "quicklinks": [
            "Privacy Policy",
            "Terms of Service"
        ],
        "addresstitle": "Contact Us",
        "address": "123 Market Road",
        "contact": "9876543210",
        "email": "support@example.com",
        "checkaddress": true,
        "sociallinks": [
            "facebook.com",
            "instagram.com"
        ],
        "checksociallink": true,
        "copyright": "© 2025",
        "maintenance": false,
    }
  ];

  return (
    <div className="pl-2">
      {/* <h1 className="text-2xl font-bold mb-4">CSV Export Example</h1> */}
      <Button
        onClick={() => generateCSV(exampleData, 'sitesetting.csv')}
        variant='outline'
      >
        <DownloadIcon/>
        Download Sample
      </Button>
    </div>
  );
};

export default DownloadCSV;
