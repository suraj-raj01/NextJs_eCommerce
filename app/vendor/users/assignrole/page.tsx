'use client'

import React, { useEffect, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import axios from 'axios'
import { DataTable } from '../../components/dataTable'
import { Button } from '../../../../components/ui/button'
import { Trash, Edit, UserPlus, MoreHorizontal } from 'lucide-react'
import Swal from 'sweetalert2'
import { roleSchema } from '../../../validation/roleSchema';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../../components/ui/breadcrumb"
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../../../components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select'
import { Label } from '../../../../components/ui/label'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu"
import { Skeleton } from '../../../../components/ui/skeleton'

type Role = {
  id: string
  name: string
}

type Users = {
  id: string
  name: string
  email: string
  roles: Role[]
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

  // Role assignment states
  const [isRoleAssignOpen, setIsRoleAssignOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<Users | null>(null)
  const [availableRoles, setAvailableRoles] = useState<Role[]>([])
  const [selectedRoleId, setSelectedRoleId] = useState<string>('')
  const [assignmentLoading, setAssignmentLoading] = useState(false)
  const [loading, setLoading] = useState(false)

  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

  const fetchUser = async () => {
    try {
      setLoading(true)
      let response
      if (searchQuery) {
        response = await axios.get(`${api}/vendor/user/${searchQuery}`)
        setUsers(response.data || [])
      } else {
        response = await axios.get(`${api}/vendor/user?page=${page}&limit=5`)
        setUsers(response.data.data || [])
      }
      const { data } = response
      setPageCount(data.totalPages || 1)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false);
    }
  }

  const fetchAvailableRoles = async () => {
    if (!api) {
      console.error('API URL is not defined')
      return
    }
    try {
      const response = await axios.get(`${api}/vendor/role`)
      setAvailableRoles(response.data.roles || [])
    } catch (error) {
      console.error('Error fetching roles:', error)
    }
  }

  useEffect(() => {
    fetchUser();
    fetchAvailableRoles();
  }, [page, searchQuery])

  const deleteRole = async (id: any) => {
    try {
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
    }
  }

  const router = useRouter();
  const handleEdit = (userData: Users) => {
    const id = userData.id;
    router.push(`/vendor/users/${id}`)
  }

  const handleAssignRole = (userData: Users) => {
    setSelectedUser(userData)
    setIsRoleAssignOpen(true)
    setSelectedRoleId('')
  }

  const handleRoleAssignment = async () => {
    if (!selectedUser || !selectedRoleId) {
      alert('Please select a role to assign')
      return
    }
    console.log("aYEEE", selectedRoleId)
    setAssignmentLoading(true)
    try {
      let ans = await axios.patch(`${api}/vendor/user/${selectedUser.id}`, {
        roleId: selectedRoleId
      })

      Swal.fire({
        title: "Role Assigned Successfully",
        icon: "success",
        draggable: true
      });

      setIsRoleAssignOpen(false)
      setSelectedUser(null)
      setSelectedRoleId('')
      fetchUser();
    } catch (error: any) {
      console.error('Error assigning role:', error)
      const errorMessage = error.response?.data?.message || 'Failed to assign role. Please try again.'
      Swal.fire({
        title: "Error",
        text: errorMessage,
        icon: "error",
        draggable: true
      });
    } finally {
      setAssignmentLoading(false)
    }
  }

  const handleDialogClose = () => {
    setIsOpen(false);
    setEditingRole(null);
    setUser('');
    setError('');
  }

  const handleRoleAssignClose = () => {
    setIsRoleAssignOpen(false)
    setSelectedUser(null)
    setSelectedRoleId('')
  }

  const columns: ColumnDef<Users>[] = [
    {
      accessorKey: 'name',
      header: "User Name"
    },
    {
      accessorKey: 'email',
      header: "User Email"
    },
    {
      accessorKey: 'roles',
      header: "Roles",
      cell: ({ row }) => {
        const roles = row.original.roles
        return (
          <div className="flex flex-wrap gap-1">
            {roles.length > 0 ? roles.map((role: Role, idx: number) => (
              <span key={idx} className="px-2 py-1 rounded text-sm bg-gray-500 text-white">
                {role.name}
              </span>
            )) : <span className="text-gray-400 italic">No roles</span>}
          </div>
        )
      }
    },
    {
      accessorKey: 'assignrole',
      header: "Assign Role",
      cell: ({ row }) => {
        const item = row.original
        return (
          <div className='flex items-center justify-start gap-1'>

            <Button
              size="sm"
              variant="outline"
              className='text-sm'
              onClick={() => handleAssignRole(item)}
            >
              <UserPlus className="h-4 w-4" />Assign
            </Button>

          </div>
        )
      },
    },
    {
      header: "Actions",
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
                  Update user
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
            <BreadcrumbLink href="/vendor/users">Users</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Assign Role</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <br />
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
                <h1 className="text-3xl font-bold tracking-tight">Assing role to user</h1>
                <p className="text-muted-foreground">
                  Manage and track all users
                </p>
              </div>
            </>
          )}
        </div>
        {loading ? (
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
        isLoading={loading}
      />

      {/* Role Assignment Dialog */}
      <Dialog open={isRoleAssignOpen} onOpenChange={setIsRoleAssignOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Assign Role to User</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="user" className="text-right">
                User
              </Label>
              <div className="col-span-3">
                <p className="text-sm font-medium">{selectedUser?.name}</p>
                <p className="text-xs text-gray-500">{selectedUser?.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <div className="col-span-3">
                <Select value={selectedRoleId} onValueChange={(value) => { setSelectedRoleId(value) }} >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent >
                    {availableRoles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleRoleAssignClose}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleRoleAssignment}
              disabled={assignmentLoading || !selectedRoleId}
            >
              {assignmentLoading ? 'Assigning...' : 'Assign Role'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}