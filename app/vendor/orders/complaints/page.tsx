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
import { useRouter } from 'next/navigation';
import { Skeleton } from '../../../../components/ui/skeleton'

// Define the complaint data type
interface Complaint {
  id: string
  complaint: string
  status: string
  createdAt?: string
  updatedAt?: string
  userId?: string
  [key: string]: any
}


// Main Component
export default function ComplaintDataTable() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(false)
  const [isEditDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)
  const [formData, setFormData] = useState({
    complaint: "",
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
  const ActionsCell = ({ complaint }: { complaint: Complaint }) => {
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
          <DropdownMenuItem onClick={() => openEditDialog(complaint)}>
            <SquarePen className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => viewPage(complaint.id)}>
            <Eye className="mr-2 h-4 w-4" />
            View details
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => deleteComplaint(complaint.id)}
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
            Complaint ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("id")}</div>
      ),
    },
    {
      accessorKey: "complaint",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-transparent p-0"
          >
            Complaint
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="max-w-[300px]">
          <div className="truncate" title={row.getValue("complaint")}>
            {row.getValue("complaint")}
          </div>
        </div>
      ),
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
      header:"Actions",
      cell: ({ row }) => <ActionsCell complaint={row.original} />,
    },
  ]

  // Load complaints from API
  const loadComplaints = async () => {
    setLoading(true)
    try {
      const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
      const response = await axios.get(`${api}/vendor/complaint?page=${page}&limit=5`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      console.log("complaints",response.data)
      setComplaints(response.data.complaints || [])
      setPageCount(response.data.pagination.totalPages || 1)
    } catch (error) {
      console.error('Error fetching complaints:', error)
      Swal.fire({
        title: "Error",
        text: "Failed to load complaints. Please try again later.",
        icon: "error",
        draggable: true
      })
    } finally {
      setLoading(false)
    }
  }

  // Delete complaint
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
        const response = await axios.delete(`${api}/vendor/complaint/${id}`, {
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

        loadComplaints()
      } catch (error) {
        console.error('Error deleting complaint:', error)
        Swal.fire({
          title: "Error",
          text: "Failed to delete complaint. Please try again.",
          icon: "error",
          draggable: true
        })
      }
    }
  }

  // Edit complaint
  const openEditDialog = (complaint: Complaint) => {
    setSelectedComplaint(complaint)
    setFormData({
      complaint: complaint.complaint || "",
      status: complaint.status || ""
    })
    setEditDialogOpen(true)
  }

  const updateComplaint = async () => {
    if (!selectedComplaint) return

    try {
      const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
      await axios.patch(`${api}/vendor/complaint/${selectedComplaint.id}`, {
        complaint: formData.complaint,
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

      loadComplaints()
      setEditDialogOpen(false)
      setSelectedComplaint(null)
    } catch (error) {
      console.error('Error updating complaint:', error)
      Swal.fire({
        title: "Error",
        text: "Failed to update complaint. Please try again.",
        icon: "error",
        draggable: true
      })
    }
  }

  // view page
  const router = useRouter();
  const viewPage=(id:string)=>{
    router.push(`/vendor/orders/complaints/${id}`);
  }

  // Initialize component
  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    setToken(storedToken)
  }, [])

  useEffect(() => {
      loadComplaints()
  }, [page])

  return (
    <div className="container mx-auto p-3">
      {/* Header */}
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
                  <h1 className="text-3xl font-bold tracking-tight">Complaints</h1>
                  <p className="text-muted-foreground">
                    Manage and track all the complaints
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

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={complaints}
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
              <Label htmlFor="complaint">Complaint</Label>
              <textarea
                id="complaint"
                className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                value={formData.complaint}
                onChange={(e) => setFormData(prev => ({ ...prev, complaint: e.target.value }))}
                placeholder="Enter complaint details..."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder="Select status" />
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