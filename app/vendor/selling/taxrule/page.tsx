'use client'

import React, { useEffect, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import axios from 'axios'
import { DataTable } from '../../components/dataTable'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu"
import { Button } from '../../../../components/ui/button'
import { Trash, Edit, MoreHorizontal } from 'lucide-react'
import Swal from 'sweetalert2'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../../../components/ui/dialog"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import { roleSchema } from './../../../validation/roleSchema';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select"
import { taxRuleSchema, TaxRuleFormData } from '../../../validation/taxruleSchema'
import Countries from '../../Countries'
import { useRouter } from 'next/navigation'
import { Skeleton } from '../../../../components/ui/skeleton'

type Taxrule = {
    id: string
    country: string
    state: string
    type: string
    rate: number
}

export default function Taxrule() {
    const [taxrule, setTaxrule] = useState<Taxrule[]>([])
    const [tax, setTax] = useState('')
    const [page, setPage] = useState(1)
    const [pageCount, setPageCount] = useState(1)
    const [error, setError] = useState("");
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [editingTax, setEditingRole] = useState<Taxrule | null>(null)
    const [countries, setCountries] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [formDataUpdate, setformDataUpdate] = useState<TaxRuleFormData>({
        country: '',
        state: '',
        type: '',
        rate: Number(0)
    });
    const [token, setToken] = useState<string | null>(null);
    const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

    const fetchTaxrule = async () => {
        try {
            setLoading(true)
            let response
            if (searchQuery) {
                response = await axios.get(`${api}/vendor/taxrule/${searchQuery}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                setTaxrule(response.data || [])
                console.log(response.data)
            } else {
                response = await axios.get(`${api}/vendor/taxrule?page=${page}&limit=5`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                setTaxrule(response.data.data || [])
            }
            const { data } = response
            console.log(data)
            setPageCount(data.totalPages || 1)
        } catch (error) {
            console.error('Error fetching taxrule:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTaxrule();
        const storedToken = localStorage.getItem('token');
        setToken(storedToken);
    }, [page, searchQuery])

    const deleteTax = async (id: any) => {
        try {
            await axios.delete(`${api}/vendor/taxrule/${id}`)
            Swal.fire({
                title: "Role Deleted Successfully",
                icon: "success",
                draggable: true
            });
            fetchTaxrule();
        } catch (error) {
            console.error('Error deleting permission:', error)
            alert('Failed to delete Role. Please try again.')
        }
    }

    useEffect(() => {
        setCountries(Countries);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
            if (!editingTax) return;
            const response = await axios.patch(`${api}/vendor/taxrule/${editingTax.id}`, formDataUpdate, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            Swal.fire({
                title: response.data?.message || "Operation completed successfully",
                icon: "success",
                draggable: true
            });

            handleDialogClose();
            fetchTaxrule();
        } catch (error: any) {
            console.error('Error submitting tax:', error);
            const errorMessage = error.response?.data?.message || 'Failed to submit tax. Please try again.';
            setError(errorMessage);
        }
    }

    const handleEdit = (roleData: Taxrule) => {
        setEditingRole(roleData);
        setTax(roleData.country);
        setIsOpen(true);
    }

    const router = useRouter();
    const handleCreateNew = () => {
        router.push("/vendor/selling/taxrule/create")
    }

    const handleDialogClose = () => {
        setIsOpen(false);
        setEditingRole(null);
        setTax('');
        setError('');
    }

    const columns: ColumnDef<Taxrule>[] = [
        {
            accessorKey: 'country',
            header: "Country Name"
        },
        {
            accessorKey: 'state',
            header: "State"
        },
        {
            accessorKey: 'type',
            header: "Tax type"
        },
        {
            accessorKey: 'rate',
            header: "Rate"
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
                                    Edit Status
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => deleteTax(item.id)}
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

    const handleUpdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setformDataUpdate(prev => ({
            ...prev,
            [name]: value
        }))
        console.log('Update Form Data:', formDataUpdate)
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
                                <h1 className="text-3xl font-bold tracking-tight">Taxrule</h1>
                                <p className="text-muted-foreground">
                                    Manage and track all the Taxrule
                                </p>
                            </div>
                        </>
                    )}
                </div>
                {loading ? (
                    <Skeleton className="h-10 w-32" />
                ) : (
                    <Button onClick={handleCreateNew}>
                        Create New Taxrule
                    </Button>
                )}
            </div>

            <DataTable
                columns={columns}
                data={taxrule}
                pageCount={pageCount}
                currentPage={page}
                onPageChange={setPage}
                onSearch={handleSearch}
                isLoading={loading}
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
                                {'Edit Taxrule'}
                            </DialogTitle>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <Select onValueChange={(value) => setformDataUpdate(prev => ({ ...prev, country: value }))}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Country" />
                                </SelectTrigger>
                                <SelectContent>
                                    {countries.map((country) => (
                                        <SelectItem key={country} value={country}>
                                            {country}
                                        </SelectItem>
                                    ))}
                                    {/* {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>} */}
                                </SelectContent>
                            </Select>


                            <Input
                                type="text"
                                name="state"
                                placeholder="Enter State"
                                value={formDataUpdate.state}
                                onChange={handleUpdateChange}
                            />
                            {/* {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>} */}


                            <Input
                                type="text"
                                name="type"
                                placeholder="Enter Type"
                                value={formDataUpdate.type}
                                onChange={handleUpdateChange}
                            />
                            {/* {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>} */}


                            <Input
                                type="number"
                                name="rate"
                                placeholder="Enter Rate"
                                value={formDataUpdate.rate}
                                onChange={handleUpdateChange}
                            />
                            {/* {errors.rate && <p className="text-red-500 text-sm mt-1">{errors.rate}</p>} */}

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
                                Update change
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}