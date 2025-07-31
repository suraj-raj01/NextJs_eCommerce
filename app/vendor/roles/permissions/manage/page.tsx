'use client'

import React, { useEffect, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import axios from 'axios'
import { DataTable } from '../../../components/dataTable'
import { Button } from '../../../../../components/ui/button'
import { Trash, Edit, Plus, MoreHorizontal } from 'lucide-react'
import Swal from 'sweetalert2'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../../components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../../components/ui/dropdown-menu"
import { Input } from "../../../../../components/ui/input"
import { Label } from "../../../../../components/ui/label"
import { Skeleton } from '../../../../../components/ui/skeleton'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../../../components/ui/breadcrumb"
import { Checkbox } from '../../../../../components/ui/checkbox'

type Roles = {
  id: string
  name: string
  description?: string
  roles?: []
  roleId?: string
  permissions?: { id: string; name: string }[]
}
type Permission = {
  id: string
  name: string
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Roles[]>([])
  const [permissions, setPermission] = useState<Permission[]>([])
  const [page, setPage] = useState(1)
  const [pageCount, setPageCount] = useState(1)
  const [isOpen, setIsOpen] = useState(false)
  const [editingRoles, setEditingRoles] = useState<Roles | null>(null)
  const [formData, setFormData] = useState({
    name: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

  const fetchRoles = async () => {
    setIsLoading(true)
    try {
      let response
      if (searchQuery) {
        response = await axios.get(`${api}/vendor/role/${searchQuery}`)
        setRoles(response.data || [])
        console.log(response.data)
      } else {
        response = await axios.get(`${api}/vendor/role?page=${page}&limit=5`)
        setRoles(response.data.roles || [])
      }
      const { data } = response;
      setPageCount(data.totalPages || 1)
    } catch (error) {
      console.error('Error fetching roles:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchPermissions = async () => {
    setIsLoading(true)
    try {
      let response
      if (searchQuery) {
        response = await axios.get(`${api}/vendor/permissions/${searchQuery}`)
        setPermission(response.data || [])
        // console.log(response.data)
      } else {
        response = await axios.get(`${api}/vendor/permissions?page=${page}&limit=5`)
        setPermission(response.data.permissions || [])
        // console.log(response.data)
      }
      const { data } = response;
      setPageCount(data.totalPages || 1)
    } catch (error) {
      console.error('Error fetching roles:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRoles();
    fetchPermissions()
  }, [page, searchQuery])

  const deleteRoles = async (id: string) => {
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
        await axios.delete(`${api}/vendor/roles/${id}`)
        Swal.fire({
          title: "Roles Deleted Successfully",
          icon: "success",
          draggable: true
        });
        fetchRoles();
      }
    } catch (error) {
      console.error('Error deleting Roles:', error)
      Swal.fire({
        title: 'Error!',
        text: 'Failed to delete Roles. Please try again.',
        icon: 'error'
      });
    }
  }

  const handleCreateNew = () => {
    setEditingRoles(null);
    setFormData({ name: '' });
    setError('');
    setIsOpen(true);
  }

  const handleEdit = (Roles: Roles) => {
    setEditingRoles(Roles);
    setFormData({
      name: Roles.name || '',
    });
    setError('');
    setIsOpen(true);
  }

  const handleDialogClose = () => {
    setIsOpen(false);
    setEditingRoles(null);
    setFormData({ name: '', });
    setError('');
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      setError("Roles name is required");
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
      let response;

      const payload = {
        name: formData.name.trim(),
      };

      if (editingRoles) {
        // Update existing Roles
        response = await axios.patch(`${api}/vendor/roles/${editingRoles.id}`, payload);
      } else {
        // Create new Roles
        response = await axios.post(`${api}/vendor/roles`, payload);
      }

      Swal.fire({
        title: response.data?.message || `Roles ${editingRoles ? 'updated' : 'created'} successfully`,
        icon: "success",
        draggable: true
      });

      handleDialogClose();
      fetchRoles();
    } catch (error: any) {
      console.error('Error submitting Roles:', error);
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        `Failed to ${editingRoles ? 'update' : 'create'} Roles. Please try again.`;
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  const columns: ColumnDef<Roles>[] = [

    {
      accessorKey: 'name',
      header: "Roles Name"
    },
    {
      accessorKey: 'permissions',
      header: "Assigned Permissions",
      cell: ({ row }) => {
        const rowPermissions = permissions|| []
        console.log(rowPermissions,"RowPermission")
        return (
          <div className="flex flex-wrap gap-2">
            {rowPermissions.map((item, index: number) => (
              <span
                key={item.id || index}
                className="bg-muted px-2 py-1 rounded text-sm text-foreground"
              >
               <div className='flex items-center justify-center gap-2'>
                 <Checkbox/>
                {item.name}
               </div>
              </span>
            ))}
          </div>
        )
      },
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
                {/* 
                <DropdownMenuItem onClick={() => handleEdit(item)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Roles
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => deleteRoles(item.id)}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem> */}
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
            <BreadcrumbLink href="/vendor/roles/permissions">Permissions</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Manage Roles</BreadcrumbPage>
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
                <h1 className="text-3xl font-bold tracking-tight">Roless</h1>
                <p className="text-muted-foreground">
                  Manage and track all the roles
                </p>
              </div>
            </>
          )}
        </div>
        {isLoading ? (
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
        isLoading={isLoading}
      />

      {/* Dialog for Create/Edit Roles */}
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
                {editingRoles ? 'Edit Roles' : 'Create New Roles'}
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="Roles-name">Roles Name *</Label>
                <Input
                  id="Roles-name"
                  type="text"
                  placeholder="Enter Roles name..."
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={isLoading}
                  className={error && !formData.name.trim() ? "border-red-500" : ""}
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
                {isLoading ? 'Saving...' : (editingRoles ? 'Update Roles' : 'Create Roles')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}