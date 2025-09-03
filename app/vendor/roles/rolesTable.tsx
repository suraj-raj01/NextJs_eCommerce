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
import { Skeleton } from '../../../components/ui/skeleton';
import { Checkbox } from '../../../components/ui/checkbox'

type Roles = {
    id: string
    name: string
    permissions: []
    roleId: string
}

type Permissions = {
    id: string
    name: string
}

export default function Roles() {
    const [roles, setRoles] = useState<Roles[]>([])
    const [permissions, setPermissions] = useState<Permissions[]>([])
    const [role, setRole] = useState<string>("")
    const [page, setPage] = useState(1)
    const [pageCount, setPageCount] = useState(1)
    const [error, setError] = useState("");
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [editingRole, setEditingRole] = useState<Roles | null>(null)
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])

    const api = process.env.NEXT_PUBLIC_API_URL || 'https://next-js-e-commerce-gilt-delta.vercel.app/api'

    const fetchRoles = async () => {
        try {
            setLoading(true)
            let response
            if (searchQuery) {
                response = await axios.get(`${api}/vendor/role/${searchQuery}`)
                setRoles(response?.data || [])
            } else {
                response = await axios.get(`${api}/vendor/role`)
                setRoles(response?.data?.roles || [])
                console.log("roles data", response.data)
            }
            const { data } = response
            setPageCount(data.totalPages || 1)
        } catch (error) {
            console.error('Error fetching roles:', error)
        } finally {
            setLoading(false)
        }
    }
   const fetchPermission = async () => {
    try {
        setLoading(true)
        const response = await axios.get(`${api}/vendor/permissions`)
        const permissionsData = response?.data?.permissions || []
        setPermissions(permissionsData)
        // const data = permissionsData.map((item: Permissions) => item.id)
        // setSelectedPermissions(data)
        // console.log(data)
    } catch (error) {
        console.error('Error fetching roles:', error)
    } finally {
        setLoading(false)
    }
}



    useEffect(() => {
        fetchRoles();
        fetchPermission();
    }, [page, searchQuery])

    const deleteRole = async (id: any) => {
        try {
            await axios.delete(`${api}/vendor/role/${id}`)
            Swal.fire({
                title: "Role Deleted Successfully",
                icon: "success",
                draggable: true
            });
            fetchRoles();
        } catch (error) {
            console.error('Error deleting permission:', error)
            alert('Failed to delete Role. Please try again.')
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Basic validation
        if (!role.trim()) {
            setError("Role name is required");
            return;
        }

        // Optional: Use schema validation if available
        try {
            const result = roleSchema.safeParse({ role });
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
                // Update existing role
                response = await axios.patch(`${api}/vendor/role/${editingRole.id}`, { name: role, permissionIds: selectedPermissions });
            } else {
                // Create new role
                response = await axios.post(`${api}/vendor/role`, { name: role, permissionIds: selectedPermissions });
            }

            Swal.fire({
                title: response.data?.message || "Operation completed successfully",
                icon: "success",
                draggable: true
            });
            setSelectedPermissions([])
            handleDialogClose();
            fetchRoles();
        } catch (error: any) {
            console.error('Error submitting role:', error);
            const errorMessage = error.response?.data?.message || 'Failed to submit role. Please try again.';
            setError(errorMessage);
        }
    }

    const handleEdit = (roleData: Roles) => {
        setEditingRole(roleData);
        setRole(roleData.name);
        setIsOpen(true);
    }

    const handleCreateNew = () => {
        setEditingRole(null);
        setRole('');
        setError('');
        setIsOpen(true);
    }

    const handleDialogClose = () => {
        setIsOpen(false);
        setEditingRole(null);
        setRole('');
        setError('');
    }

    const handleCheckboxChange = (permissionId: string) => {
        setSelectedPermissions((prev) =>
            prev.includes(permissionId)
                ? prev.filter((id) => id !== permissionId)
                : [...prev, permissionId]
        )
    }

    const columns: ColumnDef<Roles>[] = [
        {
            accessorKey: 'name',
            header: "Role Name"
        },
        // {
        //     accessorKey: 'permissions',
        //     header: "Permissions Name",
        //     cell: ({ row }) => {
        //         const permissions = row.original.permissions
        //         return (
        //             <div className="flex flex-wrap gap-1">
        //                 {permissions.length > 0 ? permissions.map((perm: any, idx: number) => (
        //                     <span key={idx} className="px-2 py-1 rounded-md text-sm border-1">
        //                         {typeof perm === 'string' ? perm : perm.name}
        //                     </span>
        //                 )) : <span className="italic">No permissions</span>}
        //             </div>
        //         )
        //     }
        // },
        // {
        //     accessorKey: 'permissionsdesc',
        //     header: "Permissions Description",
        //     cell: ({ row }) => {
        //         const permissions = row.original.permissions
        //         return (
        //             <div className="flex flex-wrap gap-1">
        //                 {permissions.length > 0 ? permissions.map((perm: any, idx: number) => (
        //                     <span key={idx} className="px-2 py-1 rounded-md text-sm border-1">
        //                         {typeof perm === 'string' ? perm : perm.description}
        //                     </span>
        //                 )) : <span className="italic">No permissions</span>}
        //             </div>
        //         )
        //     }
        // },
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
                                    Edit role
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
                                <h1 className="text-3xl font-bold tracking-tight">Roles</h1>
                                <p className="text-muted-foreground">
                                    Manage and track all the roles
                                </p>
                            </div>
                        </>
                    )}
                </div>
                {loading ? (
                    <Skeleton className="h-10 w-32" />
                ) : (
                    <Button onClick={handleCreateNew}>
                        Create New Role
                    </Button>
                )}
            </div>

            <DataTable
                columns={columns}
                data={roles}
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
                                {editingRole ? 'Edit Role' : 'Create Role'}
                            </DialogTitle>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="role-name">Role Name *</Label>
                                <Input
                                    id="role-name"
                                    type="text"
                                    placeholder="Enter role name..."
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    required
                                />
                                {error && <p className="text-red-500 text-sm">{error}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>Choose Permissions *</Label>

                                <div className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
                                    {permissions.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-2 rounded-md border p-2"
                                        >
                                            <Checkbox
                                                id={item.id}
                                                checked={selectedPermissions.includes(item.id)} 
                                                onCheckedChange={() => handleCheckboxChange(item.id)}
                                                className='border-1 border-accent-foreground'
                                            />
                                            <Label htmlFor={item.id}>{item.name}</Label>
                                        </div>
                                    ))}
                                </div>
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
                            <Button type="submit" disabled={loading || selectedPermissions.length==0}>
                                {/* {editingRole ? 'Update Role' : 'Create Role'} */}
                                {loading ? 'Loading...' : (editingRole ? 'Update Role' : 'Create Role')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}