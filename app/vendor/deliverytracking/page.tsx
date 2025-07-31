'use client'

import React, { useEffect, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import axios from 'axios'
import { DataTable } from '../components/dataTable'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"
import { Button } from '../../../components/ui/button'
import { Trash, Edit, MoreHorizontal } from 'lucide-react'
import Swal from 'sweetalert2'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../../components/ui/dialog"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { roleSchema, RoleData } from './../../validation/roleSchema';
import { Skeleton } from '../../../components/ui/skeleton'

type Order = {
    netTotal: number,
    tax: number
}

type DeliveryTracking = {
    id: string
    status: string
    location: string
    order: Order
    orderId: string
}

export default function DeliveryTracking() {
    const [tracking, setTracking] = useState<DeliveryTracking[]>([])
    const [track, setTrack] = useState<string>("")
    const [page, setPage] = useState(1)
    const [pageCount, setPageCount] = useState(1)
    const [error, setError] = useState("");
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [editingRole, setEditingRole] = useState<DeliveryTracking | null>(null)
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [formData, setFormData] = useState({
        status: " ",
        location: " "
    })
    const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

    const fetchDeliveryTracking = async () => {
        try {
            setLoading(true)
            let response
            if (searchQuery) {
                response = await axios.get(`${api}/vendor/deliverytracking/${searchQuery}`)
                setTracking(response.data || [])
                console.log(response.data)
            } else {
                response = await axios.get(`${api}/vendor/deliverytracking?page=${page}&limit=5`)
                setTracking(response.data.data || [])
            }
            const { data } = response
            console.log(data)
            setPageCount(data.meta.totalPages || 1)
        } catch (error) {
            console.error('Error fetching tracking:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDeliveryTracking();
    }, [page, searchQuery])

    const deleteRole = async (id: any) => {
        try {
            await axios.delete(`${api}/vendor/deliverytracking/${id}`)
            Swal.fire({
                title: "Role Deleted Successfully",
                icon: "success",
                draggable: true
            });
            fetchDeliveryTracking();
        } catch (error) {
            console.error('Error deleting permission:', error)
            alert('Failed to delete Role. Please try again.')
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("");
        if (!editingRole) {
            setError("No role selected for editing");
            return;
        }
        try {
            const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
            let response = await axios.patch(`${api}/vendor/deliverytracking/${editingRole.id}`, formData)
            Swal.fire({
                title: response.data?.message || "Operation completed successfully",
                icon: "success",
                draggable: true
            });

            handleDialogClose();
            fetchDeliveryTracking();
        } catch (error: any) {
            console.error('Error submitting track:', error);
            const errorMessage = error.response?.data?.message || 'Failed to submit track. Please try again.';
            setError(errorMessage);
        }
    }

    const handleEdit = (roleData: DeliveryTracking) => {
        setEditingRole(roleData);
        setTrack(roleData.status);
        setIsOpen(true);
    }

    const handleCreateNew = () => {
        setEditingRole(null);
        setTrack('');
        setError('');
        setIsOpen(true);
    }

    const handleDialogClose = () => {
        setIsOpen(false);
        setEditingRole(null);
        setTrack('');
        setError('');
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        console.log('Form Data:', formData)
    }


    const columns: ColumnDef<DeliveryTracking>[] = [
        {
            accessorKey: 'status',
            header: "Status"
        },
        {
            accessorKey: 'location',
            header: "Location"
        },
        {
            accessorKey: 'orderId',
            header: "Order Id"
        },
        {
            accessorKey: 'order',
            header: "Order Details",
            cell: ({ row }) => {
                const orders = row.original.order;
                console.log(orders);

                return (
                    <div className="flex flex-col gap-1 text-sm">
                        <div className="flex justify-start gap-3">
                            <span className="font-medium">Net Total:</span>
                            <span className="font-semibold">{orders.netTotal}{" ₹"}</span>
                        </div>
                        <div className="flex justify-start gap-3">
                            <span className="font-medium">Tax:</span>
                            <span className="font-semibold ">{orders.tax}{" ₹"}</span>
                        </div>
                    </div>
                );
            }
        },

        {
            header: "Action",
            id: "actions",
            cell: ({ row }) => {
                const item = row.original
                return (
                    <div className='flex items-center justify-start gap-1'>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">

                                <DropdownMenuItem onClick={() => handleEdit(item)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit track
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => deleteRole(item.id)}
                                >
                                    <Trash className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )
            },
        },
    ]

    const handleSearch = (query: string) => {
        setSearchQuery(query)
    }

    return (
        <div className="p-3">
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
                  <h1 className="text-3xl font-bold tracking-tight">Delivery Tracking</h1>
                  <p className="text-muted-foreground">
                    Manage and track all the delivery-tracking
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

            <DataTable
                columns={columns}
                data={tracking}
                pageCount={pageCount}
                currentPage={page}
                onPageChange={setPage}
                onSearch={handleSearch}
                isLoading = {loading}
            />

            {/* Dialog moved outside of the table */}
            <Dialog open={isOpen} onOpenChange={(open) => {
                if (!open) {
                    handleDialogClose();
                }
                setIsOpen(open);
            }}>
                <DialogContent className="sm:max-w-[525px]">
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle className='text-center'>
                                {editingRole ? 'Edit Role' : 'Create Role'}
                            </DialogTitle>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="track-status">Status *</Label>
                                <Input
                                    className='mb-4'
                                    id="track-status"
                                    type="text"
                                    placeholder="Enter track status..."
                                    name='status'
                                    value={formData.status}
                                    onChange={handleChange}
                                    required
                                />
                                <Label htmlFor="track-status">Location *</Label>
                                <Input
                                    id="track-status"
                                    type="text"
                                    placeholder="Enter track status..."
                                    name='location'
                                    value={formData.location}
                                    onChange={handleChange}
                                    required
                                />
                                {error && <p className="text-red-500 text-sm">{error}</p>}
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleDialogClose}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">
                                Update Change
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}