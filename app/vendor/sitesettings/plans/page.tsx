'use client'
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Textarea } from '../../../../components/ui/textarea';
import { Switch } from '../../../../components/ui/switch';
import { Badge } from '../../../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../components/ui/tabs';
import { Plus, X, Eye, EyeOff, Edit, Save, XCircle } from 'lucide-react';
import axios from 'axios';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../../components/ui/breadcrumb"
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Skeleton } from "../../../../components/ui/skeleton"

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

const PlanPage = () => {

  const [plans, setPlans] = useState<Plan[]>([]);
  const [isCreating, setIsCreating] = useState(true);
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

  const fetchData = async () => {
    try {
      const response = await axios.get(`${api}/store/plans`);
      setPlans(response.data);
    } catch (error) {
      console.error('Failed to fetch plantypes:', error);
    } finally {
      setIsCreating(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [])

  const router = useRouter();

  const View = (planId: string) => {
    router.push(`/vendor/sitesettings/plans/edit/view/${planId}`)
  };

  const startEdit = (plan: any) => {
    router.push(`/vendor/sitesettings/plans/edit/${plan?.id}`)
  };

  const PlanCard = ({ plan }: { plan: Plan }) => (
    <Card
      className={`transition-all duration-300 ${!plan.visibility ? 'opacity-10' : ''
        } shadow-lg rounded-2xl border`}
    >
      <CardHeader className="pb-4 border-b">
        <div className="flex justify-between items-start">

          {plan.checklogo && plan.logo && (
            <div className="text-xl">{plan.logo}</div>
          )}
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="border-1"
              onClick={() => View(plan.id)}
            >
              {plan.visibility ? (
                <Eye className="h-5 w-5 text-muted-foreground" />
              ) : (
                <EyeOff className="h-5 w-5 text-muted-foreground" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="border-1"
              onClick={() => startEdit(plan)}
            >
              <Edit className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-start">
          <div className="flex items-start justify-between gap-4">
            <div>
              {plan.checktitle && plan.title && (
                <CardTitle className="text-xl font-semibold leading-snug">{plan.title}</CardTitle>
              )}
              {plan.checksubtitle && plan.subtitle && (
                <p className="text-sm text-muted-foreground">{plan.subtitle}</p>
              )}
            </div>
          </div>


        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {plan.checkprice && plan.price !== null && (
          <div className="text-3xl font-bold text-primary">
            ${plan.price.toFixed(2)}
            {plan.checkduration && plan.duration && (
              <span className="ml-1 text-base font-normal text-muted-foreground">
                /{plan.duration}
              </span>
            )}
          </div>
        )}

        {plan.checkdescription && plan.description && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {plan.description}
          </p>
        )}

        {plan.checkfeatures && plan.features.length > 0 && (
          <div>
            <h4 className="font-medium mb-1">Features:</h4>
            <ul className="text-sm space-y-1 list-inside list-disc pl-2 text-muted-foreground">
              {plan.features.map((feature: string, index: number) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        )}

        {plan.checkbutton && plan.button && (
          <Button className="w-full mt-2">{plan.button}</Button>
        )}
      </CardContent>
    </Card>
  );

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
            <BreadcrumbPage>Plans</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <br />
      <div className="flex justify-between items-center mb-4">
        <div>
          {isCreating ? (
            <>
              <Skeleton className="h-9 w-32 mb-2" />
              <Skeleton className="h-5 w-48" />
            </>
          ) : (
            <>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Roles</h1>
                <p className="text-muted-foreground">
                  Manage and track your all plans
                </p>
              </div>
            </>
          )}
        </div>
        {isCreating ? (
          <Skeleton className="h-10 w-32" />
        ) : (
          <Button >
            <Link href='/vendor/sitesettings/plans/create'>Create new plan</Link>
          </Button>
        )}
      </div>
      <br />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isCreating
          ? Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-[440px] w-full" />
          ))
          : plans.map((plan) => <PlanCard key={plan.id} plan={plan} />)
        }
      </div>

    </div>
  )
}

export default PlanPage