'use client'

import { useForm, useFieldArray } from 'react-hook-form'
import { useEffect, useRef, useState } from 'react'
import { Input } from '../../../../../components/ui/input'
import { Button } from '../../../../../components/ui/button'
import { Card, CardContent } from '../../../../../components/ui/card'
import { Switch } from '../../../../../components/ui/switch'
import { Label } from '../../../../../components/ui/label'
import { Textarea } from '../../../../../components/ui/textarea'
import { CircleCheckBig, Save } from 'lucide-react'
import axios from 'axios'
import Swal from 'sweetalert2'
import Link from 'next/link'
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { Download } from 'lucide-react';
import { useParams } from 'next/navigation'
import DownloadCSV from './../../../components/DownloadCSV';

type FormValues = {
  companylogo?: string
  menutitles: { title: string, link: string, check: boolean }[]
  checkmenu: boolean
  addtocarticon?: string
  checkaddtocart: boolean
  favouriteicon?: string
  checkfavourite: boolean
  loginicon?: string
  checkloginicon: boolean
  checkmenutitle: boolean

  heroimg?: string
  checkheroimg: boolean
  herotitle?: string
  checkherotitle: boolean
  herodescription?: string
  checkherodesc: boolean
  heroimages: { title: string, link: string, check: boolean }[]
  checkheroimages: boolean
  explorebtn?: string
  explorebtnlink?: string
  checkexplorebtn: boolean
  checkherosection: boolean

  companypartnertitle?: string
  checkcompanypartnertitle: boolean
  companypartners: { companyname: string, companylogo: string, bgimage: string, title: string, description: string, check: boolean }[]
  checkcompanypartner: boolean

  featuretitle?: string
  checkfeaturetitle: boolean
  featuredescription?: string
  checkfeaturedesc: boolean
  checkcompanyfeature: boolean

  quicklinktitle?: string
  quicklinks: { label: string, url: string, check: boolean }[]
  addresstitle?: string
  address?: string
  contact?: string
  email?: string
  checkaddress: boolean
  sociallinks: { title: string, link: string }[]
  checksociallink: boolean

  copyright?: string
  maintenance: boolean
}

export default function SitesettingForm() {
  const [step, setStep] = useState(0)

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset
  } = useForm<FormValues>({
    defaultValues: {
      menutitles: [{ title: '', link: '', check: true }],
      checkmenu: true,
      heroimages: [{ title: '', link: '', check: true }],
      companypartners: [{ companyname: '', companylogo: '', bgimage: '', title: '', description: '', check: true }],
      quicklinks: [{ label: '', url: '', check: true }],
      sociallinks: [{ title: '', link: '' }],
      checkaddtocart: true,
      checkfavourite: true,
      checkloginicon: true,
      checkmenutitle: true,
      checkheroimg: true,
      checkherotitle: true,
      checkherodesc: true,
      checkheroimages: true,
      checkexplorebtn: true,
      checkherosection: true,
      checkcompanypartnertitle: true,
      checkcompanypartner: true,
      checkfeaturetitle: true,
      checkfeaturedesc: true,
      checkcompanyfeature: true,
      checkaddress: true,
      checksociallink: true,
      maintenance: true
    }
  })

  const menutitleField = useFieldArray({ control, name: 'menutitles' })
  const heroImageField = useFieldArray({ control, name: 'heroimages' })
  const companyPartnerField = useFieldArray({ control, name: 'companypartners' })
  const quickLinkField = useFieldArray({ control, name: 'quicklinks' })
  const socialLinkField = useFieldArray({ control, name: 'sociallinks' })

  const params = useParams()
  const id = params.id as string

  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await axios.patch(`${api}/store/sitesetting/${id}`, data);
      Swal.fire({
        title: response.data.data.message || "Sitesetting Updated Successfully",
        icon: "success",
        draggable: true
      });
    } catch (error) {
      console.error('Failed to fetch plantypes:', error);
    }
  }

  const watchdata = watch();
  const [loading, setLoading] = useState(true);

  const fetchStore = async () => {
    try {
      const response = await axios.get(`${api}/store/sitesetting`)
      const data = response?.data[0];
      reset(data);
      console.log(data)
      setLoading(false);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchStore();
  }, [])

  const steps = [
    {
      label: 'Menubar',
      content: (
        <>
          <div className="flex items-center space-x-2 mt-2 mb-4">
            <Switch {...register('maintenance')} />
            <Label>Maintenance</Label>
          </div>
          <div className="flex items-center justify-end space-x-2 mt-2 mb-4">
            <Switch {...register('checkmenu')} />
            <Label>Check Menu Title</Label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center gap-4">
              <Input {...register('companylogo')} placeholder="Company Logo (lucit icons)" className="flex-1" />
              <Switch {...register('checkmenutitle')} />
              <Label>Check</Label>
            </div>

            <div className="flex items-center gap-4">
              <Input {...register('addtocarticon')} placeholder="Add to Cart Logo (lucit icons)" className="flex-1" />
              <Switch {...register('checkmenutitle')} />
              <Label>Check</Label>
            </div>

            <div className="flex items-center gap-4">
              <Input {...register('favouriteicon')} placeholder="Favourite Logo (lucit icons)" className="flex-1" />
              <Switch {...register('checkmenutitle')} />
              <Label>Check</Label>
            </div>

            <div className="flex items-center gap-4">
              <Input {...register('loginicon')} placeholder="Loginicon Logo (lucit icons)" className="flex-1" />
              <Switch {...register('checkmenutitle')} />
              <Label>Check</Label>
            </div>
          </div>

          <Label className='mt-5 font-bold '>Menu Title & Link</Label>
          {menutitleField.fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 mt-2">
              <Input {...register(`menutitles.${index}.title`)} placeholder="Menu Title Exmp : About" />
              <Input {...register(`menutitles.${index}.link`)} placeholder="Menu URL Exmp : /about" />
              <div className="flex items-center space-x-2 mt-2 mb-4">
                <Switch {...register(`menutitles.${index}.check`)} />
              </div>
              <Button type="button" onClick={() => menutitleField.remove(index)}>Remove</Button>
            </div>
          ))}
          <Button type="button" className='mt-3' onClick={() => menutitleField.append({ title: '', link: '', check: true })}>+ Add Menu Title</Button>

          <div className="flex items-center space-x-2 mt-4">
            <Switch {...register('checkmenutitle')} />
            <Label>Check Menu Title</Label>
          </div>
        </>
      )
    },
    {
      label: 'Hero Section',
      content: (
        <>
          <div className="flex items-center justify-end space-x-2 mt-2 mb-4">
            <Switch {...register('checkherosection')} />
            <Label>Check Hero Section</Label>
          </div>
          <Input {...register('heroimg')} placeholder="Hero Image Url or Video Url" className="mb-2" />
          <div className="flex items-center space-x-2 mt-2 mb-4">
            <Switch {...register('checkheroimg')} />
            <Label>Check Img or Video Url</Label>
          </div>
          <Input {...register('herotitle')} placeholder="Hero Title" className="mb-2" />
          <div className="flex items-center space-x-2 mt-2 mb-4">
            <Switch {...register('checkheroimg')} />
            <Label>Check Hero Title</Label>
          </div>
          <Textarea {...register('herodescription')} placeholder="Hero Description . . ." className=" border w-full p-3 rounded-md" />
          <div className="flex items-center space-x-2 mt-2 mb-4">
            <Switch {...register('checkherodesc')} />
            <Label>Check Hero Description</Label>
          </div>

          <Label className='mb-2 mt-5'>Explore Button</Label>
          <div className='flex items-center gap-4 mb-4'>
            <Input {...register('explorebtn')} placeholder="Explore Button" className="mb-2" />
            <Input {...register('explorebtnlink')} placeholder="Explore URL" className="mb-2" />
            <Switch {...register('checkexplorebtn')} /> Check
          </div>


          <Label className='mb-2 font-bold'>Hero Images</Label>
          {heroImageField.fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 mb-2">
              <Input {...register(`heroimages.${index}.title`)} placeholder="Hero Image Title" />
              <Input {...register(`heroimages.${index}.link`)} placeholder="Hero Image Link" />
              <div className="flex items-center space-x-2 mt-2 mb-4">
                <Switch {...register(`heroimages.${index}.check`)} />
              </div>
              <Button type="button" onClick={() => heroImageField.remove(index)}>Remove</Button>
            </div>
          ))}
          <div className="flex items-center space-x-2 mt-2 mb-4">
            <Switch {...register('checkherodesc')} />
            <Label>Check Hero Images</Label>
          </div>
          <Button type="button" onClick={() => heroImageField.append({ title: '', link: '', check: true })}>+ Add Hero Image</Button>
        </>
      )
    },
    {
      label: 'Company Partners',
      content: (
        <>
          <div className="flex items-center justify-end space-x-2 mt-2 mb-4">
            <Switch {...register('checkcompanypartner')} />
            <Label>Check Company Partner</Label>
          </div>
          <Label className='font-bold mb-2'>Company Partner Title</Label>
          <div className='flex items-center justify-between gap-3'>
            <Input {...register('companypartnertitle')} placeholder="Example : Cybrom, Intellostack is our company partners" className="mb-4" />
            <div className="flex items-center space-x-2 mt-2 mb-4">
              <Switch {...register('checkcompanypartnertitle')} />
              <Label>Check</Label>
            </div>
          </div>
          <Label className='mb-2 font-bold'>Company Details</Label>
          {companyPartnerField.fields.map((field, index) => (
            <div key={index} className="grid grid-cols-2 gap-2 mb-5">
              <Input {...register(`companypartners.${index}.companyname`)} placeholder="Company Name" />
              <Input {...register(`companypartners.${index}.companylogo`)} placeholder="companylogo" />
              <Input {...register(`companypartners.${index}.bgimage`)} placeholder="bgimage" />
              <Input {...register(`companypartners.${index}.title`)} placeholder="Title" />
              <Textarea {...register(`companypartners.${index}.description`)} placeholder="Description" />
              <Button type="button" className='w-fit' onClick={() => companyPartnerField.remove(index)}>Remove Company Partner</Button>
              <div className="flex items-center space-x-2 mt-2 mb-4">
                <Switch {...register(`companypartners.${index}.check`)} />
                <Label>Check Company Details {index + 1}</Label>
              </div>
            </div>
          ))}
          <Button type="button" onClick={() => companyPartnerField.append({ companyname: '', companylogo: '', bgimage: '', title: '', description: '', check: true })}>+ Add Partner</Button>
        </>
      )
    },
    {
      label: 'Company Features',
      content: (
        <>
          <div className="flex items-center justify-end space-x-2 mt-2 mb-4">
            <Switch {...register('checkcompanyfeature')} />
            <Label>Check Company Features</Label>
          </div>
          <Label className='font-bold mb-2'>Company Feature Title</Label>
          <div className='flex items-center justify-between gap-3'>
            <Input {...register('featuretitle')} placeholder="Company Feature title" className="mb-4" />
            <div className="flex items-center space-x-2 mt-2 mb-4">
              <Switch {...register('checkfeaturetitle')} />
              <Label>Check</Label>
            </div>
          </div>

          <Label className='font-bold mb-2'>Feature Description</Label>
          <div className='flex items-center justify-between gap-3'>
            <Textarea {...register('featuredescription')} placeholder="Company Feature Description" className="mb-4" />
            <div className="flex items-center space-x-2 mt-2 mb-4">
              <Switch {...register('checkfeaturedesc')} />
              <Label>Check</Label>
            </div>
          </div>
          <Label className='mb-2 font-bold'>Company Details</Label>

        </>
      )
    },
    {
      label: 'Quick Links & Social',
      content: (
        <>
          <Input {...register('quicklinktitle')} placeholder="Quicklink Title" className="mb-2" />
          {quickLinkField.fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-2 gap-2 mb-2">
              <Input {...register(`quicklinks.${index}.label`)} placeholder="Label" />
              <Input {...register(`quicklinks.${index}.url`)} placeholder="URL" />
              <div className="flex items-center space-x-2 mt-2 mb-4">
                <Button type="button" className='w-fit' onClick={() => quickLinkField.remove(index)}>Remove</Button>
                <Switch {...register(`quicklinks.${index}.check`)} />
                <Label>Check</Label>
              </div>
            </div>
          ))}
          <Button type="button" onClick={() => quickLinkField.append({ label: '', url: '', check: true })}>+ Add Quicklink</Button>

          <h4 className="mt-6 font-medium">Social Links</h4>
          {socialLinkField.fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 mb-2">
              <Input {...register(`sociallinks.${index}.title`)} placeholder="Platform Name" />
              <Input {...register(`sociallinks.${index}.link`)} placeholder="Platform URL" />
              <Button type="button" onClick={() => socialLinkField.remove(index)}>Remove</Button>
            </div>
          ))}
          <div className="flex items-center space-x-2 mt-2 mb-4">
            <Switch {...register('checkaddress')} />
            <Label>Check Social Links</Label>
          </div>
          <Button type="button" onClick={() => socialLinkField.append({ title: '', link: '' })}>+ Add Social Link</Button>
        </>
      )
    },
    {
      label: 'Footer Section',
      content: (
        <>
          <div className="flex flex-wrap gap-4">
            <div className="w-full md:w-[48%]">
              <Input {...register('addresstitle')} placeholder="Address Title" className="mb-2 w-full" />
            </div>
            <div className="w-full md:w-[48%]">
              <Input {...register('address')} placeholder="Address" className="mb-2 w-full" />
            </div>
            <div className="w-full md:w-[48%]">
              <Input {...register('contact')} placeholder="Contact" className="mb-2 w-full" />
            </div>
            <div className="w-full md:w-[48%]">
              <Input {...register('email')} placeholder="Email" className="mb-2 w-full" />
            </div>
          </div>

          <div className="flex items-center space-x-2 mt-2 mb-4">
            <Switch {...register('checkaddress')} />
            <Label>Check Address</Label>
          </div>
          <textarea {...register('copyright')} placeholder="Copyright ? example : 2025@copyright" className="mb-2 w-full border rounded-md p-3" />
        </>
      )
    },
    {
      label: 'Submit Data',
      content: (
        <>

          <div className="w-full flex flex-col items-center justify-center gap-2 p-6 rounded-lg border-green-200">
            <CircleCheckBig className="text-green-600 w-12 h-12" />
            <p className=" font-semibold text-lg">Submit Data</p>
          </div>
        </>
      )
    }
  ]

  const [filedata, setFileData] = useState<any[]>([]);
  const [showbtn, setshowbtn] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (filedata && filedata.length > 0) {
      // console.log("filedata[0] after state update:", filedata[0]);
      reset(filedata[0])
    }
  }, [filedata, inputRef]);

const handleFileUpload = (event: any) => {
  const file = event.target.files[0];
  if (!file) return;

  const fileType = file.name.split('.').pop()?.toLowerCase();
  setSelectedFile(file);

  if (fileType === 'csv') {
    setshowbtn(false);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result: any) => {
        const parsedData = result.data;
        setFileData(parsedData);
        if (parsedData.length > 0) {
          reset(parsedData[0]); // ✅ Reset with first row
        }
        console.log('CSV Data:', parsedData[0]);
      },
      error: (err: any) => {
        console.error('CSV Parsing Error:', err);
        Swal.fire('Error parsing CSV file.');
      },
    });
  } else if (fileType === 'xlsx' || fileType === 'xls') {
    setshowbtn(false);
    const reader = new FileReader();
    reader.onload = (e) => {
      const binaryStr = e.target?.result;
      if (!binaryStr) {
        Swal.fire('No data found in Excel file.');
        return;
      }
      try {
        const workbook = XLSX.read(binaryStr, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const sheetData = XLSX.utils.sheet_to_json(sheet);
        setFileData(sheetData);
        if (sheetData.length > 0) {
          reset(sheetData[0] as FormValues); // ✅ Reset with first row
        }
        console.log('Excel Data:', sheetData[0]);
      } catch (err) {
        console.error('Excel Parsing Error:', err);
        Swal.fire('Error reading Excel file.');
      }
    };
    reader.readAsBinaryString(file);
  } else {
    Swal.fire('Unsupported file type. Please upload a CSV or Excel file.');
  }
};



  const uploadDataToServer = async (filedata: any) => {
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filedata),
      });

      if (response.ok) {
        console.log("Data uploaded successfully!");
      } else {
        console.error("Failed to upload data.");
      }
    } catch (error) {
      console.error("Error uploading data:", error);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setshowbtn(true);
    if (inputRef.current) {
      reset();
      inputRef.current.value = "";
      fetchStore();
    }
  };

  if (loading) {
    return (
      <>
        <div className="flex items-center h-40 justify-center w-full">
          Loading data....
        </div>
      </>
    )
  }

  return (
    <div className="w-full px-4 py-3 md:px-8">
      <Card className="px-4 py-5 mb-3">
        <span className="-mb-4 text-gray-400">Upload file csv or xlsx file</span>
        <div className='flex items-center justify-between'>
          <div className="">
            <div className="flex flex-col sm:flex-row items-center justify-start">
              <Input
                ref={inputRef}
                type="file"
                accept=".csv, .xlsx, .xls"
                onChange={handleFileUpload}
                className="w-60"
              />
              {selectedFile && (
                <Button variant="destructive" onClick={handleRemoveFile}>
                  Remove
                </Button>
              )}
              <DownloadCSV />
            </div>
          </div>
          <Button variant='outline'>
            <Link href="/store">Got to Site</Link>
          </Button>
        </div>
      </Card>
      <Card className="w-full max-w-full mx-auto shadow-xl border">
        <CardContent className="p-6 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8">
            {/* Vertical Stepper (left side) */}
            <div className="space-y-6 border-r">
              {steps.map((s, index) => (
                <div key={index} className="flex items-start space-x-4 ">
                  {/* Step Number */}
                  <div
                    className={`w-8 cursor-pointer h-8 rounded-full border flex items-center justify-center text-sm font-bold shrink-0
                  ${index === step ? 'bg-blue-600 text-background' : 'bg-background '}`}
                    onClick={() => setStep(index)}
                  >
                    {index + 1}
                  </div>
                  {/* Step Label */}
                  <div className={`text-sm ${index === step ? 'text-blue-600 font-semibold' : ''}`}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Form Area (right side) */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>{steps[step].content}</div>

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mt-8">
                {step > 0 && (
                  <Button type="button" onClick={() => setStep(step - 1)} variant="outline" className="w-full sm:w-auto">
                    ← Back
                  </Button>
                )}
                {step < steps.length - 1 ? (
                  <Button type="button" onClick={() => setStep(step + 1)} className="w-full sm:w-auto">
                    Next →
                  </Button>
                ) : (
                  <Button type="submit" className="w-full sm:w-auto">
                    <Save />
                    Create Save
                  </Button>
                )}
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>

  )
}
