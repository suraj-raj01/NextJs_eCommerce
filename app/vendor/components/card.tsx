import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
  CardFooter
} from '../../../components/ui/card'
import { ChartNoAxesCombined } from 'lucide-react'

export default function CardKPI() {
    return (
        <div>
            <Card className="flex flex-row shadow-none items-center justify-between border-none bg-transparent gap-4">
                <div className="h-30 w-1/3 rounded-xl border shadow-md flex flex-col justify-center">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">Total Profit</CardTitle>
                        <CardDescription className="text-lg text-green-600"> <ChartNoAxesCombined/> </CardDescription>
                    </CardHeader>
                    <CardContent className="mt-2 text-2xl font-bold">$12,345</CardContent>
                </div>
                <div className="h-30 w-1/3 rounded-xl border shadow-md flex flex-col justify-center">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">Total Sales Items</CardTitle>
                        <CardDescription className="text-lg text-green-600"> <ChartNoAxesCombined/> </CardDescription>
                    </CardHeader>
                    <CardContent className="mt-2 text-2xl font-bold">90+</CardContent>
                </div>
                <div className="h-30 w-1/3 rounded-xl border shadow-md flex flex-col justify-center">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">Total Sales</CardTitle>
                        <CardDescription className="text-lg text-green-600"> <ChartNoAxesCombined/> </CardDescription>
                    </CardHeader>
                    <CardContent className="mt-2 text-2xl font-bold">$12,345</CardContent>
                </div>
                
            </Card>
        </div>
    )
}

