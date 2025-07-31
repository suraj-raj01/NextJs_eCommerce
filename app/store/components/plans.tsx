'use client'
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Skeleton } from "../../../components/ui/skeleton"
import { Eye, EyeOff, Edit } from 'lucide-react';
import axios from 'axios';
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
  const [isCreating, setIsCreating] = useState(false);
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

  const fetchData = async () => {
    setIsCreating(true);
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

  const View = (planId: string) => {
    alert(planId)
  };

  if (isCreating) {
    return (
      <>
        <div className='font-bold text-2xl h-100 flex items-center justify-center text-center'>
          <div className="flex items-center justify-center gap-10">
            <Skeleton className="h-90 w-[450px]" />
            <Skeleton className="h-90 w-[450px]" />
          </div>
        </div>
      </>
    )
  }

  const startEdit = (plan: any) => {
    console.log(plan)
  };

  const PlanCard = ({ plan }: { plan: Plan }) => (
    <Card
      className={`transition-all duration-300 w-1/3 ${!plan.visibility ? 'opacity-10' : ''
        } shadow-lg rounded-2xl border`}
    >
      <CardHeader className="pb-4 border-b">
        <div className="flex justify-between items-start">

          {plan.checklogo && plan.logo && (
            <div className="text-3xl">{plan.logo}</div>
          )}
          <div className="flex gap-2">
            {/* <Button
              variant="ghost"
              size="icon"
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
              onClick={() => startEdit(plan)}
            >
              <Edit className="h-5 w-5 text-muted-foreground" />
            </Button> */}
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
      <br />
      <div className="flex gap-8 items-center justify-center gap-5">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>
    </div>
  )
}

export default PlanPage