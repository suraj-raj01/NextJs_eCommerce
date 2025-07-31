'use client'
import React, { useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../../components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../../components/ui/pagination";
import { EllipsisVertical, SquarePen, Trash, Loader2 } from 'lucide-react'
import Link from 'next/link'
import axios from 'axios'
import { Input } from '../../../components/ui/input'
import { Button } from "../../../components/ui/button"
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'
import { RotateCw } from 'lucide-react';

export default function CustomerPage() {
    const [customer, setCustomer] = useState([])
    const [searchcustomer, setSearchCustomer] = useState("")
    const [loading, setLoading] = useState(false)
    const [token, setToken] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [limit] = useState(5);
    const [totalPages, setTotalPages] = useState(1);

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    const loadCustomers = async () => {
        try {
            setLoading(true)
            const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
            const response = await axios.get(`${api}/vendor/coustomer?page=${page}&limit=${limit}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            setCustomer(response.data.data)
            console.log(response.data)
            setTotalPages(response.data.totalPages);
            setLoading(false)
            console.log('Customers loaded:', response.data)
        } catch (error) {
            console.error('Error fetching customer:', error)
            alert('Failed to load customer. Please try again later.')
        }
        finally {
            setLoading(false)
        }
    }

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
            const response = await axios.get(`${api}/vendor/coustomer/${searchcustomer}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            setCustomer(response.data)
            setSearchCustomer("")
            console.log('Search results:', response.data)
        } catch (error) {
            console.error('Error searching customer:', error)
            alert('Failed to search customer. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadCustomers()
        const storedToken = localStorage.getItem('token');
        setToken(storedToken);
    }, [page, limit])

    const deleteCustomer = async (id: string) => {
        try {
            const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
            const response = await axios.delete(`${api}/vendor/coustomer/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            setCustomer((prev) => prev.filter((role: any) => role.id !== id))
            Swal.fire({
                title: response.data.message,
                icon: "success",
                draggable: true
            });
            loadCustomers()
        } catch (error) {
            console.error('Error deleting role:', error)
            alert('Failed to delete role. Please try again.')
        }
    }
    const router = useRouter();
    const editCustomer = (id: string) => {
        router.push(`/dashboard/customers/${id}`);
    }

    const reset = () => {
        loadCustomers();
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center mt-3 p-2 w-full">
                <form onSubmit={handleSearch} className="w-full max-w-md flex gap-2 items-center">
                    <Input
                        type="text"
                        placeholder="Search customers (by ID)"
                        value={searchcustomer}
                        onChange={(e) => setSearchCustomer(e.target.value)}
                        className="w-full"
                    />
                    <Button type="submit" variant='outline' disabled={loading}>
                        {loading ? "Searching...." : "Search"}
                    </Button>
                    <Button type="button" variant='outline' onClick={reset}>
                        <RotateCw />
                    </Button>
                </form>
            </div>

            {loading ? (
                <p className="text-gray-500">Loading customer...</p>
            ) : (
                <div className="w-full p-4">
                    <Table className="mt-5 p-3">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Address</TableHead>
                                <TableHead>State</TableHead>
                                <TableHead>City</TableHead>
                                <TableHead className="text-end">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {customer.map((item: any, index) => (

                                <TableRow key={index}>
                                    <TableCell>{item.name.toUpperCase()}</TableCell>
                                    <TableCell>{item.email}</TableCell>
                                    <TableCell>{item.phone}</TableCell>
                                    <TableCell>{item.address}</TableCell>
                                    <TableCell>{item.state}</TableCell>
                                    <TableCell>{item.city}</TableCell>
                                    <TableCell className="text-end">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" size="icon">
                                                    <EllipsisVertical />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => editCustomer(item.id)}>
                                                    Edit <SquarePen className="ml-2" />
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => deleteCustomer(item.id)}>
                                                    Delete <Trash className="ml-2" />
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>

                                    </TableCell>
                                </TableRow>

                            ))}
                        </TableBody>
                    </Table>
                    <br />
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (page > 1) setPage(page - 1);
                                    }}
                                    aria-disabled={page === 1}
                                />
                            </PaginationItem>

                            {pages.map((p) => (
                                <PaginationItem key={p}>
                                    <PaginationLink
                                        href="#"
                                        isActive={p === page}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setPage(p);
                                        }}
                                    >
                                        {p}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}

                            {totalPages > 5 && (
                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            )}

                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (page < totalPages) setPage(page + 1);
                                    }}
                                    aria-disabled={page === totalPages}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </>
    )
}
