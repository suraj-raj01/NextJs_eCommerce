'use client'
import axios from 'axios'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'

const ViewPage = () => {
    const [complaints, setComplaints] = useState<any>(null)

    const params = useParams();
    const id = params.id;

    const loadComplaints = async () => {
        try {
            const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
            const response = await axios.get(`${api}/vendor/complaint/${id}`)
            setComplaints(response?.data?.complaint || [])
            console.log(response?.data?.complaint)
        } catch (error) {
            console.error('Error fetching complaints:', error)
            Swal.fire({
                title: "Error",
                text: "Failed to load complaints. Please try again later.",
                icon: "error",
                draggable: true
            })
        }
    }

    useEffect(() => {
        loadComplaints();
    }, [])

    return (
        <div className='p-3'>

            <div className="flex items-center justify-between mt-5 mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight"> Complaint Details</h1>
                    <p className="text-muted-foreground">
                        View complain details of customer / user?
                    </p>
                </div>
            </div>

            <div className="max-w-full mx-auto p-3 rounded-lg shadow-md mt-3 border-2">
                <h2 className="text-2xl font-bold text-center">Complaint Details</h2>

                <div className="mb-2">
                    <h3 className="text-lg font-semibold text-gray-500 mb-2">Complaint</h3>
                    <div className="border-l-4 border-blue-400 p-2">
                        <p><span className="font-medium">Issue:</span> {complaints?.complaint}</p>
                        <p><span className="font-medium">Status:</span> <span className="text-yellow-600">{complaints?.status}</span></p>
                    </div>
                </div>

         
                <div className="mb-2">
                    <h3 className="text-lg font-semibold text-gray-500 mb-2">Customer Information</h3>
                    <div className="grid grid-cols-2 border-l-4 border-blue-400 gap-2 p-2 rounded">
                        <p><span className="font-medium">Name:</span> {complaints?.customer?.name}</p>
                        <p><span className="font-medium">Email:</span> {complaints?.customer?.email}</p>
                        <p><span className="font-medium">Phone:</span> {complaints?.customer?.phone}</p>
                        <p><span className="font-medium">Address:</span> {complaints?.customer?.address}</p>
                        <p><span className="font-medium">City:</span> {complaints?.customer?.city}</p>
                        <p><span className="font-medium">State:</span> {complaints?.customer?.state}</p>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-gray-500 mb-2">Order Details</h3>
                    <div className="grid grid-cols-2 gap-2 border-l-4 border-blue-400 p-2 rounded">
                        <p><span className="font-medium">Order ID:</span> {complaints?.order?.id}</p>
                        <p><span className="font-medium">Invoice ID:</span> {complaints?.order?.invoiceId}</p>
                        <p><span className="font-medium">Total:</span> {complaints?.order?.netTotal}</p>
                        <p><span className="font-medium">Status:</span> {complaints?.order?.status}</p>
                        <p><span className="font-medium">Confirmed:</span> {complaints?.order?.confirmed?("True"):("False")}</p>
                        <p><span className="font-medium">Created At:</span>{complaints?.order?.createdAt}</p>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default ViewPage