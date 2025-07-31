'use client'

import { useForm, useFieldArray } from 'react-hook-form'
import { useState } from 'react'
import { Input } from '../../../../components/ui/input'
import { Button } from '../../../../components/ui/button'
import { Card, CardContent } from '../../../../components/ui/card'
import { Switch } from '../../../../components/ui/switch'
import { Label } from '../../../../components/ui/label'
import { Checkbox } from '../../../../components/ui/checkbox'
import { Textarea } from '../../../../components/ui/textarea'
import { Save } from 'lucide-react'
import axios from 'axios'
import Swal from 'sweetalert2'
import Link from 'next/link'

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

  const onSubmit = async (data: FormValues) => {
    const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    try {
      const response = await axios.post(`${api}/store/sitesetting`, data);
      Swal.fire({
        title: response.data.data.message||"Sitesetting Created Successfully",
        icon: "success",
        draggable: true
      });
    } catch (error) {
      console.error('Failed to fetch plantypes:', error);
    }
    console.log('Submitted Data:', data)
  }

  const steps = [
    {
      label: 'Menubar',
      content: (
        <>
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
            <div key={field.id} className="grid grid-cols-2 gap-2 mb-5">
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
      label: 'Review Section',
      content: (
        <>
          <div className="flex items-center space-x-2 mt-2 mb-4">
            <Switch {...register('maintenance')} />
            <Label>Maintenance</Label>
          </div>
        </>
      )
    }
  ]

  return (
    <div className="w-full px-4 py-6 md:px-8">
      <div className='flex items-center justify-between mb-2'>
        <div className='flex items-center justify-center gap-3'>
          <Button>Upload CSV File</Button>
          <Button>Upload Exel File</Button>
        </div>
        <Button>
          <Link href="/store">Got to Site</Link>
        </Button>
      </div>
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
                  ${index === step ? '' : ''}`}
                    onClick={() => setStep(index)}
                  >
                    {index + 1}
                  </div>
                  {/* Step Label */}
                  <div className={`text-sm ${index === step ? ' font-semibold' : ''}`}>
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