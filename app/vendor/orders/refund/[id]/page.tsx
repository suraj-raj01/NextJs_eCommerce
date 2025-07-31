'use client'
import axios from 'axios'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { Card, CardHeader, CardTitle, CardContent } from "../../../../../components/ui/card"

const ViewPage = () => {
    const [refunds, setRefunds] = useState<any>(null)

    const params = useParams();
    const id = params.id;

    const formatCurrency = (value: number | string) =>
        value ? `$${parseFloat(value.toString()).toFixed(2)}` : "$0.00"

    const formatDate = (date: string) =>
        date ? new Date(date).toLocaleString() : "N/A"

    const loadRefunds = async () => {
        try {
            const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
            const response = await axios.get(`${api}/vendor/refund/${id}`)
            setRefunds(response?.data[0] || [])
            console.log(response?.data[0])
        } catch (error) {
            console.error('Error fetching refunds:', error)
            Swal.fire({
                title: "Error",
                text: "Failed to load refunds. Please try again later.",
                icon: "error",
                draggable: true
            })
        }
    }

    useEffect(() => {
        loadRefunds();
    }, [])

    function InfoRow({
        label,
        value,
        valueClass = "text-gray-400",
    }: {
        label: string
        value: any
        valueClass?: string
    }) {
        return (
            <div className="flex justify-start gap-3 border-b border-gray-100 dark:border-gray-700 pb-1">
                <span className="">{label}:</span>
                <span className={`text-right ${valueClass}`}>{value}</span>
            </div>
        )
    }
    return (
        <div className='p-3'>

            <div className="flex items-center justify-between mt-5 mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight"> Refund Details</h1>
                    <p className="text-muted-foreground">
                        View refund details of customer / user?
                    </p>
                </div>
            </div>

            {/* {"id "}{refunds?.id} <br />
            {"orderId "}{refunds?.orderId} <br />
            {"reason "}{refunds?.reason} <br />
            {"status "}{refunds?.status} <br />
            {"confirmed "}{refunds?.order?.confirmed?(refunds?.order?.confirmed):("False")} <br />
            {"couponId "}{refunds?.order?.couponId?(refunds?.order?.couponId):("No")} <br />
            {"discount "}{refunds?.order?.discount} <br />
            {"invoiceId "}{refunds?.order?.invoiceId} <br />
            {"netTotal "}{refunds?.order?.netTotal} <br />
            {"Tax "}{refunds?.order?.tax} <br />
            {"createdAt "}{refunds?.order?.createdAt} <br /> */}

            <div className="max-w-full mx-auto mt-6 p-3 border-2 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Refund Details</h2>
                <div className="space-y-3 text-sm ">
                    <InfoRow label="ID" value={refunds?.id} />
                    <InfoRow label="Order ID" value={refunds?.orderId} />
                    <InfoRow label="Reason" value={refunds?.reason} />
                    <InfoRow label="Status" value={refunds?.status} />
                    <InfoRow
                        label="Confirmed"
                        value={refunds?.order?.confirmed ? "Yes" : "No"}
                        valueClass={
                            refunds?.order?.confirmed
                                ? "text-green-600 font-medium"
                                : "text-red-600 font-medium"
                        }
                    />
                    <InfoRow
                        label="Coupon ID"
                        value={refunds?.order?.couponId || "No"}
                        valueClass={!refunds?.order?.couponId ? "italic text-gray-400" : ""}
                    />
                    <InfoRow label="Discount" value={formatCurrency(refunds?.order?.discount)} />
                    <InfoRow label="Invoice ID" value={refunds?.order?.invoiceId} />
                    <InfoRow label="Net Total" value={formatCurrency(refunds?.order?.netTotal)} />
                    <InfoRow label="Tax" value={formatCurrency(refunds?.order?.tax)} />
                    <InfoRow label="Created At" value={formatDate(refunds?.order?.createdAt)} />
                </div>
            </div>
        </div>
    )
}

export default ViewPage