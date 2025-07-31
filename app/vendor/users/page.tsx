'use client'

import React, { useEffect, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import axios from 'axios'
import { DataTable } from '../components/dataTable'
import { Button } from '../../../components/ui/button'
import { Trash, Edit, MoreHorizontal } from 'lucide-react'
import Swal from 'sweetalert2'
import { roleSchema } from './../../validation/roleSchema';
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "../../../components/ui/breadcrumb"
import { Skeleton } from '../../../components/ui/skeleton'

type Users = {
    id: string
    name: string
    email: string
    roles: []
}

export default function Users() {
    const [users, setUsers] = useState<Users[]>([])
    const [user, setUser] = useState('')
    const [page, setPage] = useState(1)
    const [pageCount, setPageCount] = useState(1)
    const [error, setError] = useState("");
    const [isOpen, setIsOpen] = useState(false)
    const [editingRole, setEditingRole] = useState<Users | null>(null)
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [isLoading, setIsLoading] = useState(true) // Add loading state
    const [isDeleting, setIsDeleting] = useState<string | null>(null) // Track which item is being deleted

    const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

    const fetchUser = async () => {
        try {
            setIsLoading(true) // Set loading to true when fetching starts
            let response
            if (searchQuery) {
                response = await axios.get(`${api}/vendor/user/${searchQuery}`)
                setUsers(response.data || [])
            } else {
                response = await axios.get(`${api}/vendor/user?page=${page}&limit=5`)
                setUsers(response.data.data || [])
                console.log(response.data, "users")
            }
            const { data } = response
            setPageCount(data.totalPages || 1)
        } catch (error) {
            console.error('Error fetching users:', error)
        } finally {
            setIsLoading(false) // Set loading to false when fetching completes
        }
    }

    useEffect(() => {
        fetchUser();
    }, [page, searchQuery])

    const deleteRole = async (id: any) => {
        try {
            setIsDeleting(id) // Set the deleting state for this specific item
            await axios.delete(`${api}/vendor/user/${id}`)
            Swal.fire({
                title: "User Deleted Successfully",
                icon: "success",
                draggable: true
            });
            fetchUser();
        } catch (error) {
            console.error('Error deleting user:', error)
            alert('Failed to delete User. Please try again.')
        } finally {
            setIsDeleting(null) // Clear the deleting state
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Basic validation
        if (!user) {
            setError("Role name is required");
            return;
        }

        try {
            const result = roleSchema.safeParse({ user });
            if (!result.success) {
                setError(result.error.errors[0]?.message || "Invalid role name");
                return;
            }
        } catch (schemaError) {
            // If schema validation fails, continue with basic validation
            console.warn('Schema validation not available:', schemaError);
        }

        setError("");
        try {
            const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
            let response;

            if (editingRole) {
                response = await axios.patch(`${api}/vendor/user/${editingRole.id}`, { name: user, permissionIds: [] });
            } else {
                response = await axios.post(`${api}/vendor/user`, { name: user, permissionIds: [] });
            }

            Swal.fire({
                title: response.data?.message || "Operation completed successfully",
                icon: "success",
                draggable: true
            });

            handleDialogClose();
            fetchUser();
        } catch (error: any) {
            console.error('Error submitting role:', error);
            const errorMessage = error.response?.data?.message || 'Failed to submit role. Please try again.';
            setError(errorMessage);
        }
    }

    const router = useRouter();
    const handleEdit = (userData: Users) => {
        const id = userData.id;
        router.push(`/vendor/users/${id}`)
    }

    const handleDialogClose = () => {
        setIsOpen(false);
        setEditingRole(null);
        setUser('');
        setError('');
    }

    const columns: ColumnDef<Users>[] = [
        {
            accessorKey: 'name',
            header: "User Name"
        },
        {
            accessorKey: 'email',
            header: "User email"
        },
        {
            accessorKey: 'roles',
            header: "Roles",
            cell: ({ row }) => {
                const roles = row.original.roles
                return (
                    <div className="flex flex-wrap gap-1">
                        {roles.length > 0 ? roles.map((perm: any, idx: number) => (
                            <span key={idx} className="px-3 py-1 rounded-md text-sm border-1">
                                {typeof perm === 'string' ? perm : perm.name}
                            </span>
                        )) : <span className="text-gray-400 italic">No roles</span>}
                    </div>
                )
            }
        },
        {
            header: "Action",
            id: "actions",
            cell: ({ row }) => {
                const item = row.original
                const isItemDeleting = isDeleting === item.id

                return (
                    <div className='flex items-center justify-start gap-1'>
                        {isItemDeleting ? (
                            <Skeleton className="h-8 w-8" />
                        ) : (
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
                                        Edit user
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => deleteRole(item.id)}
                                    >
                                        <Trash className="mr-2 h-4 w-4" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
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
                        <BreadcrumbPage>Users</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <br />
            <div className="flex justify-between items-center mb-4">
                <div>
                    {isLoading ? (
                        <>
                            <Skeleton className="h-9 w-32 mb-2" />
                            <Skeleton className="h-5 w-48" />
                        </>
                    ) : (
                        <>
                            <h1 className="text-3xl font-bold tracking-tight">Users</h1>
                            <p className="text-muted-foreground">
                                Manage and track all users
                            </p>
                        </>
                    )}
                </div>
                {isLoading ? (
                    <Skeleton className="h-10 w-32" />
                ) : (
                    <Button>
                        <Link href='/vendor/users/create'>Create New User</Link>
                    </Button>
                )}
            </div>

            <DataTable
                columns={columns}
                data={users}
                pageCount={pageCount}
                currentPage={page}
                onPageChange={setPage}
                onSearch={handleSearch}
                isLoading={isLoading} // Pass loading state to DataTable
            />
        </div>
    )
}