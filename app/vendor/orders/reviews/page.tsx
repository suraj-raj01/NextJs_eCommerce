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
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog"
import { Button } from "../../../../components/ui/button"
import {
  MoreHorizontal,
  SquarePen,
  Trash,
  ArrowUpDown,
} from 'lucide-react'
import axios from 'axios'
import Swal from 'sweetalert2'
import { DataTable } from '../../components/dataTable'
import { Input } from '../../../../components/ui/input'
import { Skeleton } from '../../../../components/ui/skeleton'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../../components/ui/breadcrumb"

// Define the comment data type
interface Order {
  netTotal: number;
  conformed: boolean
}

interface Customer {
  email: string;
}

interface Return {
  id: string
  comment: string
  customer: Customer
  createdAt?: string
  updatedAt?: string
  rating?: string
  [key: string]: any
  order: Order
}


// Main Component
export default function ReviewPage() {
  const [review, setReview] = useState<Return[]>([])
  const [loading, setLoading] = useState(false)
  const [isEditDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedComplaint, setSelectedComplaint] = useState<Return | null>(null)
  const [formData, setFormData] = useState({
    comment: "",
    rating: Number(0)
  })
  const [token, setToken] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [pageCount, setPageCount] = useState(1)

  // customer badge component
  const getcustomerBadge = (customer: string) => {
    const customerConfig = {
      'pending': { class: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Pending' },
      'resolved': { class: 'bg-green-100 text-green-800 border-green-200', label: 'Resolved' },
      'rejected': { class: 'bg-red-100 text-red-800 border-red-200', label: 'Rejected' },
      'in-progress': { class: 'bg-blue-100 text-blue-800 border-blue-200', label: 'In Progress' }
    }

    const config = customerConfig[customer as keyof typeof customerConfig] ||
      { class: 'bg-gray-100 text-gray-800 border-gray-200', label: customer }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.class}`}>
        {config.label}
      </span>
    )
  }

  // Actions component
  const ActionsCell = ({ comment }: { comment: Return }) => {
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
          <DropdownMenuItem onClick={() => openEditDialog(comment)}>
            <SquarePen className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => deleteComplaint(comment.id)}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // Define columns
  const columns: ColumnDef<Return>[] = [

    {
      accessorKey: "id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-transparent p-0"
          >
            Review Id
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("id")}</div>
      ),
    },
    {
      accessorKey: "comment",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-transparent p-0"
          >
            Comment
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="max-w-[300px]">
          <div className="truncate ml-2" title={row.getValue("comment")}>
            {row.getValue("comment")}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "customer",
      header: "Customer email",
      cell: ({ row }) => {
        const customer = row.getValue("customer") as Customer;
        return (
          <div className="max-w-[300px]">
            <div className="truncate ml-2" title={customer.email}>
              {customer.email}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "rating",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-transparent p-0"
          >
            Raating
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="max-w-[300px]">
          <div className="truncate ml-4" title={row.getValue("rating")}>
            {row.getValue("rating")}
          </div>
        </div>
      ),
    },
    // {
    //     accessorKey: "order",
    //     header:({column})=>{
    //         return(
    //              <Button
    //                 variant="ghost"
    //                 onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //                 className="hover:bg-transparent p-0"
    //             >
    //                 Order Price
    //                 <ArrowUpDown className=" h-4 w-4" />
    //             </Button>
    //         )
    //     },
    //     cell: ({ row }) => {
    //         const orders = row.original.order
    //         console.log(orders)
    //         return (
    //             <div className="flex flex-wrap gap-1">
    //                 {orders?(
    //                     orders.netTotal+" ₹"
    //                 ):(
    //                     "NULL"
    //                 )}
    //             </div>
    //         )
    //     }
    // },

    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => <ActionsCell comment={row.original} />,
    },
  ]

  // Load review from API
  const loadComplaints = async () => {
    setLoading(true)
    try {
      const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
      const response = await axios.get(`${api}/vendor/review?page=${page}&limit=5`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setReview(response.data.data || [])
      console.log(response.data)
      setPageCount(response.data.meta.totalPages || 1)
      console.log(response.data.meta.totalPages)
    } catch (error) {
      console.error('Error fetching review:', error)
      Swal.fire({
        title: "Error",
        text: "Failed to load review. Please try again later.",
        icon: "error",
        draggable: true
      })
    } finally {
      setLoading(false)
    }
  }

  // Delete comment
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
        const response = await axios.delete(`${api}/vendor/review/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        Swal.fire({
          title: "Deleted!",
          text: response.data.message || "Return has been deleted.",
          icon: "success",
          draggable: true
        })

        loadComplaints()
      } catch (error) {
        console.error('Error deleting comment:', error)
        Swal.fire({
          title: "Error",
          text: "Failed to delete comment. Please try again.",
          icon: "error",
          draggable: true
        })
      }
    }
  }

  // Edit comment
  const openEditDialog = (comment: Return) => {
    setSelectedComplaint(comment)
    setFormData({
      comment: comment.comment || "",
      rating: Number(comment.rating)
    })
    setEditDialogOpen(true)
  }

  const updateComplaint = async () => {
    if (!selectedComplaint) return

    try {
      const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
      await axios.patch(`${api}/vendor/review/${selectedComplaint.id}`, {
        comment: formData.comment,
        rating: formData.rating
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      Swal.fire({
        title: "Success!",
        text: "Return updated successfully",
        icon: "success",
        draggable: true
      })

      loadComplaints()
      setEditDialogOpen(false)
      setSelectedComplaint(null)
    } catch (error) {
      console.error('Error updating comment:', error)
      Swal.fire({
        title: "Error",
        text: "Failed to update comment. Please try again.",
        icon: "error",
        draggable: true
      })
    }
  }

  // Initialize component
  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    setToken(storedToken)
    loadComplaints()
  }, [])

  useEffect(() => {
    if (token) {
      loadComplaints()
    }
  }, [token, page])

  return (
    <div className="container mx-auto p-3">
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
            <BreadcrumbPage>Reviews</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <br />
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
                  <h1 className="text-3xl font-bold tracking-tight">Reviews</h1>
                  <p className="text-muted-foreground">
                    Manage and track all the reviews
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
        data={review}
        pageCount={pageCount}
        currentPage={page}
        onPageChange={setPage}
        isLoading = {loading}
      />

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Ratings</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <textarea
                id="comment"
                className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                value={formData.comment}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, comment: e.target.value }))
                }
                placeholder="Enter comment details..."
              />

              <Input
                className="mt-3"
                id="rating"
                type="number"
                min="1"
                max="5"
                value={formData.rating}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, rating: Number(e.target.value) }))
                }
                placeholder="Enter a rating from 1 to 5"
              />
            </div>


          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={updateComplaint}>Update Rating</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}