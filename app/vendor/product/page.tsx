'use client'

import React, { useEffect, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import axios from 'axios'
import { DataTable } from '../components/dataTable'
import { useRouter } from 'next/navigation'
import { Checkbox } from '../../../components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"
import { Edit, Eye, MoreHorizontal, Trash } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import Swal from 'sweetalert2'
import Link from 'next/link'
import Image from 'next/image'
import { Skeleton } from '../../../components/ui/skeleton'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../components/ui/breadcrumb"

type Product = {
  id: string
  name: string
  category: string
  description: string
  price: number
  stock: number
  defaultImage: string
  colors: string[]
}

export default function ProductTable() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [page, setPage] = useState(1)
  const [pageCount, setPageCount] = useState(1)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [loading, setLoading] = useState(false);

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: 'defaultImage',
      header: 'Image',
      cell: ({ row }) => {
        const imageUrl = row.getValue('defaultImage');
        return (
          <Image
            src={imageUrl as string}
            alt="Item"
            className="w-20 h-25 object-cover rounded-lg border"
          />
        );
      },
    },
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'description',
      header: 'Description',
    },
    {
      accessorKey: 'category',
      header: 'Category',
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: ({ row }) => `₹${row.original.price}`,
    },
    {
      accessorKey: 'stock',
      header: 'Stock',
    },
    {
      header: 'Actions',
      id: 'actions',
      cell: ({ row }) => {
        const product = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(product)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => viewDetails(product)}>
                <Eye className="mr-2 h-4 w-4" />
                View details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDelete(product)}
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

  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'


  const fetchData = async () => {
    try {
      setLoading(true)
      let response
      if (searchQuery) {
        response = await axios.get(`${api}/vendor/product/${searchQuery}`)
        setProducts(response.data || [])
      } else {
        response = await axios.get(`${api}/vendor/product?page=${page}&limit=5`)
        setProducts(response.data?.data || [])
      }
      const { data } = response
      setPageCount(data.totalPages || 1)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [page, searchQuery])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleEdit = (product: Product) => {
    router.push(`/vendor/product/edit/edit/${product.id}`)
  }

  const handleDelete = async (product: Product) => {
    try {
      await axios.delete(`${api}/vendor/product/${product.id}`)
      Swal.fire({
        title: "Product deleted successfully",
        icon: "success",
        draggable: true
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }


  const viewDetails = (product: Product) => {
    router.push(`/vendor/product/edit/view/${product.id}`)
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
            <BreadcrumbPage>Products</BreadcrumbPage>
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
                <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                <p className="text-muted-foreground">
                  Manage and track all the products
                </p>
              </div>
            </>
          )}
        </div>
        {loading ? (
          <Skeleton className="h-10 w-32" />
        ) : (
          <Button >
            <Link href="/vendor/product/create">Insert new product</Link>
          </Button>
        )}
      </div>
      <DataTable
        columns={columns}
        data={products}
        pageCount={pageCount}
        currentPage={page}
        onPageChange={setPage}
        onSearch={handleSearch}
        isLoading={loading}
      />
    </div>
  )
}