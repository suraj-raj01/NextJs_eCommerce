'use client'

import React, { useEffect, useState } from 'react'
import {
    ColumnDef,
} from "@tanstack/react-table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../../components/ui/select"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../../../components/ui/dialog"
import { Button } from "../../../../components/ui/button"
import { Label } from "../../../../components/ui/label"
import {
    MoreHorizontal,
    SquarePen,
    Trash,
    ArrowUpDown,
    Eye,
} from 'lucide-react'
import axios from 'axios'
import Swal from 'sweetalert2'
import { DataTable } from '../../components/dataTable'
import { useRouter } from 'next/navigation'
import { Skeleton } from '../../../../components/ui/skeleton'

// Define the reason data type
interface Order {
    netTotal: number;
    conformed: boolean
}

interface Complaint {
    id: string
    reason: string
    status: string
    createdAt?: string
    updatedAt?: string
    orderId?: string
    [key: string]: any
    order: Order
}


// Main Component
export default function RefundPage() {
    const [refund, setRefund] = useState<Complaint[]>([])
    const [loading, setLoading] = useState(false)
    const [isEditDialogOpen, setEditDialogOpen] = useState(false)
    const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)
    const [formData, setFormData] = useState({
        reason: "",
        status: ""
    })
    const [token, setToken] = useState<string | null>(null)
    const [page, setPage] = useState(1)
    const [pageCount, setPageCount] = useState(1)

    // Status badge component
    const getStatusBadge = (status: string) => {
        const statusConfig = {
            'pending': { class: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Pending' },
            'resolved': { class: 'bg-green-100 text-green-800 border-green-200', label: 'Resolved' },
            'rejected': { class: 'bg-red-100 text-red-800 border-red-200', label: 'Rejected' },
            'in-progress': { class: 'bg-blue-100 text-blue-800 border-blue-200', label: 'In Progress' }
        }

        const config = statusConfig[status as keyof typeof statusConfig] ||
            { class: 'bg-gray-100 text-gray-800 border-gray-200', label: status }

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.class}`}>
                {config.label}
            </span>
        )
    }

    // Actions component
    const ActionsCell = ({ reason }: { reason: Complaint }) => {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => openEditDialog(reason)}>
                        <SquarePen className="mr-2 h-4 w-4" />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => viewDetails(reason.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => deleteComplaint(reason.id)}
                    >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }

    // Define columns
    const columns: ColumnDef<Complaint>[] = [

        {
            accessorKey: "id",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="hover:bg-transparent p-0"
                    >
                        Refund request Id
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => (
                <div className="font-medium">{row.getValue("id")}</div>
            ),
        },
        {
            accessorKey: "reason",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="hover:bg-transparent p-0"
                    >
                        Reason
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => (
                <div className="max-w-[300px]">
                    <div className="truncate" title={row.getValue("reason")}>
                        {row.getValue("reason")}
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "order",
            header: "Order price",
            cell: ({ row }) => {
                const orders = row.original.order
                console.log(orders)
                return (
                    <div className="flex flex-wrap gap-1">
                        {orders ? (
                            orders.netTotal + " ₹"
                        ) : (
                            "NULL"
                        )}
                    </div>
                )
            }
        },
        {
            accessorKey: "conformed",
            header: "Product conformed",
            cell: ({ row }) => {
                const orders = row.original.order
                console.log(orders)
                return (
                    <div className="flex flex-wrap gap-1">
                        {orders ? (
                            orders.conformed ? ("SUCCESS") : ("PENDING")
                        ) : (
                            "NULL"
                        )}
                    </div>
                )
            }
        },
        {
            accessorKey: "status",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="hover:bg-transparent p-0"
                    >
                        Status
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => getStatusBadge(row.getValue("status")),
            filterFn: (row, id, value) => {
                return value.includes(row.getValue(id))
            },
        },

        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => <ActionsCell reason={row.original} />,
        },
    ]

    // Load refund from API
    const loadingRefund = async () => {
        setLoading(true)
        try {
            const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
            const response = await axios.get(`${api}/vendor/refund?page=${page}&limit=5`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            setRefund(response.data.data || [])
            console.log(response.data)
            setPageCount(response.data.meta.totalPages || 1)
            console.log(response.data.meta.totalPages)
        } catch (error) {
            console.error('Error fetching refund:', error)
            Swal.fire({
                title: "Error",
                text: "Failed to load refund. Please try again later.",
                icon: "error",
                draggable: true
            })
        } finally {
            setLoading(false)
        }
    }

    // Delete reason
    const deleteComplaint = async (id: string) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        })

        if (result.isConfirmed) {
            try {
                const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
                const response = await axios.delete(`${api}/vendor/refund/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                Swal.fire({
                    title: "Deleted!",
                    text: response.data.message || "Complaint has been deleted.",
                    icon: "success",
                    draggable: true
                })

                loadingRefund()
            } catch (error) {
                console.error('Error deleting reason:', error)
                Swal.fire({
                    title: "Error",
                    text: "Failed to delete reason. Please try again.",
                    icon: "error",
                    draggable: true
                })
            }
        }
    }

    // Edit reason
    const openEditDialog = (reason: Complaint) => {
        setSelectedComplaint(reason)
        setFormData({
            reason: reason.reason || "",
            status: reason.status || ""
        })
        setEditDialogOpen(true)
    }

    const router = useRouter();
    const viewDetails = (id: string) => {
        router.push(`/vendor/orders/refund/${id}`)
    }

    const updateComplaint = async () => {
        if (!selectedComplaint) return

        try {
            const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
            await axios.patch(`${api}/vendor/refund/${selectedComplaint.id}`, {
                reason: formData.reason,
                status: formData.status
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            Swal.fire({
                title: "Success!",
                text: "Complaint updated successfully",
                icon: "success",
                draggable: true
            })

            loadingRefund()
            setEditDialogOpen(false)
            setSelectedComplaint(null)
        } catch (error) {
            console.error('Error updating reason:', error)
            Swal.fire({
                title: "Error",
                text: "Failed to update reason. Please try again.",
                icon: "error",
                draggable: true
            })
        }
    }

    // Initialize component
    useEffect(() => {
        const storedToken = localStorage.getItem('token')
        setToken(storedToken)
        loadingRefund()
    }, [page])

    useEffect(() => {
        if (token) {
            loadingRefund()
        }
    }, [token, page])

    return (
        <div className="container mx-auto p-3">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        {loading ? (
                            <>
                                <Skeleton className="h-9 w-32 mb-2" />
                                <Skeleton className="h-5 w-48" />
                            </>
                        ) : (
                            <>
                                <div>
                                    <h1 className="text-3xl font-bold tracking-tight">Refunds</h1>
                                    <p className="text-muted-foreground">
                                        Manage and track all the refunds
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                    {loading ? (
                        <Skeleton className="h-10 w-32" />
                    ) : (
                        ""
                    )}
                </div>
            </div>

            {/* DataTable */}
            <DataTable
                columns={columns}
                data={refund}
                pageCount={pageCount}
                currentPage={page}
                onPageChange={setPage}
                isLoading={loading}
            />

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Complaint</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="reason">Complaint</Label>
                            <textarea
                                id="reason"
                                className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                                value={formData.reason}
                                onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                                placeholder="Enter reason details..."
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                            >
                                <SelectTrigger className='w-full'>
                                    <SelectValue placeholder="Select status" defaultChecked />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="in-progress">In Progress</SelectItem>
                                    <SelectItem value="resolved">Resolved</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button onClick={updateComplaint}>Update Complaint</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}