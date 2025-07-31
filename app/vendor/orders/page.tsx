'use client'

import React, { useEffect, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import axios from 'axios'
import { DataTable } from '../components/dataTable' // Adjust path as needed
import { Checkbox } from "../../../components/ui/checkbox"
import { Button } from '../../../components/ui/button'
import { Trash, Edit, Eye, MoreHorizontal, RotateCw } from 'lucide-react'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog"
import { Label } from "../../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Badge } from "../../../components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"
import { Skeleton } from '../../../components/ui/skeleton'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../components/ui/breadcrumb"

type Customer = {
  email: string
}

type Order = {
  id: string
  orderNumber?: string
  customer?: Customer
  status: string
  confirmed: boolean
  netTotal?: number
  createdAt?: string
  updatedAt?: string
}

export default function OrderPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [formData, setFormData] = useState({
    status: "",
    confirmed: false
  })
  const [token, setToken] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [pageCount, setPageCount] = useState(1)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState<string>('')

  const router = useRouter()
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

  const loadOrders = async () => {
    try {
      setLoading(true)
      let response
      if (searchQuery) {
        response = await axios.get(`${api}/vendor/order/${searchQuery}`)
        setOrders(response.data || [])
        console.log(response.data)
      } else {
        response = await axios.get(`${api}/vendor/order?page=${page}&limit=5`)
        setOrders(response.data.data || [])
      }
      const { data } = response
      console.log(data);
      setPageCount(data.totalPages || 1)
    } catch (error) {
      console.error('Error fetching orders:', error)
      Swal.fire({
        title: 'Error!',
        text: 'Failed to load orders. Please try again later.',
        icon: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    setToken(storedToken)
    loadOrders()
  }, [page, searchQuery])

  useEffect(() => {
    if (token) {
    }
  }, [page, token])

  const deleteOrder = async (id: string) => {
    try {
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
        const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
        const response = await axios.delete(`${api}/vendor/order/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        Swal.fire({
          title: response.data.message || "Order deleted successfully",
          icon: "success",
          draggable: true
        })
        loadOrders()
      }
    } catch (error) {
      console.error('Error deleting order:', error)
      Swal.fire({
        title: 'Error!',
        text: 'Failed to delete order. Please try again.',
        icon: 'error'
      })
    }
  }

  const handleEdit = (order: Order) => {
    setEditingOrder(order)
    setFormData({
      status: order.status || "",
      confirmed: order.confirmed || false
    })
    setError("")
    setDialogOpen(true)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    setEditingOrder(null)
    setFormData({ status: "", confirmed: false })
    setError("")
  }

  const updateOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingOrder) return

    if (!formData.status.trim()) {
      setError("Status is required")
      return
    }

    try {
      const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
      await axios.patch(`${api}/vendor/order/${editingOrder.id}`, {
        status: formData.status,
        confirmed: formData.confirmed
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      Swal.fire({
        title: "Order updated successfully",
        icon: "success",
        draggable: true
      })

      handleDialogClose()
      loadOrders()
    } catch (error) {
      console.error('Error updating order:', error)
      setError('Failed to update order. Please try again.')
    }
  }

  const viewInvoice = (id: string) => {
    router.push(`/vendor/orders/${id}`)
  }

  const getStatusBadge = (status: string) => {
    const statusColors: { [key: string]: string } = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'processing': 'bg-blue-100 text-blue-800',
      'shipped': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
    }

    return (
      <Badge className={statusColors[status.toLowerCase()] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    )
  }



  const columns: ColumnDef<Order>[] = [
    // {
    //   id: "select",
    //   header: ({ table }) => (
    //     <Checkbox
    //       checked={
    //         table.getIsAllPageRowsSelected() ||
    //         (table.getIsSomePageRowsSelected() && "indeterminate")
    //       }
    //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //       aria-label="Select all"
    //     />
    //   ),
    //   cell: ({ row }) => (
    //     <Checkbox
    //       checked={row.getIsSelected()}
    //       onCheckedChange={(value) => row.toggleSelected(!!value)}
    //       aria-label="Select row"
    //     />
    //   ),
    //   enableSorting: false,
    //   enableHiding: false,
    // },
    {
      accessorKey: 'orderNumber',
      header: "Order Number",
      cell: ({ row }) => {
        const orderNumber = row.original.orderNumber || row.original.id
        return <span className="font-medium">{orderNumber}</span>
      }
    },
    {
      accessorKey: 'customer',
      header: "Customer email",
      cell: ({ row }) => {
        const customerName = row.original.customer?.email
        return customerName || <span className="text-gray-400 italic">N/A</span>
      }
    },
    {
      accessorKey: 'status',
      header: "Status",
      cell: ({ row }) => {
        return getStatusBadge(row.original.status)
      }
    },
    {
      accessorKey: 'confirmed',
      header: "Confirmed",
      cell: ({ row }) => {
        return (
          <Badge variant={row.original.confirmed ? "default" : "secondary"}>
            {row.original.confirmed ? "Yes" : "No"}
          </Badge>
        )
      }
    },
    {
      accessorKey: 'netTotal',
      header: "Total Amount",
      cell: ({ row }) => {
        const amount = row.original.netTotal
        return amount ? `$${amount.toFixed(2)}` : <span className="text-gray-400 italic">N/A</span>
      }
    },
    {
      accessorKey: 'createdAt',
      header: "Created Date",
      cell: ({ row }) => {
        const date = row.original.createdAt
        return date ? new Date(date).toLocaleDateString() : <span className="text-gray-400 italic">N/A</span>
      }
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const order = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => viewInvoice(order.id)}>
                <Eye className="mr-2 h-4 w-4" />
                View Invoice
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(order)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Status
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => deleteOrder(order.id)}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
            <BreadcrumbPage>All Orders</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <br />
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
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
                  <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
                  <p className="text-muted-foreground">
                    Manage and track all the orders
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
      </div>

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={orders}
        pageCount={pageCount}
        currentPage={page}
        onPageChange={setPage}
        onSearch={handleSearch}
        isLoading={loading}
      />

      {/* Edit Order Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        if (!open) {
          handleDialogClose()
        }
        setDialogOpen(open)
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={updateOrder}>
            <DialogHeader>
              <DialogTitle>Update Order Status</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent >
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="confirmed"
                  checked={formData.confirmed}
                  onCheckedChange={(checked) =>
                    setFormData(prev => ({ ...prev, confirmed: !!checked }))
                  }
                />
                <Label htmlFor="confirmed">Mark as confirmed</Label>
              </div>

              {error && (
                <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
                  {error}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleDialogClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!formData.status.trim()}
              >
                Update Order
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}