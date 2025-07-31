'use client'

import React, { useEffect, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import axios from 'axios'
import { DataTable } from '../../components/dataTable'
import { Button } from '../../../../components/ui/button'
import { Trash, Edit, Plus, MoreHorizontal } from 'lucide-react'
import Swal from 'sweetalert2'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../../../components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import { Skeleton } from '../../../../components/ui/skeleton'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "../../../../components/ui/breadcrumb"

type Permission = {
    id: string
    name: string
    description?: string
    permissions?: []
    roles?: []
    roleId?: string
}

export default function Permissions() {
    const [permissions, setPermissions] = useState<Permission[]>([])
    const [page, setPage] = useState(1)
    const [pageCount, setPageCount] = useState(1)
    const [isOpen, setIsOpen] = useState(false)
    const [editingPermission, setEditingPermission] = useState<Permission | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        description:''
    })
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState<string>('')
    const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

    const fetchPermissions = async () => {
        setIsLoading(true)
        try {
            let response
            if (searchQuery) {
                response = await axios.get(`${api}/vendor/permissions/${searchQuery}`)
                setPermissions(response.data || [])
            } else {
                response = await axios.get(`${api}/vendor/permissions`)
                setPermissions(response.data.permissions || [])
                console.log(response.data)
            }
            const { data } = response;
            setPageCount(data.totalPages || 1)
        } catch (error) {
            console.error('Error fetching permissions:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchPermissions();
    }, [page, searchQuery])

    const deletePermission = async (id: string) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            });

            if (result.isConfirmed) {
                const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
                await axios.delete(`${api}/vendor/permissions/${id}`)
                Swal.fire({
                    title: "Permission Deleted Successfully",
                    icon: "success",
                    draggable: true
                });
                fetchPermissions();
            }
        } catch (error) {
            console.error('Error deleting permission:', error)
            Swal.fire({
                title: 'Error!',
                text: 'Failed to delete permission. Please try again.',
                icon: 'error'
            });
        }
    }

    const handleCreateNew = () => {
        setEditingPermission(null);
        setFormData({ name: '',description:''});
        setError('');
        setIsOpen(true);
    }

    const handleEdit = (permission: Permission) => {
        setEditingPermission(permission);
        setFormData({
            name: permission.name,description:permission.description || '',
        });
        setError('');
        setIsOpen(true);
    }

    const handleDialogClose = () => {
        setIsOpen(false);
        setEditingPermission(null);
        setFormData({ name: '', description:''});
        setError('');
    }

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        // Clear error when user starts typing
        console.log(formData)
        if (error) setError('');
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.name.trim()) {
            setError("Permission name is required");
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
            let response;

            const payload = {
                name: formData.name.trim(),
                description:formData.description
            };

            if (editingPermission) {
                // Update existing permission
                response = await axios.patch(`${api}/vendor/permissions/${editingPermission.id}`, payload);
            } else {
                // Create new permission
                response = await axios.post(`${api}/vendor/permissions`, payload);
            }

            Swal.fire({
                title: response.data?.message || `Permission ${editingPermission ? 'updated' : 'created'} successfully`,
                icon: "success",
                draggable: true
            });

            handleDialogClose();
            fetchPermissions();
        } catch (error: any) {
            console.error('Error submitting permission:', error);
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                `Failed to ${editingPermission ? 'update' : 'create'} permission. Please try again.`;
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    const columns: ColumnDef<Permission>[] = [

        {
            accessorKey: 'name',
            header: "Permission Name"
        },
        {
            accessorKey: 'description',
            header: "Descriptions"
        },

        {
            id: "actions",
            header: "Actions",
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
                                    Edit permission
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => deletePermission(item.id)}
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
                        <BreadcrumbLink href="/vendor/roles">Roles</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Permissions</BreadcrumbPage>
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
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">Permissions</h1>
                                <p className="text-muted-foreground">
                                    Manage and track all the permissions
                                </p>
                            </div>
                        </>
                    )}
                </div>
                {isLoading ? (
                    <Skeleton className="h-10 w-32" />
                ) : (
                    <Button onClick={handleCreateNew}>
                        Create New Permission
                    </Button>
                )}
            </div>

            <DataTable
                columns={columns}
                data={permissions}
                pageCount={pageCount}
                currentPage={page}
                onPageChange={setPage}
                onSearch={handleSearch}
                isLoading={isLoading}
            />

            {/* Dialog for Create/Edit Permission */}
            <Dialog open={isOpen} onOpenChange={(open) => {
                if (!open) {
                    handleDialogClose();
                }
                setIsOpen(open);
            }}>
                <DialogContent className="sm:max-w-[500px]">
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle className='text-center'>
                                {editingPermission ? 'Edit Permission' : 'Create New Permission'}
                            </DialogTitle>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="permission-name">Permission Name *</Label>
                                <Input
                                    id="permission-name"
                                    type="text"
                                    placeholder="Enter permission name..."
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    disabled={isLoading}
                                    className={error && !formData.name.trim() ? "border-red-500" : ""}
                                />
                                <Label htmlFor="permission-name" className="mt-4">Permission Description *</Label>
                                <textarea
                                    id="permission-name"
                                    placeholder="Enter description"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    disabled={isLoading}
                                    className="w-full rounded-md border-2 p-2 bg-background"
                                />
                            </div>

                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleDialogClose}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading || !formData.name.trim()}
                            >
                                {isLoading ? 'Loading...' : (editingPermission ? 'Update Permission' : 'Create Permission')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}