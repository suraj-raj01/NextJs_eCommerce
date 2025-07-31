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
import { Skeleton } from '../../../components/ui/skeleton';
import { useParams, useRouter } from 'next/navigation'
import { Edit, MoreHorizontal } from 'lucide-react'

type SiteSetting = {
  id: string
  name: string
  permissions: []
  roleId: string
}

export default function SiteSetting() {
  const [store, setsiteStore] = useState<SiteSetting[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pageCount, setPageCount] = useState(1)
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

  const fetchStore = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${api}/store/sitesetting`)
      setsiteStore(response?.data || [])
      console.log(response?.data)
    } catch (error) {
      console.error('Error fetching sitesetting:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStore();
  }, [])

  const router = useRouter();
  const handleEdit = (item: any) => {
    router.push(`/vendor/sitesettings/edit/${item?.id}`)
  }

  const columns: ColumnDef<SiteSetting>[] = [
    {
      accessorKey: 'companylogo',
      header: "Company Logo"
    },
    {
      accessorKey: 'address',
      header: "Address"
    },
    {
      accessorKey: 'contact',
      header: "Contact"
    },

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
                  Manage Site
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]

  const handleSearch = () =>{

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
                <h1 className="text-3xl font-bold tracking-tight">SiteSetting</h1>
                <p className="text-muted-foreground">
                  Manage and track your site
                </p>
              </div>
            </>
          )}
        </div>
        {loading ? (
          <Skeleton className="h-10 w-32" />
        ) : (
          // <Button >
          //   Create New Role
          // </Button>
          ""
        )}
      </div>

      <DataTable
        columns={columns}
        data={store}
        pageCount={pageCount}
        currentPage={page}
        onPageChange={setPage}
        onSearch={handleSearch}
        isLoading={loading}
      />
    </div>
  )
}