'use client'

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../../../../../../components/ui/card'
import { Button } from '../../../../../../../components/ui/button'
import { Badge } from '../../../../../../../components/ui/badge'
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../../../../../components/ui/breadcrumb"
import { Switch } from "../../../../../../../components/ui/switch"
import { Edit } from 'lucide-react';

type Plan = {
  id: string;
  logo: string;
  checklogo: boolean;
  title: string;
  checktitle: boolean;
  subtitle: string;
  checksubtitle: boolean;
  price: number;
  checkprice: boolean;
  duration: string;
  checkduration: boolean;
  description: string;
  checkdescription: boolean;
  features: string[];
  checkfeatures: boolean;
  visibility: boolean;
  button: string;
  checkbutton: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};


export default function PricingCard() {

  const [plans, setPlans] = useState<Plan[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
  const params = useParams();
  const id = params.id as string

  const fetchData = async () => {
    setIsCreating(true);
    try {
      const response = await axios.post(`${api}/store/plans/${id}`);
      setPlans(response.data.data);
      console.log(response.data.data)
    } catch (error) {
      console.error('Failed to fetch plantypes:', error);
    } finally {
      setIsCreating(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [])

  if (isCreating) {
    return (
      <div className='text-center mt-10'>
        Loading ...
      </div>
    )
  }

  const router = useRouter();
  const editPlan=()=>{
    router.push(`/vendor/sitesettings/plans/edit/${id}`)
  }

  return (
    <div className='p-3'>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/vendor">Vendor-dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/vendor/sitesettings">Site-settings</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/vendor/sitesettings">Plans</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>View</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center justify-center h-full mt-10">
        {plans.map((plan, index) => (
          <Card key={index} className="rounded-2xl grid-cols-2 w-full transition duration-300">

            <div className='flex items-center justify-end gap-2 pr-10'
            onClick={editPlan}
            >
              <Edit className='h-5 w-5 cursor-pointer'/>
            </div>

            <div className="grid md:grid-cols-2 gap-6 p-4 -mt-3 rounded-xl">
              <div className="space-y-4">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Logo</span>
                    <Switch checked={plan.checklogo} />
                  </div>
                  {plan.checklogo && <Badge className="w-fit">{plan.logo}</Badge>}

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Plan Title</span>
                    <Switch checked={plan.checktitle} />
                  </div>
                  {plan.checktitle && (
                    <CardTitle className="text-2xl font-bold">{plan.title}</CardTitle>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Plan Subtitle</span>
                    <Switch checked={plan.checksubtitle} />
                  </div>
                  {plan.checksubtitle && (
                    <CardDescription className="text-muted-foreground">
                      {plan.subtitle}
                    </CardDescription>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Price</span>
                    <Switch checked={plan.checkprice} />
                  </div>
                  {plan.checkprice && (
                    <div className="text-4xl font-semibold text-primary">
                      ₹{plan.price}
                    </div>
                  )}

                </CardHeader>
              </div>

              <div className="space-y-4">
                <CardContent className="space-y-4">

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Duration</span>
                    <Switch checked={plan.checkduration} />
                  </div>
                  {plan.checkduration && (
                    <p className="text-sm text-muted-foreground">Valid for 1 year</p>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Plan Description</span>
                    <Switch checked={plan.checkdescription} />
                  </div>
                  {plan.checkdescription && (
                    <p className="text-sm ">{plan.description}</p>
                  )}
                  {plan.checkfeatures && (
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {plan.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </div>
            </div>


            <CardFooter className='flex-col items-center justify-center'>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-sm font-medium">Choose plan button</span>
                <Switch checked={plan.checkbutton} />
              </div>

              {plan.checkbutton && (
                <Button className="w-full" variant="default">
                  {plan.button}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
